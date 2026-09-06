from pydantic import BaseModel
from typing import Optional

class TransactionCreate(BaseModel):
    title: str
    amount: float
    category: Optional[str] = None
    type: str
    notes: Optional[str] = None
    date: Optional[str] = None

class TransactionUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    type: Optional[str] = None
    notes: Optional[str] = None
    date: Optional[str] = None
