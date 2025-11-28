from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Core
    app_name: str = "SurgeGuard Backend"
    environment: str = Field("development", env="ENVIRONMENT")

    # Twilio
    twilio_account_sid: str | None = Field(default=None, env="TWILIO_ACCOUNT_SID")
    twilio_auth_token: str | None = Field(default=None, env="TWILIO_AUTH_TOKEN")
    twilio_from_number: str | None = Field(default=None, env="TWILIO_FROM_NUMBER")
    twilio_dry_run: bool = Field(default=True, env="TWILIO_DRY_RUN")

    # OpenAI
    openai_api_key: str | None = Field(default=None, env="OPENAI_API_KEY")
    openai_model: str = Field(default="gpt-4o-mini", env="OPENAI_MODEL")
    openai_dry_run: bool = Field(default=True, env="OPENAI_DRY_RUN")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
