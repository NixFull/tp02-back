import type { AgentResult } from "../types";
import { Card, CardContent, CardTitle } from "./ui/card";

export function ResultGrid({ results }: { results: AgentResult }) {
  const entries = Object.entries(results);
  if (!entries.length) return null;

  return (
    <div className="flex w-full gap-4">
      {entries.map(([key, value]) => (
        <Card key={key} className="w-full min-w-[280px] max-w-sm shrink-0 p-4">
          <CardTitle className="text-base">{key}</CardTitle>
          <CardContent className="mt-2">
            <pre className="whitespace-pre-wrap break-words font-mono text-sm text-slate-900">
              {value}
            </pre>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
