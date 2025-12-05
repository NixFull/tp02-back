from typing import Any, Sequence
from src.core.chain_factory import build_chain

SYSTEM_PROMPT = """
Tu es architecte logiciel pragmatique. Conçois la solution livrable.
- Domaines/bounded contexts, composants, flux de données.
- Interfaces clés (APIs, événements, contrats), choix technos justifiés.
- Non-fonctionnels : scalabilité, observabilité, sécurité, données, ops.
- Séquence d’implémentation alignée sur l’architecture.
Réponds en français, clair et synthétique.
"""

PROMPT_TEMPLATE = {"system": SYSTEM_PROMPT.strip(), "user": "{input}"}


def run_architecture(prompt: str, provider: str, model: str, callbacks: Sequence[Any] | None = None):
    chain = build_chain(SYSTEM_PROMPT, provider, model)
    return chain.invoke({"input": prompt}, config={"callbacks": callbacks} if callbacks else None).content
