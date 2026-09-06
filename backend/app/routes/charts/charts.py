from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.session import get_db
from app.models.transaction_model import Transaction
from app.models.user_model import User
from app.core.auth_utils import get_current_user

router = APIRouter()


# ============================
# MONTHLY INCOME CHART
# ============================
@router.get("/income")
def monthly_income_chart(
    year: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    now = datetime.now()
    year = year or now.year

    monthly = {m: 0 for m in range(1, 13)}

    data = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "income",
        Transaction.date >= datetime(year, 1, 1),
        Transaction.date < datetime(year + 1, 1, 1),
    ).all()

    for t in data:
        monthly[t.date.month] += float(t.amount)

    return monthly


# ============================
# MONTHLY EXPENSE CHART
# ============================
@router.get("/expense")
def monthly_expense_chart(
    year: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    now = datetime.now()
    year = year or now.year

    monthly = {m: 0 for m in range(1, 13)}

    data = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "expense",
        Transaction.date >= datetime(year, 1, 1),
        Transaction.date < datetime(year + 1, 1, 1),
    ).all()

    for t in data:
        monthly[t.date.month] += float(t.amount)

    return monthly


# ============================
# CATEGORY PIE CHART
# ============================
@router.get("/categories")
def category_breakdown_chart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    data = db.query(Transaction).filter(
        Transaction.user_id == current_user.id
    ).all()

    categories = {}

    for t in data:
        if t.category not in categories:
            categories[t.category] = 0
        if t.type == "expense":
            categories[t.category] += float(t.amount)

    return categories
