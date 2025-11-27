
from src.agents.planning_agent import run_planning
from src.agents.architecture_agent import run_architecture
from src.agents.devops_agent import run_devops
from src.agents.risk_agent import run_risk
from src.core.mlflow_logger import log_run
import time

AGENTS = {
    "planning": run_planning,
    "architecture": run_architecture,
    "devops": run_devops,
    "risk": run_risk,
}


def orchestrate(mode: str, prompt: str, provider: str, model: str):
    """Run one or all agents depending on the requested mode."""
    selected = mode.lower() if mode else "auto"
    results = {}
    start = time.time()
    agent_runs = []

    try:
        if selected == "auto" or selected not in AGENTS:
            for name, func in AGENTS.items():
                a_start = time.time()
                try:
                    res = func(prompt, provider, model)
                    results[name] = res
                    agent_runs.append({"name": name, "result": res, "duration_s": time.time() - a_start})
                except Exception as e:
                    agent_runs.append({"name": name, "error": str(e), "duration_s": time.time() - a_start})
                    raise
            log_run(
                selected,
                prompt,
                provider,
                model,
                results,
                duration_s=time.time() - start,
                agent_runs=agent_runs,
            )
            return results

        a_start = time.time()
        results[selected] = AGENTS[selected](prompt, provider, model)
        agent_runs.append({"name": selected, "result": results[selected], "duration_s": time.time() - a_start})
        log_run(
            selected,
            prompt,
            provider,
            model,
            results,
            duration_s=time.time() - start,
            agent_runs=agent_runs,
        )
        return results
    except Exception as e:
        log_run(
            selected,
            prompt,
            provider,
            model,
            results,
            duration_s=time.time() - start,
            error=str(e),
            agent_runs=agent_runs,
        )
        raise
