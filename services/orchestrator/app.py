
import os, httpx
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from src.models import (
    OrchestratorRequest,
    OrchestratorResponse,
    OllamaPullRequest,
    OllamaPullResponse,
    OllamaModelsResponse,
    OllamaModel
)
from src.orchestrator import orchestrate
from src.orchestrator_graph import run_multigraph

OLLAMA_BASE=os.getenv("OLLAMA_URL","http://ollama:11434")

app=FastAPI(title="MGL7320 Orchestrator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

@app.get("/health")
def health():
    return {"status":"ok"}

@app.post("/api/orchestrator", response_model=OrchestratorResponse)
def run(req:OrchestratorRequest):
    out=orchestrate(req.mode, req.prompt, req.provider, req.model)
    return OrchestratorResponse(mode=req.mode, result=out)

@app.post("/api/graph")
def run_graph(req:OrchestratorRequest):
    return run_multigraph(req.prompt, req.mode, req.provider, req.model)

@app.get("/api/ollama/models", response_model=OllamaModelsResponse)
def list_models():
    try:
        r=httpx.get(f"{OLLAMA_BASE}/api/tags", timeout=10)
        arr=[]
        for m in r.json().get("models",[]):
            arr.append(OllamaModel(name=m["name"], size=m.get("size"), digest=m.get("digest")))
        return OllamaModelsResponse(models=arr)
    except Exception as e:
        print("Error",e)
        return OllamaModelsResponse(models=[])

@app.post("/api/ollama/pull", response_model=OllamaPullResponse)
def pull(req:OllamaPullRequest, bg:BackgroundTasks):
    def task():
        try:
            httpx.post(f"{OLLAMA_BASE}/api/pull", json={"model":req.model}, timeout=None)
        except Exception as e:
            print("Error pull",e)
    bg.add_task(task)
    return OllamaPullResponse(status="started", model=req.model)
