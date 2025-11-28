from fastapi import APIRouter

from app.schemas import AdvisoryDraftResponse, AdvisoryGenerateRequest
from app.services import advisory_service

router = APIRouter(prefix="/api/advisory", tags=["advisory"])


@router.post("/generate", response_model=AdvisoryDraftResponse)
async def generate_advisory(request: AdvisoryGenerateRequest) -> AdvisoryDraftResponse:
    """
    Generate an advisory draft via the service layer.

    In Phase 5, advisory_service delegates to the OpenAI client, which will either
    return a deterministic mock (dry-run) or call the real OpenAI API.
    """
    return await advisory_service.generate_draft(request)
