from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.goal_model import Goal
from app.models.user_model import User
from app.core.auth_utils import get_current_user

router = APIRouter()


@router.get("/")
def get_goal_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goals = db.query(Goal).filter(Goal.user_id == current_user.id).all()

    total_goals = len(goals)
    active_goals = len([g for g in goals if g.status == "active"])
    completed_goals = len([g for g in goals if g.status == "completed"])

    total_target = sum(float(g.target_amount or 0) for g in goals)
    total_saved = sum(float(g.saved_amount or 0) for g in goals)
    overall_progress = round((total_saved / total_target) * 100, 2) if total_target else 0.0

    return {
        "total_goals": total_goals,
        "active_goals": active_goals,
        "completed_goals": completed_goals,
        "total_target_amount": round(total_target, 2),
        "total_saved_amount": round(total_saved, 2),
        "overall_progress_percent": overall_progress,
    }
