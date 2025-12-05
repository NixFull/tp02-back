from typing import Callable, Dict, List, TypedDict

from src.agents.analyst_agent import PROMPT_TEMPLATE as ANALYST_TEMPLATE, run_analyst
from src.agents.architecture_agent import PROMPT_TEMPLATE as ARCH_TEMPLATE, run_architecture
from src.agents.dev_agent import PROMPT_TEMPLATE as DEV_TEMPLATE, run_dev
from src.agents.qa_agent import PROMPT_TEMPLATE as QA_TEMPLATE, run_qa
from src.agents.devops_agent import PROMPT_TEMPLATE as DEVOPS_TEMPLATE, run_devops
from src.agents.pm_agent import PROMPT_TEMPLATE as PM_TEMPLATE, run_pm


class AgentInfo(TypedDict):
    id: str
    label: str
    description: str
    order: int
    prompt_template: dict
    runner: Callable[..., str]


AGENT_REGISTRY: List[AgentInfo] = [
    {
        "id": "analyst",
        "label": "Analyste (backlog)",
        "description": "User stories, backlog, dépendances et questions ouvertes.",
        "order": 1,
        "prompt_template": ANALYST_TEMPLATE,
        "runner": run_analyst,
    },
    {
        "id": "architecture",
        "label": "Architecte",
        "description": "Architecture, domaines, interfaces et non-fonctionnels.",
        "order": 2,
        "prompt_template": ARCH_TEMPLATE,
        "runner": run_architecture,
    },
    {
        "id": "dev",
        "label": "Dev (code/API)",
        "description": "Plan de code, contrats d’API, étapes de livraison.",
        "order": 3,
        "prompt_template": DEV_TEMPLATE,
        "runner": run_dev,
    },
    {
        "id": "qa",
        "label": "QA (tests)",
        "description": "Stratégie de tests, cas critiques et automatisation.",
        "order": 4,
        "prompt_template": QA_TEMPLATE,
        "runner": run_qa,
    },
    {
        "id": "devops",
        "label": "DevOps",
        "description": "CI/CD, runtime, résilience/sécurité, coûts et risques.",
        "order": 5,
        "prompt_template": DEVOPS_TEMPLATE,
        "runner": run_devops,
    },
    {
        "id": "pm",
        "label": "PM (dashboard)",
        "description": "Roadmap, KPIs, dépendances et communication.",
        "order": 6,
        "prompt_template": PM_TEMPLATE,
        "runner": run_pm,
    },
]


def get_agent_map() -> Dict[str, AgentInfo]:
    return {a["id"]: a for a in AGENT_REGISTRY}


def get_ordered_agents() -> List[AgentInfo]:
    return sorted(AGENT_REGISTRY, key=lambda a: a["order"])
