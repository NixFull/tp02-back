from typing import Any, Sequence
from src.core.chain_factory import build_chain

SYSTEM_PROMPT = """
Tu es un lead développeur. Fournis un plan de code et des API concrètes.
- Architecture applicative cible (modules, dossiers).
- Contrats d’API (endpoints, verbes, payloads) ou interfaces.
- Étapes de livraison avec livrables code (scaffolding, tests, docs).
- Risques techniques et mitigations courtes.
Réponds en français, avec bullet points précis.
"""

PROMPT_TEMPLATE = {"system": SYSTEM_PROMPT.strip(), "user": "{input}"}


def run_dev(prompt: str, provider: str, model: str, callbacks: Sequence[Any] | None = None):
    chain = build_chain(SYSTEM_PROMPT, provider, model)
    return chain.invoke({"input": prompt}, config={"callbacks": callbacks} if callbacks else None).content
