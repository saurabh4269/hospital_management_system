from __future__ import annotations

import json
from pathlib import Path
from typing import List

from app.schemas import HospitalNode

_DATA_DIR = Path(__file__).resolve().parents[1] / "data"
_HOSPITALS_FILE = _DATA_DIR / "mock_hospitals.json"


def list_hospitals() -> List[HospitalNode]:
    """
    Load HospitalNode list from the mock data file.

    Later this can be replaced with DB-backed queries and additional
    enrichment (e.g. joining with forecast signals).
    """
    if not _HOSPITALS_FILE.is_file():
        raise RuntimeError("Hospitals data file not found")

    raw = _HOSPITALS_FILE.read_text(encoding="utf-8")
    data = json.loads(raw)
    if not isinstance(data, list):
        raise RuntimeError("Hospitals data must be a list")

    return [HospitalNode.model_validate(item) for item in data]
