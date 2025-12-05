import time
from src.agents.analyst_agent import PROMPT_TEMPLATE as ANALYST_TEMPLATE
from src.agents.architecture_agent import PROMPT_TEMPLATE as ARCH_TEMPLATE
from src.agents.dev_agent import PROMPT_TEMPLATE as DEV_TEMPLATE
from src.agents.qa_agent import PROMPT_TEMPLATE as QA_TEMPLATE
from src.agents.devops_agent import PROMPT_TEMPLATE as DEVOPS_TEMPLATE
from src.agents.pm_agent import PROMPT_TEMPLATE as PM_TEMPLATE
from src.core.mlflow_logger import get_langchain_callbacks, log_callback_artifacts, log_run
from src.graph.graph_builder import build_graph

graph = build_graph()


def run_multigraph(prompt: str, mode: str, provider: str, model: str):
    start = time.time()
    callbacks = get_langchain_callbacks(run_name=f"graph-{mode}-{provider}-{model}")
    prompt_templates = {
        "analyst": ANALYST_TEMPLATE,
        "architecture": ARCH_TEMPLATE,
        "dev": DEV_TEMPLATE,
        "qa": QA_TEMPLATE,
        "devops": DEVOPS_TEMPLATE,
        "pm": PM_TEMPLATE,
    }
    try:
        state = graph.invoke(
            {
                "prompt": prompt,
                "mode": mode,
                "provider": provider,
                "model": model,
                "executed": [],
            },
            config={"callbacks": callbacks} if callbacks else None,
        )
        state.pop("next_agent", None)
        results = {k: v for k, v in state.items() if k in prompt_templates}
        agent_runs = []
        for name in prompt_templates.keys():
            if name in results:
                agent_runs.append(
                    {"name": name, "result": results[name], "duration_s": None, "prompt_template": prompt_templates.get(name)}
                )
                if callbacks:
                    log_callback_artifacts(callbacks[0], prompt, results[name], name, prompt_templates.get(name))
        log_run(
            mode,
            prompt,
            provider,
            model,
            results,
            duration_s=time.time() - start,
            agent_runs=agent_runs,
            prompt_templates=prompt_templates,
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
            prompt_templates=prompt_templates,
        )
        raise
