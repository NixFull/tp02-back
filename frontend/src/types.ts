export type AgentResult = Record<string, string>;

export interface AgentMeta {
  id: string;
  label: string;
  description: string;
}

export type Provider = "openai" | "google" | "anthropic" | "groq" | "mistral" | "ollama";

export interface OrchestratorRequest {
  prompt: string;
  mode: string;
  provider: Provider;
  model: string;
}

export interface OrchestratorResponse {
  mode: string;
  result: AgentResult;
}

export interface OllamaModel {
  name: string;
  size?: number;
  digest?: string;
}
