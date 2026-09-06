from datetime import datetime, timedelta
from typing import Optional
from jose import jwt # type: ignore
from app.core.config import settings


def create_access_token(subject: str, expires_delta: Optional[timedelta] = None):
    to_encode = {"sub": subject, "type": "access"}
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
