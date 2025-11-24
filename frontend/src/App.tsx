import { FormEvent, useEffect, useMemo, useState } from "react";
import "./styles.css";
import { callGraph, callOrchestrator, fetchOllamaModels, pullOllamaModel } from "./api";
import type { AgentResult, Mode, OllamaModel, Provider } from "./types";

const defaultModels: Record<Provider, string> = {
  openai: "gpt-4o-mini",
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
  { value: "anthropic", label: "Anthropic" },
  { value: "groq", label: "Groq" },
  { value: "mistral", label: "Mistral" },
  { value: "ollama", label: "Ollama (local)" },
];

function ResultGrid({ results }: { results: AgentResult }) {
  const entries = Object.entries(results);
  if (!entries.length) return null;

  return (
    <div className="results">
      {entries.map(([key, value]) => (
        <div key={key} className="result-card">
          <h3>{key}</h3>
          <pre>{value}</pre>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [prompt, setPrompt] = useState(
    "Nous voulons une preuve de concept multi-agents pour planifier, architecturer et livrer une application web utilisant des LLMs.",
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
      const data = isGraph ? await callGraph(payload) : await callOrchestrator(payload);
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
      const message = err instanceof Error ? err.message : "Impossible de récupérer les modèles Ollama.";
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
      const message = err instanceof Error ? err.message : "Pull Ollama échoué.";
      setError(message);
    }
  }

  return (
    <div className="page">
      <div className="hero">
        <div>
          <span className="badge">MGL7360 · PoC multi-agents</span>
          <h1 className="title">Orchestrateur IA pour concevoir et livrer un projet logiciel</h1>
          <p className="subtitle">
            Entrez un objectif et laissez des agents spécialisés (planification, architecture, DevOps, risques)
            produire un plan cohérent. L&apos;exécution peut être séquentielle ou orchestrée via un graphe LangGraph.
          </p>
        </div>
        <div className="panel">
          <p className="section-title">Mode d&apos;emploi</p>
          <p className="inline-note">
            1. Choisissez le fournisseur LLM et le modèle disponible. 2. Sélectionnez le mode (un agent ou tous).
            3. Lancez l&apos;analyse. Avec Ollama, récupérez la liste des modèles puis tirez-en un si besoin.
          </p>
        </div>
      </div>

      <div className="panel">
        <form onSubmit={onSubmit}>
          <label>
            Énoncé du projet
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Décrivez le contexte, les objectifs et les contraintes du projet à analyser"
            />
          </label>

          <label>
            Mode
            <select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
              {modes.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Fournisseur
            <select value={provider} onChange={(e) => setProvider(e.target.value as Provider)}>
              {providers.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Modèle
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Exemple: gpt-4o-mini ou llama3.1:8b"
            />
            {provider === "ollama" && (
              <span className="inline-note">Doit correspondre à un modèle installé sur votre Ollama local.</span>
            )}
          </label>

          <div className="actions">
            <button className="primary" type="submit" disabled={loading || disabled}>
              {loading ? "Analyse en cours..." : isGraph ? "Lancer (graphe)" : "Lancer (séquentiel)"}
            </button>
            <button
              className="secondary"
              type="button"
              onClick={() => setIsGraph((prev) => !prev)}
              disabled={loading}
            >
              {isGraph ? "Basculer en séquentiel" : "Basculer en graphe"}
            </button>
          </div>

          {provider === "ollama" && (
            <div className="actions">
              <button className="secondary" type="button" onClick={loadOllamaModels} disabled={loadingModels}>
                {loadingModels ? "Chargement modèles..." : "Lister modèles Ollama"}
              </button>
              {ollamaModels.length > 0 && (
                <span className="inline-note">Cliquez sur un modèle pour lancer un pull.</span>
              )}
            </div>
          )}
        </form>
      </div>

      {error && <div className="error">{error}</div>}

      {provider === "ollama" && ollamaModels.length > 0 && (
        <div className="panel">
          <p className="section-title">Modèles Ollama disponibles</p>
          <div className="results">
            {ollamaModels.map((m) => (
              <div key={m.name} className="result-card">
                <h3>{m.name}</h3>
                <p className="status">
                  Taille: {m.size ? `${Math.round(m.size / 1_000_000_000)} GB` : "?"} · Digest:{" "}
                  {m.digest ? m.digest.slice(0, 12) : "n/a"}
                </p>
                <div className="actions">
                  <button className="secondary" type="button" onClick={() => onPullModel(m.name)}>
                    Pull/MAJ ce modèle
                  </button>
                </div>
              </div>
            ))}
          </div>
          {pulled && <p className="status">Pull lancé pour {pulled}. Suivez les logs Ollama pour la progression.</p>}
        </div>
      )}

      <div className="panel">
        <div className="actions">
          <span className="pill">Résultats agents</span>
          <span className="inline-note">
            {isGraph
              ? "Exécution pilotée par graphe (superviseur -> agents)."
              : "Exécution séquentielle simple sur le backend."}
          </span>
        </div>
        <ResultGrid results={results} />
        {!Object.keys(results).length && <p className="status">Lancez une analyse pour voir les propositions.</p>}
      </div>
    </div>
  );
}
