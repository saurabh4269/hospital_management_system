from __future__ import annotations

from typing import Any, Dict, Optional

import httpx

from app.config import get_settings


class OpenAIClient:
    """
    Minimal OpenAI client wrapper.

    Behaviour:
    - If OPENAI_DRY_RUN is true or OPENAI_API_KEY is missing:
      * Return a deterministic mock draft: "[MOCK DRAFT] {prompt}".
    - Otherwise:
      * Call OpenAI's chat/completions API and return the first choice text.
    """

    def __init__(self) -> None:
        self.settings = get_settings()

    async def generate_advisory(
        self,
        prompt: str,
        context: Optional[Dict[str, Any]] = None,
    ) -> str:
        # Dry-run or missing key: keep behaviour deterministic and offline.
        if self.settings.openai_dry_run or not self.settings.openai_api_key:
            return f"[MOCK DRAFT] {prompt}"

        messages = [
            {
                "role": "system",
                "content": "You are a public health advisory generator. Respond with a clear, concise advisory message.",
            }
        ]

        if context:
            messages.append(
                {
                    "role": "system",
                    "content": f"Context: {context}",
                }
            )

        messages.append(
            {
                "role": "user",
                "content": prompt,
            }
        )

        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.settings.openai_api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.settings.openai_model,
            "messages": messages,
        }

        async with httpx.AsyncClient() as client:
            resp = await client.post(url, json=payload, headers=headers, timeout=20.0)
            resp.raise_for_status()
            data = resp.json()
            try:
                return data["choices"][0]["message"]["content"]
            except Exception:
                # Fallback if response structure is unexpected
                return f"[MOCK DRAFT] {prompt}"
