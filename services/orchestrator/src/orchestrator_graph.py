
from src.graph.graph_builder import build_graph
from src.core.mlflow_logger import log_run
import time

graph = build_graph()


def run_multigraph(prompt: str, mode: str, provider: str, model: str):
    start = time.time()
    try:
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
        results = {k: v for k, v in state.items() if k in ["planning", "architecture", "devops", "risk"]}
        agent_runs = []
        for name in ["planning", "architecture", "devops", "risk"]:
            if name in results:
                agent_runs.append({"name": name, "result": results[name], "duration_s": None})
        log_run(
            mode,
            prompt,
            provider,
            model,
            results,
            duration_s=time.time() - start,
            agent_runs=agent_runs,
        )
        return state
    except Exception as e:
        log_run(
            mode,
            prompt,
            provider,
            model,
            {},
            duration_s=time.time() - start,
            error=str(e),
            agent_runs=[],
        )
        raise
