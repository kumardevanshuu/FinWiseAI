# app/services/email_verification.py
import uuid
import time
from typing import Dict
from app.services.email_service import send_email

# Very basic in-memory store — replace with DB or cache in production
_verification_store: Dict[str, Dict] = {}

def create_verification_token(user_id: int, email: str, ttl_seconds: int = 3600):
    token = str(uuid.uuid4())
    _verification_store[token] = {"user_id": user_id, "email": email, "expires_at": time.time() + ttl_seconds}
    return token

def verify_token(token: str):
    data = _verification_store.get(token)
    if not data:
        return False
    if data["expires_at"] < time.time():
        del _verification_store[token]
        return False
    # In production, update user.email_verified etc.
    del _verification_store[token]
    return True

def send_verification_email(user_id: int, email: str, frontend_verify_url: str):
    token = create_verification_token(user_id, email)
    link = f"{frontend_verify_url}?token={token}"
    subject = "Verify your FinWiseAI email"
    body = f"Click to verify your email: {link}"
    send_email(email, subject, body)
    return token
