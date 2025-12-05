import type { AgentResult } from "../types";
import { ResultGrid } from "./ResultGrid";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

export function ResultsPanel({
  results,
  isGraph,
}: {
  results: AgentResult;
  isGraph: boolean;
}) {
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center gap-3">
        <Badge className="bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-100">
          Résultats agents
        </Badge>
        <span className="text-sm text-slate-600">
          {isGraph
            ? "Exécution pilotée par graphe (superviseur -> agents)."
            : "Exécution séquentielle simple sur le backend."}
        </span>
      </div>
      <CardContent className="mt-3 overflow-x-auto pb-1">
        <ResultGrid results={results} />
        {!Object.keys(results).length && (
          <p className="text-sm text-slate-600">
            Lancez une analyse pour voir les propositions.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
