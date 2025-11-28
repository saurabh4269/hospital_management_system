from __future__ import annotations

from typing import List

from fastapi import APIRouter, HTTPException

from app.schemas import (
    ActionApproveRequest,
    ActionItem,
    ActionRejectRequest,
)
from app.services import actions_service

router = APIRouter(prefix="/api/actions", tags=["actions"])


@router.get("/pending", response_model=List[ActionItem])
def list_pending_actions() -> List[ActionItem]:
    """
    Return all actions currently in PENDING status.
    """
    return actions_service.list_pending()


@router.post("/{action_id}/approve", response_model=ActionItem)
async def approve_action(action_id: str, req: ActionApproveRequest) -> ActionItem:
    """
    Approve an action, optionally overriding the final message text, and attempt
    to notify recipients via Twilio through the service layer.
    """
    try:
        return await actions_service.approve_and_notify(action_id, req.message_override)
    except KeyError:
        raise HTTPException(status_code=404, detail="Action not found")


@router.post("/{action_id}/reject", response_model=ActionItem)
def reject_action(action_id: str, _: ActionRejectRequest) -> ActionItem:
    """
    Reject an action. Reason is accepted but currently only used for logging/audit (not stored).
    """
    try:
        return actions_service.reject(action_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Action not found")
