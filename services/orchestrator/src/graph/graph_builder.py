
from langgraph.graph import StateGraph, END
from src.graph.agents import planner_node, architecture_node, devops_node, risk_node
from src.graph.supervisor import supervisor_node

def build_graph():
    g=StateGraph()
    g.add_node("supervisor", supervisor_node)
    g.add_node("planning", planner_node)
    g.add_node("architecture", architecture_node)
    g.add_node("devops", devops_node)
    g.add_node("risk", risk_node)

    g.add_edge("supervisor","planning")
    g.add_edge("supervisor","architecture")
    g.add_edge("supervisor","devops")
    g.add_edge("supervisor","risk")

    for a in ["planning","architecture","devops","risk"]:
        g.add_edge(a,"supervisor")

    g.add_edge("supervisor", END)
    return g.compile()
