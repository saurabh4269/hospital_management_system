from __future__ import annotations

import json
from pathlib import Path

from app.schemas import KPIMetrics

_DATA_DIR = Path(__file__).resolve().parents[1] / "data"
_KPI_FILE = _DATA_DIR / "mock_kpi.json"


def get_kpi() -> KPIMetrics:
    """
    Load KPIMetrics from the mock data file.

    In a later phase this will be replaced or augmented by logic that
    queries a data store and incorporates forecast signals.
    """
    if not _KPI_FILE.is_file():
        raise RuntimeError("KPI data file not found")

    raw = _KPI_FILE.read_text(encoding="utf-8")
    data = json.loads(raw)
    return KPIMetrics.model_validate(data)
