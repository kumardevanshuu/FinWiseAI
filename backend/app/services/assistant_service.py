import logging
from sqlalchemy.orm import Session
from typing import List, Dict, Optional, Generator
from datetime import datetime
import itertools
import json
import re
import time

from app.core.config import settings
from app.models.user_model import User
from app.models.conversation_model import Conversation
from app.models.message_model import Message
from app.models.transaction_model import Transaction

try:
    from app.models.goal_model import Goal
except:
    Goal = None

# GROQ CLIENT
from groq import Groq
groq_client = Groq(api_key=settings.GROQ_API_KEY)

logger = logging.getLogger(__name__)


# FETCH USER DATA HELPERS
def fetch_user_profile(db: Session, user_id: int) -> dict:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {}

    return {
        "id": user.id,
        "name": user.name,
        "username": user.username,
        "email": user.email,
        "currency": user.currency,
        "language": user.language,
    }


def fetch_recent_transactions(db: Session, user_id: int, limit: int = 20) -> List[dict]:
    try:
        txns = (
            db.query(Transaction)
            .filter(Transaction.user_id == user_id)
            .order_by(Transaction.date.desc())
            .limit(limit)
            .all()
        )
    except:
        return []

    output = []
    for t in txns:
        output.append({
            "id": t.id,
            "title": t.title,
            "amount": float(t.amount) if t.amount else None,
            "category": t.category,
            "type": t.type,
            "date": t.date.isoformat() if t.date else None,
        })
    return output


def fetch_goals(db: Session, user_id: int):
    if Goal is None:
        return []

    try:
        goals = db.query(Goal).filter(Goal.user_id == user_id).all()
    except:
        return []

    output = []
    for g in goals:
        output.append({
            "id": g.id,
            "title": g.title,
            "target_amount": float(getattr(g, "target_amount", 0)),
            "saved_amount": float(getattr(g, "saved_amount", 0)),
            "deadline": g.deadline.isoformat() if getattr(g, "deadline", None) else None,
        })
    return output


def compute_basic_analytics(transactions: List[dict]) -> dict:
    income = sum(t["amount"] for t in transactions if t.get("type") == "income" and t.get("amount"))
    expense = sum(t["amount"] for t in transactions if t.get("type") == "expense" and t.get("amount"))

    categories = {}
    for t in transactions:
        cat = t.get("category") or "uncategorized"
        categories.setdefault(cat, 0)
        if t.get("amount"):
            categories[cat] += t["amount"]

    top_categories = sorted(categories.items(), key=lambda x: x[1], reverse=True)[:5]

    return {
        "total_income": income,
        "total_expense": expense,
        "net": income - expense,
        "top_categories": top_categories,
    }


# CONVERSATION HELPERS
def get_recent_messages(db: Session, conv: Conversation, limit: int = None):
    limit = limit or settings.LLM_MAX_HISTORY_MESSAGES
    msgs = (
        db.query(Message)
        .filter(Message.conversation_id == conv.id)
        .order_by(Message.timestamp.desc())
        .limit(limit)
        .all()
    )
    return list(reversed(msgs))


def build_prompt_messages(profile, goals, analytics, recent_messages, summary):
    system_prompt = (
        "You are FinWiseAI — a personalized finance assistant. "
        "Use the provided user profile, goals, transactions, analytics, and memory summary "
        "to generate concise, helpful financial guidance."
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "system", "content": f"User Profile: {profile}"},
        {"role": "system", "content": f"User Goals: {goals}"},
        {"role": "system", "content": f"Analytics Summary: {analytics}"},
    ]

    if summary:
        messages.append({"role": "system", "content": f"Conversation Summary: {summary}"})

    for m in recent_messages:
        messages.append({"role": m.role, "content": m.content})

    return messages


# NON-STREAMING FALLBACK CALL
def call_llm(messages):
    try:
        resp = groq_client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=messages,
            temperature=0.3,
            max_tokens=800,
        )
        return resp.choices[0].message.content
    except Exception as e:
        logger.exception("Groq API Error")
        return f"[Groq Error] {str(e)}"


