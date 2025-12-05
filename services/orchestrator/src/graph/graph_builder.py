from langgraph.graph import StateGraph, END
from src.agents.registry import get_ordered_agents
from src.graph.supervisor import supervisor_node
from src.graph.state import GraphState


def _build_agent_nodes(graph: StateGraph[GraphState]):
    for agent in get_ordered_agents():
        agent_id = agent["id"]
        runner = agent["runner"]

        async def node(state: GraphState, _runner=runner, _agent_id=agent_id):
            result = _runner(state["prompt"], state["provider"], state["model"])
            state[_agent_id] = result
            return state

        graph.add_node(agent_id, node)


def build_graph():
    g = StateGraph(GraphState)
    g.add_node("supervisor", supervisor_node)
    _build_agent_nodes(g)

    g.set_entry_point("supervisor")

    choices = {agent["id"]: agent["id"] for agent in get_ordered_agents()}
    choices["end"] = END

    g.add_conditional_edges(
        "supervisor",
        lambda state: state["next_agent"],
        choices,
    )

    for agent in [a["id"] for a in get_ordered_agents()]:
        g.add_edge(agent, "supervisor")

    return g.compile()
