"""Optional MLflow logging helper with nested agent runs.

Logging only runs if MLFLOW_TRACKING_URI is set. Errors are printed to stdout
but do not block the main flow.
"""

import json
import os
from typing import Any, Mapping, Optional, Sequence


def _mlflow():
    uri = os.getenv("MLFLOW_TRACKING_URI")
    if not uri:
        return None
    try:
        import mlflow

        mlflow.set_tracking_uri(uri)
        exp = os.getenv("MLFLOW_EXPERIMENT_NAME", "orchestrator")
        mlflow.set_experiment(exp)
        return mlflow
    except Exception as e:
        print("MLflow init skipped:", e)
        return None


def _build_summary(mode: str, provider: str, model: str, agent_runs: Sequence[dict], error: Optional[str]):
    lines = [
        f"# Run summary",
        f"- mode: {mode}",
        f"- provider: {provider}",
        f"- model: {model}",
        f"- status: {'failed' if error else 'success'}",
        "",
        "## Agents",
    ]
    for a in agent_runs:
        status = "failed" if a.get("error") else "success"
        dur = a.get("duration_s")
        lines.append(f"- {a['name']}: {status}{f' ({dur:.2f}s)' if dur is not None else ''}")
    if error:
        lines.extend(["", "## Error", error])
    return "\n".join(lines)


def log_run(
    mode: str,
    prompt: str,
    provider: str,
    model: str,
    results: Optional[Mapping[str, Any]] = None,
    duration_s: Optional[float] = None,
    error: Optional[str] = None,
    agent_runs: Optional[Sequence[dict]] = None,
):
    """Log a parent run and optional nested agent runs."""
    mlflow = _mlflow()
    if not mlflow:
        return

    agent_runs = list(agent_runs or [])
    try:
        run_name = f"{mode}-{provider}-{model}"
        status = "failed" if error else "success"
        prompt_len = len(prompt or "")
        result_len = sum(len(str(v) or "") for v in (results or {}).values())

        with mlflow.start_run(run_name=run_name):
            mlflow.set_tags(
                {
                    "mode": mode,
                    "provider": provider,
                    "model": model,
                    "status": status,
                    "type": "parent",
                }
            )
            mlflow.log_params({"mode": mode, "provider": provider, "model": model})
            mlflow.log_metrics(
                {
                    "prompt_length": prompt_len,
                    "results_length": result_len,
                    **({"duration_s": duration_s} if duration_s is not None else {}),
                    "success": 0 if error else 1,
                }
            )
            mlflow.log_dict({"prompt": prompt}, "prompt.json")
            mlflow.log_text(prompt, "prompt.txt")
            if results:
                mlflow.log_text(json.dumps(results, ensure_ascii=False, indent=2), "results.json")
            summary = _build_summary(mode, provider, model, agent_runs, error)
            mlflow.log_text(summary, "summary.md")
            if error:
                mlflow.log_text(error, "error.txt")

            # Nested runs for each agent
            for agent in agent_runs:
                name = agent.get("name")
                if not name:
                    continue
                a_res = agent.get("result")
                a_err = agent.get("error")
                a_status = "failed" if a_err else "success"
                with mlflow.start_run(run_name=f"{run_name}-{name}", nested=True):
                    mlflow.set_tags(
                        {
                            "mode": mode,
                            "provider": provider,
                            "model": model,
                            "agent": name,
                            "status": a_status,
                            "type": "agent",
                        }
                    )
                    mlflow.log_params({"agent": name})
                    mlflow.log_metrics(
                        {
                            **({"duration_s": agent.get("duration_s")} if agent.get("duration_s") is not None else {}),
                            "result_length": len(a_res or ""),
                            "success": 0 if a_err else 1,
                        }
                    )
                    mlflow.log_text(prompt, "prompt.txt")
                    if a_res is not None:
                        mlflow.log_text(str(a_res), "result.txt")
                    if a_err:
                        mlflow.log_text(a_err, "error.txt")
    except Exception as e:
        print("MLflow logging skipped:", e)
