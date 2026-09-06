from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional

from app.db.session import get_db
from app.models.transaction_model import Transaction
from app.models.user_model import User
from app.core.auth_utils import get_current_user
from app.schemas.transaction_schema import TransactionCreate, TransactionUpdate

router = APIRouter()

@router.post("/")
def create_transaction(
    payload: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if payload.type not in ["income", "expense"]:
        raise HTTPException(400, "Transaction type must be income or expense")

    txn_date = None
    if payload.date:
        try:
            txn_date = datetime.fromisoformat(payload.date)
        except:
            raise HTTPException(400, "Date must be YYYY-MM-DD")

    txn = Transaction(
        title=payload.title,
        amount=payload.amount,
        category=payload.category,
        type=payload.type,
        notes=payload.notes,
        date=txn_date,
        user_id=current_user.id,
    )

    db.add(txn)
    db.commit()
    db.refresh(txn)

    return {"message": "Transaction added", "transaction_id": txn.id}


@router.get("/")
def get_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return (
        db.query(Transaction)
        .filter(Transaction.user_id == current_user.id)
        .order_by(Transaction.date.desc())
        .all()
    )

@router.put("/{txn_id}")
def update_transaction(
    txn_id: int,
    payload: TransactionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    txn = db.query(Transaction).filter(
        Transaction.id == txn_id,
        Transaction.user_id == current_user.id
    ).first()

    if not txn:
        raise HTTPException(404, "Transaction not found")

    if payload.type and payload.type not in ["income", "expense"]:
        raise HTTPException(400, "Invalid type")

    if payload.title:
        txn.title = payload.title

    if payload.amount is not None:
        txn.amount = payload.amount

    if payload.category:
        txn.category = payload.category

    if payload.type:
        txn.type = payload.type

    if payload.notes:
        txn.notes = payload.notes

    if payload.date:
        try:
            txn.date = datetime.fromisoformat(payload.date)
        except:
            raise HTTPException(400, "Invalid date format")

    db.commit()
    db.refresh(txn)

    return {"message": "Transaction updated"}


@router.delete("/{txn_id}")
def delete_transaction(
    txn_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    txn = db.query(Transaction).filter(
        Transaction.id == txn_id,
        Transaction.user_id == current_user.id
    ).first()

    if not txn:
        raise HTTPException(404, "Transaction not found")

    db.delete(txn)
    db.commit()

    return {"message": "Transaction deleted"}
