export type Mode = "auto" | "planning" | "architecture" | "devops" | "risk";

export type Provider = "openai" | "google" | "anthropic" | "groq" | "mistral" | "ollama";

export type AgentResult = Partial<Record<Exclude<Mode, "auto">, string>>;

export interface OrchestratorRequest {
  prompt: string;
  mode: Mode;
  provider: Provider;
  model: string;
}

export interface OrchestratorResponse {
  mode: Mode;
  result: AgentResult;
}

export interface OllamaModel {
  name: string;
  size?: number;
  digest?: string;
}
