from sqlalchemy.orm import Session
from app.models.goal_model import Goal
from datetime import datetime
from typing import Optional

def recommend_monthly_saving(goal: Goal) -> Optional[float]:
    """
    Return the monthly amount the user should set aside to meet the goal.
    """
    now = datetime.utcnow()
    if not goal.deadline or not goal.target_amount:
        return None
    remaining = (goal.target_amount or 0) - (goal.saved_amount or 0)
    if remaining <= 0:
        return 0.0
    months_left = max(1, (goal.deadline.year - now.year) * 12 + (goal.deadline.month - now.month))
    return round(remaining / months_left, 2)
