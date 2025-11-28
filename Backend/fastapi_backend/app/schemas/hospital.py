from typing import Literal

from pydantic import BaseModel, Field


HospitalStatus = Literal["NORMAL", "WARNING", "CRITICAL"]
ResourceLevel = Literal["LOW", "MEDIUM", "HIGH"]


class HospitalOccupancy(BaseModel):
    icu_beds_used: int = Field(ge=0)
    icu_beds_total: int = Field(ge=0)
    ward_beds_used: int = Field(ge=0)
    ward_beds_total: int = Field(ge=0)


class HospitalResources(BaseModel):
    oxygen: ResourceLevel
    staff_load: ResourceLevel


class HospitalNode(BaseModel):
    """
    Single hospital node for the diffusion map and dashboards.
    """

    id: str = Field(description="Stable hospital identifier")
    name: str = Field(description="Human-readable hospital name")
    lat: float = Field(ge=-90.0, le=90.0)
    lng: float = Field(ge=-180.0, le=180.0)
    occupancy: HospitalOccupancy
    status: HospitalStatus
    resources: HospitalResources
