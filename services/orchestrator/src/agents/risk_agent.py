from src.core.chain_factory import build_chain
_SYSTEM="""You are a risk analyst..."""
def run_risk(p,prov,model):return build_chain(_SYSTEM,prov,model).invoke({"input":p}).content
