from datetime import datetime
from typing import Literal, List, Optional

from pydantic import BaseModel, Field


ActionChannel = Literal["SMS", "WHATSAPP", "EMAIL"]
ActionStatus = Literal["PENDING", "APPROVED", "REJECTED", "SENT", "FAILED"]
ActionType = Literal["STAFFING", "SUPPLY", "ADVISORY"]
ActionTarget = Literal["STAFF", "VENDOR", "OFFICIAL", "PUBLIC"]


class ActionItem(BaseModel):
    id: str = Field(description="Stable action identifier")
    type: ActionType
    target: ActionTarget
    channel: ActionChannel
    recipients: List[str] = Field(
        min_length=1,
        description="List of recipient identifiers (e.g. phone numbers)",
    )
    message_template: str = Field(
        description="Original recommended message from orchestrator/LLM"
    )
    message_final: Optional[str] = Field(
        default=None,
        description="Final message after human edits/approval",
    )
    status: ActionStatus = Field(
        description="Lifecycle status for this action item"
    )
    created_at: datetime
    updated_at: datetime


class ActionApproveRequest(BaseModel):
    message_override: Optional[str] = Field(
        default=None,
        description="Optional override text for the final message",
    )


class ActionRejectRequest(BaseModel):
    reason: Optional[str] = Field(
        default=None,
        description="Optional reason for rejection (for audit logs)",
    )
