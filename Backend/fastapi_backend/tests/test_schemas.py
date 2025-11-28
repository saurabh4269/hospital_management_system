from datetime import datetime, timezone

import pytest
from pydantic import ValidationError

from app.schemas import (
    KPIMetrics,
    HospitalNode,
    ActionItem,
    ActionApproveRequest,
    ActionRejectRequest,
    AdvisoryGenerateRequest,
    AdvisoryDraftResponse,
)
from app.schemas.hospital import HospitalOccupancy, HospitalResources


def test_kpi_metrics_valid() -> None:
    metrics = KPIMetrics(
        total_patients=120,
        icu_occupancy=0.75,
        ward_occupancy=0.6,
        alert_count=3,
        surge_confidence=0.8,
        critical_hospital_count=2,
    )
    assert metrics.total_patients == 120
    assert 0.0 <= metrics.icu_occupancy <= 1.0
    assert 0.0 <= metrics.surge_confidence <= 1.0


def test_kpi_metrics_invalid_range() -> None:
    with pytest.raises(ValidationError):
        KPIMetrics(
            total_patients=10,
            icu_occupancy=1.5,  # invalid (>1)
            ward_occupancy=0.5,
            alert_count=0,
            surge_confidence=0.2,
            critical_hospital_count=0,
        )


def test_hospital_node_valid() -> None:
    node = HospitalNode(
        id="hosp-1",
        name="City Hospital",
        lat=19.07,
        lng=72.88,
        occupancy=HospitalOccupancy(
            icu_beds_used=10,
            icu_beds_total=20,
            ward_beds_used=50,
            ward_beds_total=100,
        ),
        status="WARNING",
        resources=HospitalResources(
            oxygen="MEDIUM",
            staff_load="HIGH",
        ),
    )
    assert node.occupancy.icu_beds_total >= node.occupancy.icu_beds_used
    assert node.status in {"NORMAL", "WARNING", "CRITICAL"}


def test_hospital_node_invalid_latitude() -> None:
    with pytest.raises(ValidationError):
        HospitalNode(
            id="bad-lat",
            name="Bad Lat Hospital",
            lat=200.0,  # invalid
            lng=72.88,
            occupancy=HospitalOccupancy(
                icu_beds_used=1,
                icu_beds_total=5,
                ward_beds_used=10,
                ward_beds_total=20,
            ),
            status="NORMAL",
            resources=HospitalResources(
                oxygen="HIGH",
                staff_load="LOW",
            ),
        )


def test_action_item_valid() -> None:
    now = datetime.now(timezone.utc)
    action = ActionItem(
        id="act-1",
        type="STAFFING",
        target="STAFF",
        channel="SMS",
        recipients=["+911234567890"],
        message_template="Please report early for shift.",
        status="PENDING",
        created_at=now,
        updated_at=now,
    )
    assert action.recipients
    assert action.status == "PENDING"


def test_action_item_requires_recipients() -> None:
    now = datetime.now(timezone.utc)
    with pytest.raises(ValidationError):
        ActionItem(
            id="act-2",
            type="SUPPLY",
            target="VENDOR",
            channel="SMS",
            recipients=[],
            message_template="Send oxygen cylinders.",
            status="PENDING",
            created_at=now,
            updated_at=now,
        )


def test_action_approve_reject_requests() -> None:
    approve = ActionApproveRequest(message_override="Final approved text")
    reject = ActionRejectRequest(reason="Not applicable")
    assert approve.message_override == "Final approved text"
    assert reject.reason == "Not applicable"


def test_advisory_request_and_response() -> None:
    req = AdvisoryGenerateRequest(prompt="Festival surge expected in Ward X")
    assert req.prompt

    resp = AdvisoryDraftResponse(draft="Stay indoors and wear masks.")
    assert "masks" in resp.draft


def test_advisory_request_requires_prompt() -> None:
    with pytest.raises(ValidationError):
        AdvisoryGenerateRequest(prompt="")  # empty prompt not allowed
