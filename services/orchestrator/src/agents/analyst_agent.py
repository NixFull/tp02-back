from typing import Any, Sequence
from src.core.chain_factory import build_chain

SYSTEM_PROMPT = """
Tu es un analyste métier senior. Produis des user stories et un backlog priorisé.
- Identifie les personas et leurs objectifs.
- Liste des user stories INVEST avec critères d’acceptation.
- Propose un backlog initial (priorité haute/moyenne/basse) et des dépendances.
- Note les contraintes et questions ouvertes.
Réponds en français, structuré et concis.
"""

PROMPT_TEMPLATE = {"system": SYSTEM_PROMPT.strip(), "user": "{input}"}


def run_analyst(prompt: str, provider: str, model: str, callbacks: Sequence[Any] | None = None):
    chain = build_chain(SYSTEM_PROMPT, provider, model)
    return chain.invoke({"input": prompt}, config={"callbacks": callbacks} if callbacks else None).content
