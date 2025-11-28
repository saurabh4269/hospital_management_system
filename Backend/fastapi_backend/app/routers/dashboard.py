from fastapi import APIRouter, HTTPException

from app.schemas import KPIMetrics
from app.services import kpi_service

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/kpi", response_model=KPIMetrics)
def get_kpi_metrics() -> KPIMetrics:
    try:
        return kpi_service.get_kpi()
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
