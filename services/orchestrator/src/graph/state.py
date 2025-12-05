from typing import Optional, TypedDict


class GraphState(TypedDict, total=False):
    prompt: str
    mode: str
    provider: str
    model: str
    executed: list[str]
    analyst: Optional[str]
    architecture: Optional[str]
    dev: Optional[str]
    qa: Optional[str]
    devops: Optional[str]
    pm: Optional[str]
    next_agent: Optional[str]
