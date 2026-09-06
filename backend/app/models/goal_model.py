from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    title = Column(String, nullable=False)
    target_amount = Column(Numeric(12, 2), nullable=False)
    saved_amount = Column(Numeric(12, 2), default=0)   # << FIXED NAME

    deadline = Column(Date, nullable=True)
    status = Column(String, default="active")  # active, completed, archived

    # Relationship to User
    user = relationship("User", backref="goals")
