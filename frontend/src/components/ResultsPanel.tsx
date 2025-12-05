import type { AgentResult } from "../types";
import { ResultGrid } from "./ResultGrid";

export function ResultsPanel({
  results,
  isGraph,
}: {
  results: AgentResult;
  isGraph: boolean;
}) {
  return (
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
  );
}
