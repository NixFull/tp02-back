
from src.agents.planning_agent import run_planning
from src.agents.architecture_agent import run_architecture
from src.agents.devops_agent import run_devops
from src.agents.risk_agent import run_risk

async def planner_node(state):
    state["planning"]=run_planning(state["prompt"],state["provider"],state["model"])
    return state

async def architecture_node(state):
    state["architecture"]=run_architecture(state["prompt"],state["provider"],state["model"])
    return state

async def devops_node(state):
    state["devops"]=run_devops(state["prompt"],state["provider"],state["model"])
    return state

async def risk_node(state):
    state["risk"]=run_risk(state["prompt"],state["provider"],state["model"])
    return state
