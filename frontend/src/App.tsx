import { FormEvent, useEffect, useMemo, useState } from "react";
import "./styles.css";
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

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          <div className="navbar-logo">IA</div>
          <div className="navbar-text">
            <span className="navbar-kicker">Multi-agent control center</span>
            <span className="navbar-title">Orchestrateur IA</span>
          </div>
        </div>

        <nav className="navbar-links">
          <a href="#interface">Interface</a>
          <a href="#how-it-works">Guide</a>
          <a href="#models">Modèles</a>
        </nav>

        <div className="navbar-pill">
          <span className="navbar-pill-dot" />
          <span className="navbar-pill-label">Backend en ligne</span>
        </div>
      </div>
    </header>
  );
}

/** Futuristic 3-dots loader */
function LoadingDots({ small = false }: { small?: boolean }) {
  return (
    <div className={small ? "loading-dots loading-dots--small" : "loading-dots"}>
      <span />
      <span />
      <span />
    </div>
  );
}

/** Results grid with emojis + expand/collapse, data rendering unchanged */
function ResultGrid({ results }: { results: AgentResult }) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const entries = Object.entries(results);
  if (!entries.length) return null;

  const stageMeta: Record<string, { label: string; emoji: string }> = {
    planning: { label: "Planification", emoji: "🧭" },
    architecture: { label: "Architecture", emoji: "🏗️" },
    devops: { label: "DevOps", emoji: "⚙️" },
    risk: { label: "Risques", emoji: "⚠️" },
  };

  return (
    <div className={`results ${expandedKey ? "results--has-expanded" : ""}`}>
      {entries.map(([key, value]) => {
        const normalizedKey = key.toLowerCase();
        const stage = stageMeta[normalizedKey];
        const isExpanded = expandedKey === key;

        return (
          <div
            key={key}
            className={
              "result-card result-card--stage" +
              (isExpanded ? " result-card--expanded" : "")
            }
          >
            <div className="result-card-header">
              <div className="result-card-title">
                {stage && (
                  <span className="result-card-emoji">{stage.emoji}</span>
                )}
                <h3>{stage ? stage.label : key}</h3>
              </div>

              <div className="result-card-header-actions">
                {stage && (
                  <span className="result-stage-pill">
                    {stage.emoji} {stage.label}
                  </span>
                )}
                <button
                  type="button"
                  className="result-card-toggle"
                  onClick={() => setExpandedKey(isExpanded ? null : key)}
                  aria-label={isExpanded ? "Réduire" : "Agrandir"}
                >
                  {isExpanded ? "−" : "+"}
                </button>
              </div>
            </div>

            <pre className="result-card-body">{value}</pre>
          </div>
        );
      })}
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
    <div className="page app-shell">
      <Navbar />

      <main className="app-main">
        {/* HERO + GUIDE */}
        <section className="hero panel panel-glass" id="interface">
          <div className="hero-text">
            <h1 className="title">
              Orchestrateur IA pour concevoir et livrer un projet logiciel
            </h1>
            <p className="subtitle">
              Décrivez votre objectif, et laissez des agents spécialisés
              (planification, architecture, DevOps, risques) construire une
              stratégie cohérente. Exécution séquentielle ou via graphe
              LangGraph.
            </p>

            <div className="hero-chips">
              <span className="chip chip--primary">Multi-agents</span>
              <span className="chip chip--secondary">LLM orchestration</span>
              <span className="chip chip--outline">Graph / séquentiel</span>
            </div>
          </div>

          <div className="hero-side panel-inner" id="how-it-works">
            <p className="section-title">Mode d&apos;emploi</p>
            <ul className="hero-steps">
              <li>1. Choisissez le fournisseur LLM et le modèle.</li>
              <li>2. Sélectionnez le mode (un agent ou tous).</li>
              <li>3. Lancez l&apos;analyse et explorez les résultats.</li>
              <li>4. Avec Ollama, listez et mettez à jour vos modèles locaux.</li>
            </ul>
          </div>
        </section>

        {/* CONTROL PANEL */}
        <section className="panel panel-glass panel-controls">
          <form onSubmit={onSubmit} className="control-grid">
            <label className="field">
              <span className="field-label">Énoncé du projet</span>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Décrivez le contexte, les objectifs et les contraintes du projet à analyser"
              />
            </label>

            <div className="control-row">
              <label className="field">
                <span className="field-label">Mode</span>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as Mode)}
                >
                  {modes.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span className="field-label">Fournisseur</span>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as Provider)}
                >
                  {providers.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="field">
              <span className="field-label">Modèle</span>
              <input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Exemple: gpt-4o-mini ou llama3.1:8b"
              />
              {provider === "ollama" && (
                <span className="inline-note">
                  Doit correspondre à un modèle installé sur votre Ollama local.
                </span>
              )}
            </label>

            <div className="actions actions--primary">
              <button
                className="primary"
                type="submit"
                disabled={loading || disabled}
              >
                {loading ? (
                  <LoadingDots small />
                ) : isGraph ? (
                  "Lancer (graphe)"
                ) : (
                  "Lancer (séquentiel)"
                )}
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
              <div className="actions actions--secondary">
                <button
                  className="secondary"
                  type="button"
                  onClick={loadOllamaModels}
                  disabled={loadingModels}
                >
                  {loadingModels
                    ? "Chargement modèles..."
                    : "Lister modèles Ollama"}
                </button>
                {ollamaModels.length > 0 && (
                  <span className="inline-note">
                    Cliquez sur un modèle pour lancer un pull.
                  </span>
                )}
              </div>
            )}
          </form>
        </section>

        {/* ERRORS */}
        {error && (
          <section className="panel panel-glass panel-error">
            <p className="error">{error}</p>
          </section>
        )}

        {/* OLLAMA MODELS */}
        {provider === "ollama" && ollamaModels.length > 0 && (
          <section className="panel panel-glass" id="models">
            <p className="section-title">Modèles Ollama disponibles</p>
            <div className="results results--models">
              {ollamaModels.map((m) => (
                <div key={m.name} className="result-card result-card--model">
                  <h3>{m.name}</h3>
                  <p className="status">
                    Taille:{" "}
                    {m.size
                      ? `${Math.round(m.size / 1_000_000_000)} GB`
                      : "?"}{" "}
                    · Digest: {m.digest ? m.digest.slice(0, 12) : "n/a"}
                  </p>
                  <div className="actions">
                    <button
                      className="secondary"
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
              <p className="status">
                Pull lancé pour {pulled}. Suivez les logs Ollama pour la
                progression.
              </p>
            )}
          </section>
        )}

        {/* RESULTS */}
        <section className="panel panel-glass">
          <div className="actions actions--header">
            <span className="pill">Résultats agents</span>
            <span className="inline-note">
              {isGraph
                ? "Exécution pilotée par graphe (superviseur → agents)."
                : "Exécution séquentielle simple sur le backend."}
            </span>
          </div>

          {loading && (
            <div className="loading-wrapper">
              <LoadingDots />
            </div>
          )}

          {!loading && <ResultGrid results={results} />}

          {!Object.keys(results).length && !loading && (
            <p className="status">
              Lancez une analyse pour voir les propositions.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
