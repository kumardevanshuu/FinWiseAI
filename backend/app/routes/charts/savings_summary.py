from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.db.session import get_db
from app.models.transaction_model import Transaction
from app.core.auth_utils import get_current_user
from app.models.user_model import User

router = APIRouter()

@router.get("/savings-summary")
def savings_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user), days: int = 30):
    """
    Returns a simple savings summary: total income, total expense, net savings in last `days`.
    """
    now = datetime.utcnow()
    start = now - timedelta(days=days)

    total_income = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "income",
        Transaction.date >= start
    ).scalar() or 0.0

    total_expense = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "expense",
        Transaction.date >= start
    ).scalar() or 0.0

    return {
        "period_days": days,
        "income": float(total_income),
        "expense": float(total_expense),
        "net_savings": float(total_income) - float(total_expense)
    }
