
from src.agents.planning_agent import run_planning
from src.agents.architecture_agent import run_architecture
from src.agents.devops_agent import run_devops
from src.agents.risk_agent import run_risk

def orchestrate(mode,prompt,provider,model):
    res={}
    if mode=="planning": res["planning"]=run_planning(prompt,provider,model)
    elif mode=="architecture": res["architecture"]=run_architecture(prompt,provider,model)
    elif mode=="devops": res["devops"]=run_devops(prompt,provider,model)
    elif mode=="risk": res["risk"]=run_risk(prompt,provider,model)
    else:
        res["planning"]=run_planning(prompt,provider,model)
        res["architecture"]=run_architecture(prompt,provider,model)
        res["devops"]=run_devops(prompt,provider,model)
        res["risk"]=run_risk(prompt,provider,model)
    return res
