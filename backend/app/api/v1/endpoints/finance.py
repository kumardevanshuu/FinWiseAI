from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.session import get_db
from app.models.transaction_model import Transaction
from app.models.user_model import User
from app.core.auth_utils import get_current_user

router = APIRouter()


@router.get("/")
def finance_summary(
    month: int | None = None,
    year: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Default month/year = current
    now = datetime.now()
    month = month or now.month
    year = year or now.year

    # Date range calculation
    start_date = datetime(year, month, 1)
    end_month = month + 1 if month < 12 else 1
    end_year = year if month < 12 else year + 1
    end_date = datetime(end_year, end_month, 1)

    # Query transactions
    transactions = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.date >= start_date,
        Transaction.date < end_date
    ).all()

    # Totals
    total_income = sum(float(t.amount) for t in transactions if t.type == "income")
    total_expense = sum(float(t.amount) for t in transactions if t.type == "expense")
    net_balance = total_income - total_expense

    # Remaining budget calculation
    remaining_budget = total_income - total_expense

    # Category Breakdown
    categories = {}
    for t in transactions:
        cat = t.category
        amount = float(t.amount)

        if cat not in categories:
            categories[cat] = {"income": 0, "expense": 0}

        categories[cat][t.type] += amount

    # Find highest spending category
    highest_category = None
    max_spent = 0

    for cat, values in categories.items():
        if values["expense"] > max_spent:
            highest_category = {
                "category": cat,
                "amount": round(values["expense"], 2)
            }
            max_spent = values["expense"]

    # Overspending detection
    overspending = total_expense > total_income

    return {
        "month": month,
        "year": year,
        "total_income": round(total_income, 2),
        "total_expense": round(total_expense, 2),
        "net_balance": round(net_balance, 2),
        "remaining_budget": round(remaining_budget, 2),
        "overspending": overspending,
        "highest_category": highest_category,
        "category_breakdown": categories,
    }
