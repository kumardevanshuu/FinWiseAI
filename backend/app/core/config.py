from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    DATABASE_URL: str
    GROQ_API_KEY: str
    GROQ_MODEL: str = "llama3-70b-8192"

    # Comma-separated list of allowed frontend origins for CORS, e.g.
    # "http://localhost:5173,http://localhost:3000,https://yourapp.com"
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    LLM_MAX_HISTORY_MESSAGES: int = 12
    LLM_SUMMARY_TRIGGER: int = 20
    LLM_SUMMARY_PROMPT: str = (
        "Summarize the conversation into 3-4 concise bullet points focusing on "
        "the user's financial behavior, goals, concerns, and assistant guidance."
    )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
