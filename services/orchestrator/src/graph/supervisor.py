from src.agents.registry import get_ordered_agents
from src.graph.state import GraphState


async def supervisor_node(state: GraphState):
    done = list(state.get("executed", []))
    order = [a["id"] for a in get_ordered_agents()]

    if state["mode"] == "auto":
        for agent in order:
            if agent not in done:
                done.append(agent)
                state["next_agent"] = agent
                state["executed"] = done
                return state
        state["next_agent"] = "end"
        state["executed"] = done
        return state

    if state["mode"] not in done:
        done.append(state["mode"])
        state["next_agent"] = state["mode"]
        state["executed"] = done
        return state

    state["next_agent"] = "end"
    state["executed"] = done
    return state
