"""
API routes for transactions.

Endpoints are intentionally simple and map directly to the JSON
store operations. Validation is handled by Pydantic models declared
in `schemas.py` and enforced by FastAPI on request parsing.
"""

from fastapi import APIRouter, HTTPException
from typing import List, Dict
from . import db
from .schemas import TransactionBase, Transaction

router = APIRouter()


@router.get("/transactions", response_model=List[Transaction])
def get_transactions():
    """Return all stored transactions."""
    return db.read_transactions()


@router.post("/transactions", response_model=Transaction)
def add_transaction(tr: TransactionBase):
    """Add a new transaction and assign an auto-incrementing id."""
    items = db.read_transactions()
    next_id = 1
    if items:
        try:
            next_id = max(int(it.get("id", 0)) for it in items) + 1
        except Exception:
            next_id = len(items) + 1
    new = tr.dict()
    new["id"] = next_id
    items.append(new)
    db.write_transactions(items)
    return new


@router.get("/transactions/summary")
def get_summary():
    """Return simple aggregated totals: income, expense and net."""
    items = db.read_transactions()
    total_income = sum(it["amount"] for it in items if it["amount"] > 0)
    total_expense = sum(it["amount"] for it in items if it["amount"] < 0)
    net_total = total_income + total_expense
    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "net_total": net_total,
    }


@router.get("/transactions/summary_by_category")
def summary_by_category():
    """Group totals by category (bonus endpoint)."""
    items = db.read_transactions()
    by_cat = {}
    for it in items:
        cat = it.get("category", "Uncategorized")
        by_cat[cat] = by_cat.get(cat, 0) + it["amount"]
    return by_cat
