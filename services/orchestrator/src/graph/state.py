from typing import Optional, TypedDict


class GraphState(TypedDict, total=False):
    prompt: str
    mode: str
    provider: str
    model: str
    executed: list[str]
    planning: Optional[str]
    architecture: Optional[str]
    devops: Optional[str]
    risk: Optional[str]
    next_agent: Optional[str]
