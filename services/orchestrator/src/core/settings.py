from functools import lru_cache
from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # LLM providers
    openai_api_key: str | None = Field(default=None, env="OPENAI_API_KEY")
    google_api_key: str | None = Field(default=None, env="GOOGLE_API_KEY")
    anthropic_api_key: str | None = Field(default=None, env="ANTHROPIC_API_KEY")
    groq_api_key: str | None = Field(default=None, env="GROQ_API_KEY")
    mistral_api_key: str | None = Field(default=None, env="MISTRAL_API_KEY")

    # Ollama
    ollama_url: str = Field(default="http://ollama:11434", env="OLLAMA_URL")

    # MLflow
    mlflow_tracking_uri: str | None = Field(default=None, env="MLFLOW_TRACKING_URI")
    mlflow_experiment_name: str = Field(default="orchestrator", env="MLFLOW_EXPERIMENT_NAME")
    mlflow_enabled: bool = Field(default=True, env="MLFLOW_ENABLED")
    mlflow_langchain_autolog: bool = Field(default=True, env="MLFLOW_LANGCHAIN_AUTOLOG")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
