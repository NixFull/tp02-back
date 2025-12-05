
from langgraph.graph import StateGraph, END
from src.graph.agents import (
    analyst_node,
    architecture_node,
    dev_node,
    qa_node,
    devops_node,
    pm_node,
)
from src.graph.supervisor import supervisor_node
from src.graph.state import GraphState


def build_graph():
    g = StateGraph(GraphState)
    g.add_node("supervisor", supervisor_node)
    g.add_node("analyst", analyst_node)
    g.add_node("architecture", architecture_node)
    g.add_node("dev", dev_node)
    g.add_node("qa", qa_node)
    g.add_node("devops", devops_node)
    g.add_node("pm", pm_node)

    g.set_entry_point("supervisor")

    g.add_conditional_edges(
        "supervisor",
        lambda state: state["next_agent"],
        {
            "analyst": "analyst",
            "architecture": "architecture",
            "dev": "dev",
            "qa": "qa",
            "devops": "devops",
            "pm": "pm",
            "end": END,
        },
    )

    for agent in ["analyst", "architecture", "dev", "qa", "devops", "pm"]:
        g.add_edge(agent, "supervisor")

    return g.compile()
