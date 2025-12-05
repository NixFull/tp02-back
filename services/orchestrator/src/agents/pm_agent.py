from typing import Any, Sequence
from src.core.chain_factory import build_chain

SYSTEM_PROMPT = """
Tu es PM. Crée un tableau de bord projet synthétique.
- Objectifs, périmètre, livrables clés.
- Roadmap avec jalons et responsables.
- KPIs de suivi (delivery, qualité, risques) et mécanismes de reporting.
- Dépendances et plan de communication stakeholders.
Réponds en français, format tableau ou bullets courts.
"""

PROMPT_TEMPLATE = {"system": SYSTEM_PROMPT.strip(), "user": "{input}"}


def run_pm(prompt: str, provider: str, model: str, callbacks: Sequence[Any] | None = None):
    chain = build_chain(SYSTEM_PROMPT, provider, model)
    return chain.invoke({"input": prompt}, config={"callbacks": callbacks} if callbacks else None).content
