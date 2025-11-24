
from langgraph.graph import StateGraph, END
from src.graph.agents import planner_node, architecture_node, devops_node, risk_node
from src.graph.supervisor import supervisor_node
from src.graph.state import GraphState


def build_graph():
    g = StateGraph(GraphState)
    g.add_node("supervisor", supervisor_node)
    g.add_node("planning", planner_node)
    g.add_node("architecture", architecture_node)
    g.add_node("devops", devops_node)
    g.add_node("risk", risk_node)

    g.set_entry_point("supervisor")

    g.add_conditional_edges(
        "supervisor",
        lambda state: state["next_agent"],
        {
            "planning": "planning",
            "architecture": "architecture",
            "devops": "devops",
            "risk": "risk",
            "end": END,
        },
    )

    for agent in ["planning", "architecture", "devops", "risk"]:
        g.add_edge(agent, "supervisor")

    return g.compile()
