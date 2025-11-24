from src.core.chain_factory import build_chain
_SYSTEM="""You are a DevOps expert..."""
def run_devops(p,prov,model):return build_chain(_SYSTEM,prov,model).invoke({"input":p}).content
