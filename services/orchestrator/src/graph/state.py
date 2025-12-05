from typing import Optional, TypedDict


class GraphState(TypedDict, total=False):
    prompt: str
    mode: str
    provider: str
    model: str
    executed: list[str]
    results: dict[str, str]
    next_agent: Optional[str]
