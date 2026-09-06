from pydantic import BaseModel, EmailStr
from typing import Optional


# Base User Schema
class UserBase(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    email: EmailStr


# CREATE USER (Admin use)
class UserCreate(UserBase):
    password: str


# UPDATE USER
class UserUpdate(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    email: Optional[EmailStr] = None


# USER RESPONSE
class UserResponse(UserBase):
    id: int
    currency: Optional[str] = None
    theme: Optional[str] = None
    language: Optional[str] = None
    avatar_url: Optional[str] = None

    model_config = {"from_attributes": True}


