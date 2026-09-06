# app/api/v1/endpoints/recommendations.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.session import get_db
from app.models.transaction_model import Transaction
from app.models.user_model import User
from app.core.auth_utils import get_current_user

router = APIRouter()


# ============================================
# Financial summary helper
# ============================================
def get_fin_summary(db: Session, user_id: int):
    txns = db.query(Transaction).filter(Transaction.user_id == user_id).all()

    total_income = sum(float(t.amount) for t in txns if t.type == "income")
    total_expense = sum(float(t.amount) for t in txns if t.type == "expense")
    balance = total_income - total_expense

    return txns, total_income, total_expense, balance


# ============================================
# Request Schema
# ============================================
class AIQuery(BaseModel):
    query: str


# ============================================
# AI ANALYZE ENDPOINT (Fixes frontend)
# ============================================
@router.post("/analyze")
def analyze_query(
    payload: AIQuery,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_query = payload.query.strip().lower()

    txns, total_income, total_expense, balance = get_fin_summary(db, current_user.id)

    # --------------------------
    # Very simple intelligent reply
    # --------------------------
    reply = ""

    if "income" in user_query:
        reply = f"Your total income so far is ₹{total_income}."

    elif "expense" in user_query or "spent" in user_query:
        reply = f"You have spent ₹{total_expense} so far."

    elif "balance" in user_query or "left" in user_query:
        reply = f"Your current balance is ₹{balance}."

    elif "advice" in user_query or "suggest" in user_query:
        if balance < 0:
            reply = "You are spending more than your income. Reduce non-essential expenses immediately."
        elif balance < 2000:
            reply = "Your balance is low. Try tracking daily expenses to save more."
        else:
            reply = "Great! You have a healthy balance. Consider investing a portion every month."

    else:
        reply = (
            "I am here to help! You can ask me things like:\n"
            "- 'How much did I spend?'\n"
            "- 'What is my balance?'\n"
            "- 'Give me financial advice'\n"
            "- 'How much income do I have?'"
        )

    return {
        "response": reply,
        "income": total_income,
        "expense": total_expense,
        "balance": balance,
    }


# ============================================
# Original GET endpoint (still works)
# ============================================
@router.get("/")
def ai_basic_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    txns, total_income, total_expense, balance = get_fin_summary(db, current_user.id)

    suggestions = []

    if total_expense > total_income:
        suggestions.append("Your expenses exceed your income. Reduce non-essential spending.")
    else:
        suggestions.append("Good job! Income is higher than expenses.")

    return {
        "income": total_income,
        "expense": total_expense,
        "balance": balance,
        "recommendations": suggestions,
    }
