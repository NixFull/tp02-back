from src.core.chain_factory import build_chain
_SYSTEM="""You are a software architect..."""
def run_architecture(p,prov,model):return build_chain(_SYSTEM,prov,model).invoke({"input":p}).content
