from typing import Optional, List
from datetime import datetime
import json
import time

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.conversation_model import Conversation
from app.models.message_model import Message
from app.models.user_model import User
from app.core.auth_utils import get_current_user
from app.services.assistant_service import (
    generate_assistant_reply,
    generate_assistant_reply_stream,
)

router = APIRouter()


class StartConversationRequest(BaseModel):
    title: Optional[str] = None


class SendMessageRequest(BaseModel):
    conversation_id: int
    message: str


class StreamMessageRequest(BaseModel):
    conversation_id: int
    message: str


class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    extra: Optional[str] = None
    timestamp: datetime

    model_config = {"from_attributes": True}


class ConversationResponse(BaseModel):
    id: int
    title: Optional[str]
    created_at: datetime
    updated_at: datetime
    summary: Optional[str]
    messages: List[MessageResponse]

    model_config = {"from_attributes": True}

def get_conversation(db: Session, conversation_id: int, user_id: int) -> Conversation:
    conv = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id,
        )
        .first()
    )

    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return conv


@router.delete("/conversations/{conversation_id}")
def delete_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conv = get_conversation(db, conversation_id, current_user.id)

    # cascade="all, delete-orphan" on Conversation.messages means its
    # messages are deleted automatically along with the conversation.
    db.delete(conv)
    db.commit()

    return {"detail": "Conversation deleted"}

@router.post("/start")
def start_conversation(
    payload: StartConversationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conv = Conversation(
        user_id=current_user.id,
        title=payload.title or "New Conversation",
    )

    db.add(conv)
    db.commit()
    db.refresh(conv)

    return {
        "conversation_id": conv.id,
        "title": conv.title,
    }


@router.post("/message")
def send_message(
    payload: SendMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conv = get_conversation(db, payload.conversation_id, current_user.id)

    result = generate_assistant_reply(
        db=db,
        conv=conv,
        user=current_user,
        user_msg=payload.message,
    )

    return {
        "conversation_id": result["conversation_id"],
        "assistant_reply": result["assistant_text"],
        "assistant_message_id": result["assistant_message_id"],
    }


@router.post("/stream_message")
def stream_message(
    payload: StreamMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conv = get_conversation(db, payload.conversation_id, current_user.id)

    def event_generator():
        try:
            for evt in generate_assistant_reply_stream(
                db=db,
                conv=conv,
                user=current_user,
                user_msg=payload.message,
            ):
                # evt is already a dict like {"type":"partial","text":"..."}
                yield f"data: {json.dumps(evt)}\n\n"
                time.sleep(0.001)
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.get("/conversations")
def list_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    convs = (
        db.query(Conversation)
        .filter(Conversation.user_id == current_user.id)
        .order_by(Conversation.updated_at.desc())
        .all()
    )

    response = []
    for conv in convs:
        last_msg = (
            db.query(Message)
            .filter(Message.conversation_id == conv.id)
            .order_by(Message.timestamp.desc())
            .first()
        )

        response.append(
            {
                "id": conv.id,
                "title": conv.title or "New Conversation",
                "updated_at": conv.updated_at,
                "last_message": last_msg.content if last_msg else None,
                "last_message_at": last_msg.timestamp if last_msg else None,
            }
        )

    return response


@router.get("/history/{conversation_id}", response_model=ConversationResponse)
def get_history(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conv = get_conversation(db, conversation_id, current_user.id)

    return {
        "id": conv.id,
        "title": conv.title,
        "created_at": conv.created_at,
        "updated_at": conv.updated_at,
        "summary": conv.summary,
        "messages": conv.messages,
    }
