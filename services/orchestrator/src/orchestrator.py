import time
from src.agents.analyst_agent import PROMPT_TEMPLATE as ANALYST_TEMPLATE, run_analyst
from src.agents.architecture_agent import PROMPT_TEMPLATE as ARCH_TEMPLATE, run_architecture
from src.agents.dev_agent import PROMPT_TEMPLATE as DEV_TEMPLATE, run_dev
from src.agents.qa_agent import PROMPT_TEMPLATE as QA_TEMPLATE, run_qa
from src.agents.devops_agent import PROMPT_TEMPLATE as DEVOPS_TEMPLATE, run_devops
from src.agents.pm_agent import PROMPT_TEMPLATE as PM_TEMPLATE, run_pm
from src.core.mlflow_logger import get_langchain_callbacks, log_callback_artifacts, log_run

AGENTS = {
    "analyst": run_analyst,
    "architecture": run_architecture,
    "dev": run_dev,
    "qa": run_qa,
    "devops": run_devops,
    "pm": run_pm,
}

AGENT_PROMPT_TEMPLATES = {
    "analyst": ANALYST_TEMPLATE,
    "architecture": ARCH_TEMPLATE,
    "dev": DEV_TEMPLATE,
    "qa": QA_TEMPLATE,
    "devops": DEVOPS_TEMPLATE,
    "pm": PM_TEMPLATE,
}


def orchestrate(mode: str, prompt: str, provider: str, model: str):
    """Run one or all agents depending on the requested mode."""
    selected = mode.lower() if mode else "auto"
    results = {}
    start = time.time()
    agent_runs = []
    callbacks = get_langchain_callbacks(run_name=f"seq-{selected}-{provider}-{model}")

    try:
        if selected == "auto" or selected not in AGENTS:
            for name, func in AGENTS.items():
                a_start = time.time()
                try:
                    if callbacks:
                        res = func(prompt, provider, model, callbacks=callbacks)
                        log_callback_artifacts(callbacks[0], prompt, res, name, AGENT_PROMPT_TEMPLATES.get(name))
                    else:
                        res = func(prompt, provider, model)
                    results[name] = res
                    agent_runs.append(
                        {
                            "name": name,
                            "result": res,
                            "duration_s": time.time() - a_start,
                            "prompt_template": AGENT_PROMPT_TEMPLATES.get(name),
                        }
                    )
                except Exception as e:
                    agent_runs.append(
                        {
                            "name": name,
                            "error": str(e),
                            "duration_s": time.time() - a_start,
                            "prompt_template": AGENT_PROMPT_TEMPLATES.get(name),
                        }
                    )
                    raise
            log_run(
                selected,
                prompt,
                provider,
                model,
                results,
                duration_s=time.time() - start,
                agent_runs=agent_runs,
                prompt_templates=AGENT_PROMPT_TEMPLATES,
            )
            return results

        a_start = time.time()
        agent_fn = AGENTS[selected]
        if callbacks:
            results[selected] = agent_fn(prompt, provider, model, callbacks=callbacks)
            log_callback_artifacts(
                callbacks[0], prompt, results[selected], selected, AGENT_PROMPT_TEMPLATES.get(selected)
            )
        else:
            results[selected] = agent_fn(prompt, provider, model)
        agent_runs.append(
            {
                "name": selected,
                "result": results[selected],
                "duration_s": time.time() - a_start,
                "prompt_template": AGENT_PROMPT_TEMPLATES.get(selected),
            }
        )
        log_run(
            selected,
            prompt,
            provider,
            model,
            results,
            duration_s=time.time() - start,
            agent_runs=agent_runs,
            prompt_templates={selected: AGENT_PROMPT_TEMPLATES.get(selected)},
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
            prompt_templates=AGENT_PROMPT_TEMPLATES,
        )
        raise
