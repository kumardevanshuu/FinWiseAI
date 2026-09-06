# app/routes/charts/category_expense.py (renamed from category.expense.py — dots
# aren't valid in a module path, which is also why this router was never wired up)
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.models.transaction_model import Transaction
from app.core.auth_utils import get_current_user
from app.models.user_model import User

router = APIRouter()

@router.get("/category-expense")
def category_expense(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Returns labels and data arrays for category-wise expenses for the current user.
    """
    results = (
        db.query(Transaction.category, func.sum(Transaction.amount).label("total"))
        .filter(Transaction.user_id == current_user.id)
        .filter(Transaction.type == "expense")
        .group_by(Transaction.category)
        .all()
    )

    labels = []
    data = []
    for category, total in results:
        labels.append(category or "Uncategorized")
        data.append(float(total))

    return {"labels": labels, "data": data}
