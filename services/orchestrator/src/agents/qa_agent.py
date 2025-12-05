from typing import Any, Sequence
from src.core.chain_factory import build_chain

SYSTEM_PROMPT = """
Tu es QA lead. Conçois la stratégie de tests et le feedback attendu.
- Stratégie de tests (unitaires, intégration, e2e, perf, sécurité).
- Cas de test critiques avec entrées/sorties attendues.
- Automatisation (outils, pipelines) et environnement de tests.
- Critères de non-régression et suivi des défauts.
Réponds en français, synthétique.
"""

PROMPT_TEMPLATE = {"system": SYSTEM_PROMPT.strip(), "user": "{input}"}


def run_qa(prompt: str, provider: str, model: str, callbacks: Sequence[Any] | None = None):
    chain = build_chain(SYSTEM_PROMPT, provider, model)
    return chain.invoke({"input": prompt}, config={"callbacks": callbacks} if callbacks else None).content
