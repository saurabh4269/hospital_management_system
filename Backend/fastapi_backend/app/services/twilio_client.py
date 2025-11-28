from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

import httpx

from app.config import get_settings


@dataclass
class TwilioSendResult:
    sid: Optional[str]
    status: str  # e.g. "QUEUED", "SENT", "FAILED"


class TwilioClient:
    """
    Thin Twilio wrapper.

    Phase 4 behaviour:
    - If TWILIO_DRY_RUN is true or credentials are missing:
      * Log/introspect payload, do not hit the network, return status="QUEUED".
    - Otherwise:
      * Call Twilio's Messages API using the same semantics as twilio_thing.md.
    """

    def __init__(self) -> None:
        self.settings = get_settings()

    async def send_message(self, to: str, body: str) -> TwilioSendResult:
        # Dry-run or missing configuration: no-op but report queued
        if (
            self.settings.twilio_dry_run
            or not self.settings.twilio_account_sid
            or not self.settings.twilio_auth_token
            or not self.settings.twilio_from_number
        ):
            # In real app you'd use structured logging; for now this is silent
            return TwilioSendResult(sid=None, status="QUEUED")

        account_sid = self.settings.twilio_account_sid
        auth_token = self.settings.twilio_auth_token
        from_number = self.settings.twilio_from_number

        url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"

        auth = (account_sid, auth_token)
        data = {
            "From": from_number,
            "To": to,
            "Body": body,
        }

        async with httpx.AsyncClient() as client:
            try:
                resp = await client.post(url, data=data, auth=auth, timeout=10.0)
                resp.raise_for_status()
                payload = resp.json()
                return TwilioSendResult(
                    sid=payload.get("sid"), status=payload.get("status", "SENT")
                )
            except Exception:
                # For now, swallow details and signal failure
                return TwilioSendResult(sid=None, status="FAILED")
