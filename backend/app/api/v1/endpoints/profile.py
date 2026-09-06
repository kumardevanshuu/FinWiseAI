# app/api/v1/endpoints/profile.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext

from app.db.session import get_db
from app.models.user_model import User
from app.core.auth_utils import get_current_user

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ============================
# Schemas
# ============================
class ProfileUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    username: str | None = None


class PasswordUpdate(BaseModel):
    old_password: str
    new_password: str


# ============================
# GET PROFILE
# ============================
@router.get("/")
def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "username": current_user.username,
        "currency": current_user.currency,
        "theme": current_user.theme,
        "language": current_user.language,
        "avatar_url": current_user.avatar_url,
    }


# ============================
# UPDATE PROFILE
# ============================
@router.put("/")
def update_profile(
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(404, "User not found")

    if payload.name:
        user.name = payload.name

    if payload.email:
        user.email = payload.email

    if payload.username:
        user.username = payload.username

    db.commit()
    db.refresh(user)

    return {"message": "Profile updated successfully"}


# ============================
# UPDATE PASSWORD
# ============================
@router.put("/password")
def update_password(
    payload: PasswordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == current_user.id).first()

    if not pwd_context.verify(payload.old_password, user.hashed_password):
        raise HTTPException(400, "Old password is incorrect")

    user.hashed_password = pwd_context.hash(payload.new_password)
    db.commit()

    return {"message": "Password updated successfully"}
