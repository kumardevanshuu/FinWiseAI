# app/services/notification_service.py
import logging
from typing import List, Dict
from datetime import datetime, timedelta
from app.db.session import get_db
from sqlalchemy.orm import Session
from app.models.goal_model import Goal

logger = logging.getLogger("notification_service")

def check_goals_and_generate_notifications(db: Session):
    """
    Simple routine: find goals near deadline or with low progress and return notifications.
    This can be called from a scheduler (cron) or invoked on login.
    """
    now = datetime.utcnow()
    soon = now + timedelta(days=7)
    notifications = []
    goals = db.query(Goal).all()
    for g in goals:
        progress = ((g.saved_amount or 0) / (g.target_amount or 1)) * 100
        if g.deadline and g.deadline <= soon and progress < 80:
            notifications.append({
                "type": "goal_near_deadline",
                "goal_id": g.id,
                "message": f"Goal '{g.title}' is nearing its deadline on {g.deadline.date()} and progress is {progress:.0f}%"
            })
        if progress >= 100:
            notifications.append({
                "type": "goal_completed",
                "goal_id": g.id,
                "message": f"Goal '{g.title}' completed. Well done!"
            })
    return notifications
