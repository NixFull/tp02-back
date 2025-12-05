from pydantic import BaseModel
from typing import Dict, Any


class OrchestratorRequest(BaseModel):
    prompt: str
    mode: str = "auto"
    provider: str = "openai"
    model: str = "gpt-4o-mini"


class OrchestratorResponse(BaseModel):
    mode: str
    result: Dict[str, Any]


class OllamaPullRequest(BaseModel):
    model: str


class OllamaPullResponse(BaseModel):
    status: str
    model: str


class OllamaModel(BaseModel):
    name: str
    size: int | None = None
    digest: str | None = None


class OllamaModelsResponse(BaseModel):
    models: list[OllamaModel]
