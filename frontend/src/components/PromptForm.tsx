import type { FormEvent } from "react";
import type { Mode, Provider } from "../types";
import { primaryButton, secondaryButton } from "./buttonStyles";

interface PromptFormProps {
  prompt: string;
  mode: Mode;
  provider: Provider;
  model: string;
  modes: { value: Mode; label: string }[];
  providers: { value: Provider; label: string }[];
  isGraph: boolean;
  loading: boolean;
  disabled: boolean;
  loadingModels: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onPromptChange: (value: string) => void;
  onModeChange: (value: Mode) => void;
  onProviderChange: (value: Provider) => void;
  onModelChange: (value: string) => void;
  onToggleGraph: () => void;
  onLoadOllamaModels: () => void;
}

export function PromptForm({
  prompt,
  mode,
  provider,
  model,
  modes,
  providers,
  isGraph,
  loading,
  disabled,
  loadingModels,
  onSubmit,
  onPromptChange,
  onModeChange,
  onProviderChange,
  onModelChange,
  onToggleGraph,
  onLoadOllamaModels,
}: PromptFormProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-lg backdrop-blur">
      <form
        onSubmit={onSubmit}
        className="grid gap-4 md:grid-cols-2 md:items-start"
      >
        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
          Mode
          <select
            value={mode}
            onChange={(e) => onModeChange(e.target.value as Mode)}
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
            onChange={(e) => onProviderChange(e.target.value as Provider)}
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
            onChange={(e) => onModelChange(e.target.value)}
            placeholder="Exemple: gpt-4o-mini ou llama3.1:8b"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          {provider === "ollama" && (
            <span className="text-xs font-normal text-slate-600">
              Doit correspondre à un modèle installé sur votre Ollama local.
            </span>
          )}
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-900 md:col-span-2">
          Énoncé du projet
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Décrivez le contexte, les objectifs et les contraintes du projet à analyser"
            className="min-h-[160px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
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
            onClick={onToggleGraph}
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
              onClick={onLoadOllamaModels}
              disabled={loadingModels}
            >
              {loadingModels
                ? "Chargement modèles..."
                : "Lister modèles Ollama"}
            </button>
            <span className="text-xs font-normal text-slate-600">
              Cliquez sur un modèle pour lancer un pull.
            </span>
          </div>
        )}
      </form>
    </div>
  );
}
