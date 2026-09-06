from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import extract, func
from datetime import datetime
from app.db.session import get_db
from app.models.transaction_model import Transaction
from app.core.auth_utils import get_current_user
from app.models.user_model import User

router = APIRouter()

def empty_month_template():
    return {"labels": ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], "data": [0]*12}

@router.get("/monthly-trend")
def monthly_trend(db: Session = Depends(get_db), current_user: User = Depends(get_current_user), year: int = None):
    """
    Returns monthly totals for income and expense for given year (default: current year).
    """
    now = datetime.utcnow()
    year = year or now.year

    income_q = (
        db.query(extract('month', Transaction.date).label("month"), func.sum(Transaction.amount).label("total"))
        .filter(Transaction.user_id == current_user.id)
        .filter(Transaction.type == "income")
        .filter(extract('year', Transaction.date) == year)
        .group_by("month")
        .all()
    )

    expense_q = (
        db.query(extract('month', Transaction.date).label("month"), func.sum(Transaction.amount).label("total"))
        .filter(Transaction.user_id == current_user.id)
        .filter(Transaction.type == "expense")
        .filter(extract('year', Transaction.date) == year)
        .group_by("month")
        .all()
    )

    inc_template = empty_month_template()
    exp_template = empty_month_template()

    for m, tot in income_q:
        inc_template["data"][int(m)-1] = float(tot)
    for m, tot in expense_q:
        exp_template["data"][int(m)-1] = float(tot)

    return {"year": year, "income": inc_template, "expense": exp_template}
