from typing import Dict, Any
from sqlalchemy.orm import Session
from app.models.transaction_model import Transaction
from datetime import datetime, timedelta

def evaluate_monthly_budget(db: Session, user_id: int, category_budgets: Dict[str, float], period_days: int = 30):
    """
    Compare actual spend vs budgets and return suggestions.
    """
    now = datetime.utcnow()
    start = now - timedelta(days=period_days)
    totals = {}
    q = db.query(Transaction.category, Transaction.amount).filter(Transaction.user_id == user_id, Transaction.date >= start, Transaction.type == "expense")
    for cat, amt in q.all():
        k = cat or "Uncategorized"
        totals[k] = totals.get(k, 0.0) + float(amt)

    report = {"over": [], "under": [], "within": []}
    for cat, budget in category_budgets.items():
        spent = totals.get(cat, 0.0)
        if spent > budget:
            report["over"].append({"category": cat, "spent": spent, "budget": budget})
        elif spent < budget * 0.9:
            report["under"].append({"category": cat, "spent": spent, "budget": budget})
        else:
            report["within"].append({"category": cat, "spent": spent, "budget": budget})
    return {"totals": totals, "report": report}
