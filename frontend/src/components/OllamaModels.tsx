import type { OllamaModel } from "../types";
import { secondaryButton } from "./buttonStyles";

interface OllamaModelsProps {
  models: OllamaModel[];
  pulled: string | null;
  onPull: (name: string) => void;
}

export function OllamaModels({ models, pulled, onPull }: OllamaModelsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-lg backdrop-blur">
      <p className="text-lg font-semibold text-slate-900">Modèles Ollama disponibles</p>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {models.map((m) => (
          <div
            key={m.name}
            className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
          >
            <h3 className="text-base font-semibold text-slate-900">{m.name}</h3>
            <p className="text-sm text-slate-600">
              Taille: {m.size ? `${Math.round(m.size / 1_000_000_000)} GB` : "?"} ·
              Digest: {m.digest ? m.digest.slice(0, 12) : "n/a"}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                className={secondaryButton}
                type="button"
                onClick={() => onPull(m.name)}
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
  );
}
