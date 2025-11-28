from typing import List

from fastapi import APIRouter, HTTPException

from app.schemas import HospitalNode
from app.services import hospital_service

router = APIRouter(prefix="/api", tags=["hospitals"])


@router.get("/hospitals", response_model=List[HospitalNode])
def list_hospitals() -> List[HospitalNode]:
    """
    List hospitals from the backing service (currently mock JSON-backed).

    Later, hospital_service.list_hospitals() can be updated to pull from a
    real database or enriched state without changing this router.
    """
    try:
        return hospital_service.list_hospitals()
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
