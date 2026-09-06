# app/routes/summary.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.session import get_db
from app.models.transaction_model import Transaction
from app.models.goal_model import Goal
from app.models.user_model import User
from app.core.auth_utils import get_current_user

router = APIRouter()


@router.get("/")
def overall_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # ============================
    # TRANSACTIONS SUMMARY
    # ============================
    transactions = db.query(Transaction).filter(
        Transaction.user_id == current_user.id
    ).all()

    total_income = sum(float(t.amount) for t in transactions if t.type == "income")
    total_expense = sum(float(t.amount) for t in transactions if t.type == "expense")
    net_balance = total_income - total_expense

    # ============================
    # GOALS SUMMARY
    # ============================
    goals = db.query(Goal).filter(
        Goal.user_id == current_user.id
    ).all()

    total_goals = len(goals)
    completed_goals = len([g for g in goals if g.status == "completed"])
    active_goals = len([g for g in goals if g.status == "active"])

    return {
        "total_transactions": len(transactions),
        "total_income": round(total_income, 2),
        "total_expense": round(total_expense, 2),
        "net_balance": round(net_balance, 2),

        "total_goals": total_goals,
        "active_goals": active_goals,
        "completed_goals": completed_goals,
    }
