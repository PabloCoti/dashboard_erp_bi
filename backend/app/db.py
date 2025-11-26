"""
Lightweight JSON persistence helpers.

We intentionally keep persistence simple (JSON file) per the project
requirements — no external DB is needed. These helpers ensure the
data file exists and provide simple read/write operations for the
transactions list.
"""

import os
import json
from typing import List, Dict

DATA_FILE = os.getenv("TRANSACTIONS_FILE", "./data/transactions.json")


def ensure_data_file():
    dirpath = os.path.dirname(DATA_FILE)
    if dirpath and not os.path.exists(dirpath):
        os.makedirs(dirpath, exist_ok=True)
    if not os.path.exists(DATA_FILE):
        # create an empty list file if it's missing
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump([], f)


def read_transactions() -> List[Dict]:
    ensure_data_file()
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def write_transactions(items: List[Dict]):
    ensure_data_file()
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2, ensure_ascii=False)
