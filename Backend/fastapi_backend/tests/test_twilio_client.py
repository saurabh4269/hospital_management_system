import asyncio

from app.services.twilio_client import TwilioClient, TwilioSendResult


def test_twilio_client_dry_run_queues_without_error() -> None:
    """
    In default configuration (no Twilio env vars set), the client should:
    - Not raise
    - Return status='QUEUED'
    This confirms dry-run behaviour is safe to call from approval flows.
    """

    async def _run() -> TwilioSendResult:
        client = TwilioClient()
        return await client.send_message(to="+910000000000", body="Test message")

    result = asyncio.run(_run())
    assert isinstance(result, TwilioSendResult)
    assert result.status == "QUEUED"
