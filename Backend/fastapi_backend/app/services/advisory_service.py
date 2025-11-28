from __future__ import annotations

from typing import Optional, Dict, Any

from app.schemas import AdvisoryDraftResponse, AdvisoryGenerateRequest
from app.services.openai_client import OpenAIClient

_openai_client: OpenAIClient = OpenAIClient()


def set_openai_client(client: OpenAIClient) -> None:
    """
    Override the OpenAI client instance (primarily for tests).

    In production you typically rely on the default client configured via env vars.
    """
    global _openai_client
    _openai_client = client


async def generate_draft(request: AdvisoryGenerateRequest) -> AdvisoryDraftResponse:
    """
    Generate an advisory draft from the incoming request.

    - In dry-run or when OPENAI_API_KEY is missing, this will return a deterministic
      mock draft (handled by OpenAIClient).
    - Otherwise, it will call OpenAI's chat/completions API via OpenAIClient.
    """
    context: Optional[Dict[str, Any]] = request.context if hasattr(request, "context") else None
    text = await _openai_client.generate_advisory(request.prompt, context)
    return AdvisoryDraftResponse(draft=text)
