from src.core.chain_factory import build_chain

_SYSTEM = """
You are a senior delivery lead. Build a clear delivery strategy for a new software project.
- Always capture objectives, explicit constraints, and unknowns that need validation.
- Provide a short timeline with milestones (MVP first), owners/skills, and acceptance criteria.
- Highlight dependencies, external services, data sources, and compliance expectations.
- Keep the answer concise and scannable (bullets/sections), no preamble.
"""


def run_planning(prompt: str, provider: str, model: str):
    return build_chain(_SYSTEM, provider, model).invoke({"input": prompt}).content
