from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.models.goal_model import Goal
from app.models.transaction_model import Transaction

def add_contribution_to_goal(db: Session, goal_id: int, amount: float):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise ValueError("Goal not found")

    goal.saved_amount = (goal.saved_amount or 0) + amount   # << FIXED

    db.commit()
    db.refresh(goal)
    return goal


def contributions_from_transactions(db: Session, user_id: int, start: datetime = None, end: datetime = None) -> List[Transaction]:
    q = db.query(Transaction).filter(Transaction.user_id == user_id)

    if start:
        q = q.filter(Transaction.date >= start)
    if end:
        q = q.filter(Transaction.date <= end)

    return q.all()
