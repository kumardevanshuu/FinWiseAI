from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, TIMESTAMP, text
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    title = Column(String, nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    category = Column(String, nullable=False)

    # "income" or "expense"
    type = Column(String, nullable=False)

    # Optional notes
    notes = Column(String, nullable=True)

    # Timestamp
    date = Column(
        TIMESTAMP(timezone=True),
        server_default=text("CURRENT_TIMESTAMP"),
    )

    # Relationship (not mandatory but useful)
    user = relationship("User", backref="transactions")
