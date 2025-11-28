from pydantic import BaseModel, Field


class KPIMetrics(BaseModel):
    """
    High-level KPI metrics for the dashboard.
    Values are normalized where appropriate (0–1).
    """

    total_patients: int = Field(ge=0, description="Total patients across monitored hospitals")
    icu_occupancy: float = Field(
        ge=0.0,
        le=1.0,
        description="Fraction of ICU beds occupied across the network (0–1)",
    )
    ward_occupancy: float = Field(
        ge=0.0,
        le=1.0,
        description="Fraction of ward beds occupied across the network (0–1)",
    )
    alert_count: int = Field(
        ge=0,
        description="Number of active alerts (e.g. hospitals in CRITICAL state)",
    )
    surge_confidence: float = Field(
        ge=0.0,
        le=1.0,
        description="Model confidence that a surge is imminent within the forecast horizon (0–1)",
    )
    critical_hospital_count: int = Field(
        ge=0,
        description="Number of hospitals currently in CRITICAL status",
    )
