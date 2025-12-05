export function HeroSection() {
  return (
    <div className="grid items-start gap-4 md:grid-cols-2">
      <div className="space-y-3">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-50 shadow-sm">
          MGL7360 · PoC multi-agents
        </span>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-950 md:text-4xl">
          Orchestrateur IA pour concevoir et livrer un projet logiciel
        </h1>
        <p className="text-base text-slate-600">
          Entrez un objectif et laissez des agents spécialisés (planification,
          architecture, DevOps, risques) produire un plan cohérent. L&apos;exécution
          peut être séquentielle ou orchestrée via un graphe LangGraph.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-lg backdrop-blur">
        <p className="text-lg font-semibold text-slate-900">Mode d&apos;emploi</p>
        <p className="mt-2 text-sm text-slate-600">
          1) Choisissez le fournisseur et le modèle LLM. 2) Sélectionnez le mode
          (un agent ou tous). 3) Lancez l&apos;analyse. Avec Ollama, listez les modèles
          avant de lancer un pull si besoin.
        </p>
      </div>
    </div>
  );
}
