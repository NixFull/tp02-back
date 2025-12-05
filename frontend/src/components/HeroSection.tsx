import { Badge } from "./ui/badge";
import { Card, CardDescription, CardTitle } from "./ui/card";

export function HeroSection() {
  return (
    <div className="grid items-start gap-4 md:grid-cols-2">
      <div className="space-y-3">
        <Badge>MGL7360 · PoC multi-agents</Badge>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-950 md:text-4xl">
          Orchestrateur IA pour concevoir et livrer un projet logiciel
        </h1>
        <p className="text-base text-slate-600">
          Entrez un objectif et laissez des agents spécialisés (planification,
          architecture, DevOps, risques) produire un plan cohérent. L&apos;exécution
          peut être séquentielle ou orchestrée via un graphe LangGraph.
        </p>
      </div>
      <Card className="p-5">
        <CardTitle>Mode d&apos;emploi</CardTitle>
        <CardDescription className="mt-2">
          1) Choisissez le fournisseur et le modèle LLM. 2) Sélectionnez le mode
          (un agent ou tous). 3) Lancez l&apos;analyse. Avec Ollama, listez les modèles
          avant de lancer un pull si besoin.
        </CardDescription>
      </Card>
    </div>
  );
}
