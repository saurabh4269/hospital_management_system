from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class AdvisoryGenerateRequest(BaseModel):
    """
    Request payload for generating an advisory draft.
    """

    prompt: str = Field(
        description="Natural language description of the situation (scenario prompt)",
        min_length=1,
    )
    context: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Optional structured context (e.g. KPIs, hospital summaries) to condition the draft",
    )


class AdvisoryDraftResponse(BaseModel):
    """
    Response payload containing a generated advisory draft.
    """

    draft: str = Field(
        description="Generated advisory text (may be mock or from OpenAI)",
        min_length=1,
    )
