import type { OllamaModel } from "../types";
import { Button } from "./ui/button";
import { Card, CardDescription, CardTitle } from "./ui/card";

interface OllamaModelsProps {
  models: OllamaModel[];
  pulled: string | null;
  onPull: (name: string) => void;
}

export function OllamaModels({ models, pulled, onPull }: OllamaModelsProps) {
  return (
    <Card className="p-5">
      <CardTitle>Modèles Ollama disponibles</CardTitle>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {models.map((m) => (
          <Card key={m.name} className="p-4">
            <CardTitle className="text-base">{m.name}</CardTitle>
            <CardDescription className="mt-1">
              Taille: {m.size ? `${Math.round(m.size / 1_000_000_000)} GB` : "?"} ·
              Digest: {m.digest ? m.digest.slice(0, 12) : "n/a"}
            </CardDescription>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="secondary" type="button" onClick={() => onPull(m.name)}>
                Pull/MAJ ce modèle
              </Button>
            </div>
          </Card>
        ))}
      </div>
      {pulled && (
        <p className="mt-2 text-sm text-slate-600">
          Pull lancé pour {pulled}. Suivez les logs Ollama pour la progression.
        </p>
      )}
    </Card>
  );
}
