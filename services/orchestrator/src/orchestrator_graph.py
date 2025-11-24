
from src.graph.graph_builder import build_graph
graph=build_graph()

def run_multigraph(prompt,mode,provider,model):
    return graph.invoke({
        "prompt":prompt,
        "mode":mode,
        "provider":provider,
        "model":model,
        "executed":[]
    })