# SUMMARIZATION LOGIC
def summarize_if_needed(db: Session, conv: Conversation):

    msg_count = db.query(Message).filter(Message.conversation_id == conv.id).count()

    # Only summarize once every threshold
    if msg_count < settings.LLM_SUMMARY_TRIGGER:
        return conv.summary

    recent = get_recent_messages(db, conv, limit=30)

    summary_prompt = (
        [{"role": "system", "content": settings.LLM_SUMMARY_PROMPT}]
        + [{"role": m.role, "content": m.content} for m in recent]
    )

    new_summary = call_llm(summary_prompt)

    conv.summary = new_summary
    db.commit()
    db.refresh(conv)

    return new_summary


# STANDARD (NON-STREAMING) AI REPLY
def generate_assistant_reply(db: Session, conv: Conversation, user: User, user_msg: str):

    # Save user message
    um = Message(conversation_id=conv.id, role="user", content=user_msg)
    db.add(um)
    db.commit()
    db.refresh(um)

    # Build context
    profile = fetch_user_profile(db, user.id)
    transactions = fetch_recent_transactions(db, user.id, limit=40)
    goals = fetch_goals(db, user.id)
    analytics = compute_basic_analytics(transactions)
    recent_msgs = get_recent_messages(db, conv)
    summary = conv.summary

    prompt = build_prompt_messages(profile, goals, analytics, recent_msgs, summary)

    # LLM call
    ai_text = call_llm(prompt)

    # Save assistant message
    am = Message(conversation_id=conv.id, role="assistant", content=ai_text)
    db.add(am)
    db.commit()
    db.refresh(am)

    summarize_if_needed(db, conv)

    return {
        "assistant_text": ai_text,
        "assistant_message_id": am.id,
        "conversation_id": conv.id,
    }


# HELPER: CHUNK TEXT (FALLBACK MODE)
def _chunk_text(text: str, max_chars: int = 200) -> Generator[str, None, None]:
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())

    if len(sentences) == 1:
        # No sentence boundaries → fixed chunks
        for i in range(0, len(text), max_chars):
            yield text[i:i + max_chars]
    else:
        chunk = ""
        for s in sentences:
            if len(chunk) + len(s) + 1 <= max_chars:
                chunk = (chunk + " " + s).strip()
            else:
                if chunk:
                    yield chunk
                chunk = s
        if chunk:
            yield chunk


# FULLY FIXED GROQ STREAMING IMPLEMENTATION
def generate_assistant_reply_stream(db: Session, conv: Conversation, user: User, user_msg: str):
    """
    Yields:
      {"type":"partial","text":"..."}
      {"type":"done","text":"...","assistant_message_id":123}
      {"type":"error","message":"..."}
    """

    # Save user message
    user_message = Message(
        conversation_id=conv.id,
        role="user",
        content=user_msg
    )
    db.add(user_message)
    db.commit()
    db.refresh(user_message)

    # Build complete context
    profile = fetch_user_profile(db, user.id)
    transactions = fetch_recent_transactions(db, user.id, limit=40)
    goals = fetch_goals(db, user.id)
    analytics = compute_basic_analytics(transactions)
    recent_msgs = get_recent_messages(db, conv)
    summary = conv.summary

    prompt = build_prompt_messages(profile, goals, analytics, recent_msgs, summary)

    final_text = ""

    #TRUE STREAMING WITH Groq
    try:
        stream = groq_client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=prompt,
            stream=True,
            temperature=0.3,
            max_tokens=800
        )

        for chunk in stream:
            try:
                delta = chunk.choices[0].delta.content or ""
                if delta:
                    final_text += delta
                    yield {"type": "partial", "text": delta}
            except:
                continue

    except Exception as e:
        # Streaming failed fallback to normal mode
        try:
            final_text = call_llm(prompt)
            for part in _chunk_text(final_text):
                yield {"type": "partial", "text": part}
        except Exception as e2:
            yield {"type": "error", "message": f"LLM error: {str(e2)}"}
            return

    # Save assistant message
    try:
        ai_msg = Message(
            conversation_id=conv.id,
            role="assistant",
            content=final_text
        )
        db.add(ai_msg)
        db.commit()
        db.refresh(ai_msg)

        yield {
            "type": "done",
            "text": final_text,
            "assistant_message_id": ai_msg.id
        }

        summarize_if_needed(db, conv)

    except Exception as e:
        yield {"type": "error", "message": f"DB save error: {str(e)}"}
