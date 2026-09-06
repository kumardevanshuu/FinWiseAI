from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class GoalCreate(BaseModel):
    title: str
    target_amount: float
    saved_amount: float = 0
    deadline: Optional[str] = None


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    target_amount: Optional[float] = None
    saved_amount: Optional[float] = None
    deadline: Optional[str] = None


class GoalResponse(BaseModel):
    id: int
    user_id: int
    title: str
    target_amount: float
    saved_amount: float
    deadline: Optional[date] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
