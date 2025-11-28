from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional

from app.schemas import ActionItem
from app.services.twilio_client import TwilioClient, TwilioSendResult

_DATA_DIR = Path(__file__).resolve().parents[1] / "data"
_ACTIONS_FILE = _DATA_DIR / "mock_actions.json"


def _load_initial_actions() -> Dict[str, ActionItem]:
    if not _ACTIONS_FILE.is_file():
        raise RuntimeError("Actions data file not found")
    raw = _ACTIONS_FILE.read_text(encoding="utf-8")
    data = json.loads(raw)
    if not isinstance(data, list):
        raise RuntimeError("Actions data must be a list")
    actions = [ActionItem.model_validate(item) for item in data]
    return {a.id: a for a in actions}


# Process-lifetime in-memory store; later can be swapped for DB-backed repo.
_ACTIONS_STORE: Dict[str, ActionItem] = _load_initial_actions()

# Twilio client used for notifications; can be replaced in tests.
_twilio_client: TwilioClient = TwilioClient()


def set_twilio_client(client: TwilioClient) -> None:
    """
    Override the Twilio client instance (primarily for tests).

    In production you typically rely on the default client configured via env vars.
    """
    global _twilio_client
    _twilio_client = client


def list_pending() -> List[ActionItem]:
    return [a for a in _ACTIONS_STORE.values() if a.status == "PENDING"]


def get(action_id: str) -> Optional[ActionItem]:
    return _ACTIONS_STORE.get(action_id)


def approve(action_id: str, message_override: Optional[str]) -> ActionItem:
    existing = _ACTIONS_STORE.get(action_id)
    if existing is None:
        raise KeyError(action_id)

    message_final = message_override or existing.message_template
    now = datetime.now(timezone.utc)
    updated = existing.model_copy(
        update={
            "message_final": message_final,
            "status": "APPROVED",
            "updated_at": now,
        }
    )
    _ACTIONS_STORE[action_id] = updated
    return updated


def reject(action_id: str) -> ActionItem:
    existing = _ACTIONS_STORE.get(action_id)
    if existing is None:
        raise KeyError(action_id)

    now = datetime.now(timezone.utc)
    updated = existing.model_copy(
        update={
            "status": "REJECTED",
            "updated_at": now,
        }
    )
    _ACTIONS_STORE[action_id] = updated
    return updated


async def approve_and_notify(action_id: str, message_override: Optional[str]) -> ActionItem:
    """
    Approve an action and attempt to send notifications via Twilio.

    - First updates the in-memory store via `approve`.
    - Then, for each recipient, calls TwilioClient.send_message in best-effort mode.
    - Does not currently change the ActionItem status based on Twilio result;
      the action remains APPROVED regardless of delivery outcome. This can be
      extended later to track SENT/FAILED states if desired.
    """
    updated = approve(action_id, message_override)

    body = updated.message_final or updated.message_template
    results: List[TwilioSendResult] = []
    for recipient in updated.recipients:
        result = await _twilio_client.send_message(recipient, body)
        results.append(result)
        # In a more advanced version you might aggregate/report these results.

    return updated
