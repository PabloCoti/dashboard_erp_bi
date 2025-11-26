"""
Pydantic schemas for transaction data.

Keeping schemas in a separate module improves reusability and
keeps validation logic centralized. These models are used by
FastAPI endpoints to validate request bodies and serialize responses.
"""

from pydantic import BaseModel


class TransactionBase(BaseModel):
    # Basic transaction fields expected from clients
    date: str
    description: str
    amount: float
    category: str


class Transaction(TransactionBase):
    # Transaction returned by the API includes the auto-generated id
    id: int
