
from langchain_core.prompts import ChatPromptTemplate
from .llm_factory import get_llm

def build_chain(system, provider, model):
    llm=get_llm(provider, model)
    prompt=ChatPromptTemplate.from_messages([
        ("system", system),
        ("user","{input}")
    ])
    return prompt | llm
