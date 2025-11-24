from src.core.chain_factory import build_chain
_SYSTEM="""You are a senior project planner..."""
def run_planning(p,prov,model):return build_chain(_SYSTEM,prov,model).invoke({"input":p}).content
