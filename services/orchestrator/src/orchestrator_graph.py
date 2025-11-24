
from src.graph.graph_builder import build_graph

graph = build_graph()


def run_multigraph(prompt: str, mode: str, provider: str, model: str):
    state = graph.invoke(
        {
            "prompt": prompt,
            "mode": mode,
            "provider": provider,
            "model": model,
            "executed": [],
        }
    )
    state.pop("next_agent", None)
    return state
