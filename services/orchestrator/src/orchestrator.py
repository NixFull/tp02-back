
from src.agents.planning_agent import run_planning
from src.agents.architecture_agent import run_architecture
from src.agents.devops_agent import run_devops
from src.agents.risk_agent import run_risk

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

    if selected == "auto" or selected not in AGENTS:
        for name, func in AGENTS.items():
            results[name] = func(prompt, provider, model)
        return results

    results[selected] = AGENTS[selected](prompt, provider, model)
    return results
