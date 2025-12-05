import type { AgentResult } from "../types";

export function ResultGrid({ results }: { results: AgentResult }) {
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
