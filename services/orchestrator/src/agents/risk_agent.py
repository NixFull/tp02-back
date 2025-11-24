from src.core.chain_factory import build_chain

_SYSTEM = """
You are a technology risk manager.
- Identify delivery, technical, operational, and stakeholder risks for the project.
- Estimate likelihood/impact qualitatively and rank the top items.
- Propose crisp mitigations or safeguards for each risk.
- Note open questions or assumptions that must be validated early.
Keep it to concise bullets with clear labels.
"""


def run_risk(prompt: str, provider: str, model: str):
    return build_chain(_SYSTEM, provider, model).invoke({"input": prompt}).content
