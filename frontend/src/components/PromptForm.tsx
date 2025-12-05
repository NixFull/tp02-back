import type { FormEvent } from "react";
import type { Provider } from "../types";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";
import { Textarea } from "./ui/textarea";

interface PromptFormProps {
  prompt: string;
  mode: string;
  provider: Provider;
  model: string;
  modes: { value: string; label: string }[];
  providers: { value: Provider; label: string }[];
  isGraph: boolean;
  loading: boolean;
  disabled: boolean;
  loadingModels: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onPromptChange: (value: string) => void;
  onModeChange: (value: string) => void;
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
    <Card className="p-5">
      <form
        onSubmit={onSubmit}
        className="grid gap-4 md:grid-cols-2 md:items-start"
      >
        <Label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
          Mode
          <Select
            value={mode}
            onChange={(e) => onModeChange(e.target.value)}
          >
            {modes.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Select>
        </Label>

        <Label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
          Fournisseur
          <Select
            value={provider}
            onChange={(e) => onProviderChange(e.target.value as Provider)}
          >
            {providers.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </Select>
        </Label>

        <Label className="flex flex-col gap-2 text-sm font-semibold text-slate-900">
          Modèle
          <Input
            value={model}
            onChange={(e) => onModelChange(e.target.value)}
            placeholder="Exemple: gpt-4o-mini ou llama3.1:8b"
          />
          {provider === "ollama" && (
            <span className="text-xs font-normal text-slate-600">
              Doit correspondre à un modèle installé sur votre Ollama local.
            </span>
          )}
        </Label>

        <Label className="flex flex-col gap-2 text-sm font-semibold text-slate-900 md:col-span-2">
          Énoncé du projet
          <Textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Décrivez le contexte, les objectifs et les contraintes du projet à analyser"
            className="min-h-[160px]"
          />
        </Label>

        <div className="flex flex-wrap items-center gap-3 md:col-span-2">
          <Button
            type="submit"
            disabled={loading || disabled}
          >
            {loading
              ? "Analyse en cours..."
              : isGraph
              ? "Lancer (graphe)"
              : "Lancer (séquentiel)"}
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={onToggleGraph}
            disabled={loading}
          >
            {isGraph ? "Basculer en séquentiel" : "Basculer en graphe"}
          </Button>
        </div>

        {provider === "ollama" && (
          <div className="flex flex-wrap items-center gap-3 md:col-span-2">
            <Button
              variant="secondary"
              type="button"
              onClick={onLoadOllamaModels}
              disabled={loadingModels}
            >
              {loadingModels
                ? "Chargement modèles..."
                : "Lister modèles Ollama"}
            </Button>
            <span className="text-xs font-normal text-slate-600">
              Cliquez sur un modèle pour lancer un pull.
            </span>
          </div>
        )}
      </form>
    </Card>
  );
}
