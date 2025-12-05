from src.agents.analyst_agent import run_analyst
from src.agents.architecture_agent import run_architecture
from src.agents.dev_agent import run_dev
from src.agents.qa_agent import run_qa
from src.agents.devops_agent import run_devops
from src.agents.pm_agent import run_pm
from src.graph.state import GraphState


async def analyst_node(state: GraphState):
    state["analyst"] = run_analyst(state["prompt"], state["provider"], state["model"])
    return state


async def architecture_node(state: GraphState):
    state["architecture"] = run_architecture(state["prompt"], state["provider"], state["model"])
    return state


async def dev_node(state: GraphState):
    state["dev"] = run_dev(state["prompt"], state["provider"], state["model"])
    return state


async def qa_node(state: GraphState):
    state["qa"] = run_qa(state["prompt"], state["provider"], state["model"])
    return state


async def devops_node(state: GraphState):
    state["devops"] = run_devops(state["prompt"], state["provider"], state["model"])
    return state


async def pm_node(state: GraphState):
    state["pm"] = run_pm(state["prompt"], state["provider"], state["model"])
    return state
