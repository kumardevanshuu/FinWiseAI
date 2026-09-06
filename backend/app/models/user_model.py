# app/models/user_model.py

from sqlalchemy import Column, Integer, String, TIMESTAMP, text
from app.db.base_class import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    # Identity fields
    username = Column(String, unique=True, index=True, nullable=True)
    name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)

    # Authentication
    hashed_password = Column(String, nullable=False)

    # Preferences
    currency = Column(String, default="INR")
    theme = Column(String, default="light")
    language = Column(String, default="en")
    avatar_url = Column(String, nullable=True)

    # Metadata
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=text("CURRENT_TIMESTAMP")
    )
