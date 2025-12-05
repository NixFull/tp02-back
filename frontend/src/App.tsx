import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  callGraph,
  callOrchestrator,
  fetchOllamaModels,
  pullOllamaModel,
} from "./api";
import type { AgentResult, Mode, OllamaModel, Provider } from "./types";

const defaultModels: Record<Provider, string> = {
  openai: "gpt-4o-mini",
  google: "gemini-2.0-flash",
  anthropic: "claude-3-haiku-20240307",
  groq: "llama-3.1-70b-versatile",
  mistral: "mistral-large-latest",
  ollama: "llama3.1:8b",
};

const modes: { value: Mode; label: string }[] = [
  { value: "auto", label: "Auto (tous les agents)" },
  { value: "planning", label: "Planification" },
  { value: "architecture", label: "Architecture" },
  { value: "devops", label: "DevOps" },
  { value: "risk", label: "Risques" },
];

const providers: { value: Provider; label: string }[] = [
  { value: "openai", label: "OpenAI" },
  { value: "google", label: "Google AI Studio" },
  { value: "anthropic", label: "Anthropic" },
  { value: "groq", label: "Groq" },
  { value: "mistral", label: "Mistral" },
  { value: "ollama", label: "Ollama (local)" },
];

function ResultGrid({ results }: { results: AgentResult }) {
  const entries = Object.entries(results);
  if (!entries.length) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
        >
          <h3 className="text-base font-semibold text-slate-900">{key}</h3>
          <pre className="whitespace-pre-wrap break-words font-mono text-sm text-slate-900">
            {value}
          </pre>
        </div>
      ))}
    </div>
  );
}

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

  const buttonBase =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:translate-y-0";
  const primaryButton = `${buttonBase} bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0`;
  const secondaryButton = `${buttonBase} bg-slate-900 text-slate-50 shadow-md hover:-translate-y-0.5 active:translate-y-0`;

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
        <div className="grid items-start gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-50 shadow-sm">
              MGL7360 · PoC multi-agents
            </span>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-950 md:text-4xl">
              Orchestrateur IA pour concevoir et livrer un projet logiciel
            </h1>
            <p className="text-base text-slate-600">
              Entrez un objectif et laissez des agents spécialisés (planification,
              architecture, DevOps, risques) produire un plan cohérent.
              L&apos;exécution peut être séquentielle ou orchestrée via un graphe LangGraph.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-lg backdrop-blur">
            <p className="text-lg font-semibold text-slate-900">Mode d&apos;emploi</p>
            <p className="mt-2 text-sm text-slate-600">
              1) Choisissez le fournisseur et le modèle LLM. 2) Sélectionnez le mode
              (un agent ou tous). 3) Lancez l&apos;analyse. Avec Ollama, listez les modèles
              avant de lancer un pull si besoin.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-lg backdrop-blur">
          <form
            onSubmit={onSubmit}
            className="grid gap-4 md:grid-cols-2 md:items-start"
          >
            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900 md:col-span-2">
              Énoncé du projet
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Décrivez le contexte, les objectifs et les contraintes du projet à analyser"
                className="min-h-[160px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
              Mode
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as Mode)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {modes.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
              Fournisseur
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as Provider)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {providers.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
              Modèle
              <input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Exemple: gpt-4o-mini ou llama3.1:8b"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              {provider === "ollama" && (
                <span className="text-xs font-normal text-slate-600">
                  Doit correspondre à un modèle installé sur votre Ollama local.
                </span>
              )}
            </label>

            <div className="flex flex-wrap items-center gap-3 md:col-span-2">
              <button
                className={primaryButton}
                type="submit"
                disabled={loading || disabled}
              >
                {loading
                  ? "Analyse en cours..."
                  : isGraph
                  ? "Lancer (graphe)"
                  : "Lancer (séquentiel)"}
              </button>
              <button
                className={secondaryButton}
                type="button"
                onClick={() => setIsGraph((prev) => !prev)}
                disabled={loading}
              >
                {isGraph ? "Basculer en séquentiel" : "Basculer en graphe"}
              </button>
            </div>

            {provider === "ollama" && (
              <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                <button
                  className={secondaryButton}
                  type="button"
                  onClick={loadOllamaModels}
                  disabled={loadingModels}
                >
                  {loadingModels
                    ? "Chargement modèles..."
                    : "Lister modèles Ollama"}
                </button>
                {ollamaModels.length > 0 && (
                  <span className="text-xs font-normal text-slate-600">
                    Cliquez sur un modèle pour lancer un pull.
                  </span>
                )}
              </div>
            )}
          </form>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
            {error}
          </div>
        )}

        {provider === "ollama" && ollamaModels.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-lg backdrop-blur">
            <p className="text-lg font-semibold text-slate-900">
              Modèles Ollama disponibles
            </p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {ollamaModels.map((m) => (
                <div
                  key={m.name}
                  className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
                >
                  <h3 className="text-base font-semibold text-slate-900">
                    {m.name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    Taille:{" "}
                    {m.size ? `${Math.round(m.size / 1_000_000_000)} GB` : "?"} ·
                    Digest: {m.digest ? m.digest.slice(0, 12) : "n/a"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={secondaryButton}
                      type="button"
                      onClick={() => onPullModel(m.name)}
                    >
                      Pull/MAJ ce modèle
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {pulled && (
              <p className="mt-2 text-sm text-slate-600">
                Pull lancé pour {pulled}. Suivez les logs Ollama pour la progression.
              </p>
            )}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-lg backdrop-blur">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-900">
              Résultats agents
            </span>
            <span className="text-sm text-slate-600">
              {isGraph
                ? "Exécution pilotée par graphe (superviseur -> agents)."
                : "Exécution séquentielle simple sur le backend."}
            </span>
          </div>
          <div className="mt-3">
            <ResultGrid results={results} />
            {!Object.keys(results).length && (
              <p className="text-sm text-slate-600">
                Lancez une analyse pour voir les propositions.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
