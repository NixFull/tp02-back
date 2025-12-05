from fastapi import APIRouter, BackgroundTasks, HTTPException
import httpx
from langchain_community.llms.ollama import OllamaEndpointNotFoundError
from src.models import (
    OrchestratorRequest,
    OrchestratorResponse,
    OllamaPullRequest,
    OllamaPullResponse,
    OllamaModelsResponse,
    OllamaModel,
)
from src.core.settings import settings
from src.orchestrator import orchestrate
from src.orchestrator_graph import run_multigraph
from src.core.exceptions import MissingApiKeyError, ModelNotFoundError
from src.agents.registry import AGENT_REGISTRY

router = APIRouter(prefix="/api", tags=["orchestrator"])


@router.post("/orchestrator", response_model=OrchestratorResponse)
def run(req: OrchestratorRequest):
    try:
        out = orchestrate(req.mode, req.prompt, req.provider, req.model)
    except (ValueError, MissingApiKeyError, ModelNotFoundError) as e:
        raise HTTPException(status_code=400, detail=str(e))
    except OllamaEndpointNotFoundError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return OrchestratorResponse(mode=req.mode, result=out)


@router.post("/graph")
def run_graph(req: OrchestratorRequest):
    try:
        return run_multigraph(req.prompt, req.mode, req.provider, req.model)
    except (ValueError, MissingApiKeyError, ModelNotFoundError) as e:
        raise HTTPException(status_code=400, detail=str(e))
    except OllamaEndpointNotFoundError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/ollama/models", response_model=OllamaModelsResponse)
def list_models():
    try:
        r = httpx.get(f"{settings.ollama_url}/api/tags", timeout=10)
        arr = []
        for m in r.json().get("models", []):
            arr.append(OllamaModel(name=m["name"], size=m.get("size"), digest=m.get("digest")))
        return OllamaModelsResponse(models=arr)
    except Exception as e:
        print("Error", e)
        return OllamaModelsResponse(models=[])


@router.post("/ollama/pull", response_model=OllamaPullResponse)
def pull(req: OllamaPullRequest, bg: BackgroundTasks):
    def task():
        try:
            httpx.post(f"{settings.ollama_url}/api/pull", json={"model": req.model}, timeout=None)
        except Exception as e:
            print("Error pull", e)

    bg.add_task(task)
    return OllamaPullResponse(status="started", model=req.model)


@router.get("/agents")
def list_agents():
    """Expose available agents to build the UI dynamically."""
    return [{"id": a["id"], "label": a["label"], "description": a["description"]} for a in AGENT_REGISTRY]
