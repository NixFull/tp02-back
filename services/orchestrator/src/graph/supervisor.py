
async def supervisor_node(state):
    done=state.get("executed",[])
    if state["mode"]=="auto":
        order=["planning","architecture","devops","risk"]
        for a in order:
            if a not in done:
                state["next_agent"]=a
                done.append(a)
                state["executed"]=done
                return state
        state["next_agent"]="end"
        return state
    if state["mode"] not in done:
        state["next_agent"]=state["mode"]
        done.append(state["mode"])
        state["executed"]=done
        return state
    state["next_agent"]="end"
    return state
