from typing import Any, Sequence
from src.core.chain_factory import build_chain

_SYSTEM = """
Tu es DevOps/Platform. Prépare le déploiement opérationnel.
- CI/CD adapté (pipelines, gates, artefacts, envs).
- Topologie runtime (containers, orchestration, réseau, secrets, observabilité).
- Résilience/sécurité : sauvegardes, DR, baselines, contrôles d’accès.
- Outillage simple, coût maîtrisé, risques et mitigations.
Réponds en français, actionnable et concis.
"""

PROMPT_TEMPLATE = {"system": _SYSTEM.strip(), "user": "{input}"}


def run_devops(prompt: str, provider: str, model: str, callbacks: Sequence[Any] | None = None):
    chain = build_chain(_SYSTEM, provider, model)
    return chain.invoke({"input": prompt}, config={"callbacks": callbacks} if callbacks else None).content
