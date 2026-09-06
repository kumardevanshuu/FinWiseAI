from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user_model import User


def get_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_by_email_or_username(identifier: str):
    """
    Fetch your details by your email or username.
    This will be used by get_current_user() to validate tokens.
    """
    db = SessionLocal()
    try:
        user = (
            db.query(User)
            .filter((User.email == identifier) | (User.username == identifier))
            .first()
        )
        return user
    finally:
        db.close()
