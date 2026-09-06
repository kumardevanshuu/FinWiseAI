from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

from app.db.session import get_db
from app.models.goal_model import Goal
from app.models.user_model import User
from app.core.auth_utils import get_current_user
from app.schemas.goal_schema import GoalCreate, GoalUpdate

router = APIRouter()


@router.post("/")
def create_goal(
    data: GoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deadline_date = None
    if data.deadline:
        try:
            deadline_date = date.fromisoformat(data.deadline)
        except ValueError:
            raise HTTPException(400, "Invalid date format (use YYYY-MM-DD)")

    goal = Goal(
        title=data.title,
        target_amount=data.target_amount,
        saved_amount=data.saved_amount,
        deadline=deadline_date,
        user_id=current_user.id,
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return {"message": "Goal created successfully", "goal": goal}


@router.get("/")
def get_goals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Goal).filter(Goal.user_id == current_user.id).all()


@router.put("/{goal_id}")
def update_goal(
    goal_id: int,
    data: GoalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(404, "Goal not found")

    if data.title is not None:
        goal.title = data.title
    if data.target_amount is not None:
        goal.target_amount = data.target_amount
    if data.saved_amount is not None:
        goal.saved_amount = data.saved_amount
    if data.deadline is not None:
        try:
            goal.deadline = date.fromisoformat(data.deadline)
        except ValueError:
            raise HTTPException(400, "Invalid deadline format")

    db.commit()
    db.refresh(goal)
    return {"message": "Goal updated successfully", "goal": goal}


@router.delete("/{goal_id}")
def delete_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(404, "Goal not found")

    db.delete(goal)
    db.commit()
    return {"message": "Goal deleted successfully"}
