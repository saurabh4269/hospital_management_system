from typing import List

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.schemas import (
    ActionItem,
    AdvisoryDraftResponse,
    KPIMetrics,
    HospitalNode,
)

client = TestClient(app)


def test_get_kpi_metrics_endpoint() -> None:
    resp = client.get("/api/dashboard/kpi")
    assert resp.status_code == 200
    data = KPIMetrics.model_validate(resp.json())
    assert data.total_patients >= 0
    assert 0.0 <= data.icu_occupancy <= 1.0
    assert 0.0 <= data.surge_confidence <= 1.0


def test_list_hospitals_endpoint() -> None:
    resp = client.get("/api/hospitals")
    assert resp.status_code == 200
    json_data = resp.json()
    hospitals: List[HospitalNode] = [
        HospitalNode.model_validate(item) for item in json_data
    ]
    assert len(hospitals) >= 1
    # At least one hospital in CRITICAL state to match our mock data
    assert any(h.status == "CRITICAL" for h in hospitals)


def test_list_pending_actions_endpoint() -> None:
    resp = client.get("/api/actions/pending")
    assert resp.status_code == 200
    json_data = resp.json()
    actions: List[ActionItem] = [ActionItem.model_validate(item) for item in json_data]
    assert len(actions) >= 1
    assert all(a.status == "PENDING" for a in actions)


def test_approve_action_endpoint_updates_status_and_message() -> None:
    # First, get pending actions to know a valid id
    pending_resp = client.get("/api/actions/pending")
    pending_resp.raise_for_status()
    pending = pending_resp.json()
    assert pending, "Expected at least one pending action"
    action_id = pending[0]["id"]

    override_text = "Final approved message from test."
    resp = client.post(
        f"/api/actions/{action_id}/approve",
        json={"message_override": override_text},
    )
    assert resp.status_code == 200
    updated = ActionItem.model_validate(resp.json())
    assert updated.status == "APPROVED"
    assert updated.message_final == override_text

    # After approval, it should no longer appear in /pending
    pending_after = client.get("/api/actions/pending").json()
    assert all(item["id"] != action_id for item in pending_after)


def test_reject_action_endpoint_updates_status() -> None:
    # Pick another pending action (after previous approval).
    # If there are none left (e.g. after other tests mutated the store), skip.
    pending_resp = client.get("/api/actions/pending")
    pending_resp.raise_for_status()
    pending = pending_resp.json()
    if not pending:
        pytest.skip("No pending actions available for rejection test")
    action_id = pending[0]["id"]

    resp = client.post(f"/api/actions/{action_id}/reject", json={"reason": "Test reject"})
    assert resp.status_code == 200
    updated = ActionItem.model_validate(resp.json())
    assert updated.status == "REJECTED"

    # After rejection, it should no longer appear in /pending
    pending_after = client.get("/api/actions/pending").json()
    assert all(item["id"] != action_id for item in pending_after)


def test_actions_approve_unknown_id_returns_404() -> None:
    resp = client.post("/api/actions/does-not-exist/approve", json={"message_override": "x"})
    assert resp.status_code == 404


def test_generate_advisory_endpoint() -> None:
    prompt = "Festival surge expected in Ward X this weekend."
    resp = client.post("/api/advisory/generate", json={"prompt": prompt})
    assert resp.status_code == 200
    data = AdvisoryDraftResponse.model_validate(resp.json())
    assert data.draft.startswith("[MOCK DRAFT]")
    assert "Festival surge expected" in data.draft
