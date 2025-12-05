import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api import router as orchestrator_router

tags_metadata = [
    {"name": "orchestrator", "description": "APIs orchestrateur et graphe multi-agents."},
    {"name": "health", "description": "Endpoints de santé de l'application."},
]

app = FastAPI(
    title="MGL7320 Orchestrator",
    version="1.0.0",
    description="Orchestrateur multi-agents (Analyste, Architecte, Dev, QA, DevOps, PM).",
    openapi_tags=tags_metadata,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


@app.get("/health", tags=["health"], summary="Healthcheck basique")
def health():
    return {"status": "ok"}


@app.get("/live", tags=["health"], summary="Liveness probe")
def live():
    return {"status": "live"}


@app.get("/ready", tags=["health"], summary="Readiness probe")
def ready():
    return {"status": "ready"}


app.include_router(orchestrator_router)


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=False)
