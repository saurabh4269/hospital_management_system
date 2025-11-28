from datetime import datetime, timezone

import asyncio

from app.schemas import AdvisoryGenerateRequest
from app.services import actions_service, advisory_service, hospital_service, kpi_service


def test_kpi_service_get_kpi() -> None:
    metrics = kpi_service.get_kpi()
    assert metrics.total_patients >= 0
    assert 0.0 <= metrics.icu_occupancy <= 1.0
    assert 0.0 <= metrics.surge_confidence <= 1.0


def test_hospital_service_list_hospitals() -> None:
    hospitals = hospital_service.list_hospitals()
    assert len(hospitals) >= 1
    # Ensure at least one hospital is critical as per mock data
    assert any(h.status == "CRITICAL" for h in hospitals)


def test_actions_service_lifecycle_approve_and_reject() -> None:
    # Fresh pending list
    pending = actions_service.list_pending()
    assert pending, "Expected at least one pending action"
    first_id = pending[0].id

    # Approve first action
    approved = actions_service.approve(first_id, message_override="Unit test approval")
    assert approved.id == first_id
    assert approved.status == "APPROVED"
    assert approved.message_final == "Unit test approval"
    assert approved.updated_at <= datetime.now(timezone.utc)

    # It should no longer be pending
    pending_after_approve = {a.id for a in actions_service.list_pending()}
    assert first_id not in pending_after_approve

    # Reject another pending action if available
    remaining_pending = actions_service.list_pending()
    if remaining_pending:
        second_id = remaining_pending[0].id
        rejected = actions_service.reject(second_id)
        assert rejected.id == second_id
        assert rejected.status == "REJECTED"
        pending_after_reject = {a.id for a in actions_service.list_pending()}
        assert second_id not in pending_after_reject


def test_advisory_service_generate_draft() -> None:
    req = AdvisoryGenerateRequest(prompt="Heavy pollution expected tomorrow.")

    async def _run() -> str:
        resp = await advisory_service.generate_draft(req)
        return resp.draft

    draft = asyncio.run(_run())
    # In dry-run mode this should be a deterministic mock draft
    assert draft.startswith("[MOCK DRAFT]")
    assert "Heavy pollution expected tomorrow." in draft
