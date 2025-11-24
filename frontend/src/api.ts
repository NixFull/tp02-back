import type {
  AgentResult,
  Mode,
  OllamaModel,
  OrchestratorRequest,
  OrchestratorResponse,
} from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed with status ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function callOrchestrator(payload: OrchestratorRequest): Promise<AgentResult> {
  const res = await fetch(`${API_URL}/api/orchestrator`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await handleResponse<OrchestratorResponse>(res);
  return data.result;
}

export async function callGraph(payload: OrchestratorRequest): Promise<AgentResult> {
  const res = await fetch(`${API_URL}/api/graph`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return await handleResponse<AgentResult>(res);
}

export async function fetchOllamaModels(): Promise<OllamaModel[]> {
  const res = await fetch(`${API_URL}/api/ollama/models`, { method: "GET" });
  const data = await handleResponse<{ models: OllamaModel[] }>(res);
  return data.models;
}

export async function pullOllamaModel(name: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/ollama/pull`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: name }),
  });
  await handleResponse(res);
}
