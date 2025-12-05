import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  callGraph,
  callOrchestrator,
  fetchOllamaModels,
  pullOllamaModel,
} from "./api";
import { ErrorBanner } from "./components/ErrorBanner";
import { HeroSection } from "./components/HeroSection";
import { OllamaModels } from "./components/OllamaModels";
import { PromptForm } from "./components/PromptForm";
import { ResultsPanel } from "./components/ResultsPanel";
import type { AgentResult, Mode, OllamaModel, Provider } from "./types";

const defaultModels: Record<Provider, string> = {
  openai: "gpt-4o-mini",
  google: "gemini-2.0-flash",
  anthropic: "claude-3-haiku-20240307",
  groq: "llama-3.1-70b-versatile",
  mistral: "mistral-large-latest",
  ollama: "llama3.1:8b",
};

const modeOptions: { value: Mode; label: string }[] = [
  { value: "auto", label: "Auto (tous les agents)" },
  { value: "analyst", label: "Analyste (backlog)" },
  { value: "architecture", label: "Architecte" },
  { value: "dev", label: "Dev (code/API)" },
  { value: "qa", label: "QA (tests)" },
  { value: "devops", label: "DevOps" },
  { value: "pm", label: "PM (dashboard)" },
];

const providerOptions: { value: Provider; label: string }[] = [
  { value: "openai", label: "OpenAI" },
  { value: "google", label: "Google AI Studio" },
  { value: "anthropic", label: "Anthropic" },
  { value: "groq", label: "Groq" },
  { value: "mistral", label: "Mistral" },
  { value: "ollama", label: "Ollama (local)" },
];

export default function App() {
  const [prompt, setPrompt] = useState(
    "Nous voulons une preuve de concept multi-agents pour planifier, architecturer et livrer une application web utilisant des LLMs."
  );
  const [mode, setMode] = useState<Mode>("auto");
  const [provider, setProvider] = useState<Provider>("openai");
  const [model, setModel] = useState<string>(defaultModels["openai"]);
  const [results, setResults] = useState<AgentResult>({});
  const [isGraph, setIsGraph] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ollamaModels, setOllamaModels] = useState<OllamaModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [pulled, setPulled] = useState<string | null>(null);

  useEffect(() => {
    setModel(defaultModels[provider]);
  }, [provider]);

  const disabled = useMemo(() => !prompt.trim(), [prompt]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (disabled) return;
    setError(null);
    setResults({});
    setLoading(true);
    setPulled(null);

    try {
      const payload = { prompt, mode, provider, model };
      const data = isGraph
        ? await callGraph(payload)
        : await callOrchestrator(payload);
      setResults(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function loadOllamaModels() {
    setLoadingModels(true);
    setError(null);
    try {
      const models = await fetchOllamaModels();
      setOllamaModels(models);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de récupérer les modèles Ollama.";
      setError(message);
    } finally {
      setLoadingModels(false);
    }
  }

  async function onPullModel(name: string) {
    setError(null);
    try {
      await pullOllamaModel(name);
      setPulled(name);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Pull Ollama échoué.";
      setError(message);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
        <HeroSection />

        <PromptForm
          prompt={prompt}
          mode={mode}
          provider={provider}
          model={model}
          modes={modeOptions}
          providers={providerOptions}
          isGraph={isGraph}
          loading={loading}
          disabled={disabled}
          loadingModels={loadingModels}
          onSubmit={onSubmit}
          onPromptChange={setPrompt}
          onModeChange={(value) => setMode(value)}
          onProviderChange={(value) => setProvider(value)}
          onModelChange={setModel}
          onToggleGraph={() => setIsGraph((prev) => !prev)}
          onLoadOllamaModels={loadOllamaModels}
        />

        {error && <ErrorBanner message={error} />}

        {provider === "ollama" && ollamaModels.length > 0 && (
          <OllamaModels
            models={ollamaModels}
            pulled={pulled}
            onPull={onPullModel}
          />
        )}

        <ResultsPanel results={results} isGraph={isGraph} />
      </div>
    </div>
  );
}
