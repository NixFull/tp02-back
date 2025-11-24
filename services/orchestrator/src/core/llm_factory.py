
import os
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_groq import ChatGroq
from langchain_mistralai import ChatMistralAI
from langchain_community.chat_models import ChatOllama

def get_llm(provider, model):
    p=provider.lower()
    if p=="openai":
        return ChatOpenAI(model=model,temperature=0.2,openai_api_key=os.getenv("OPENAI_API_KEY"))
    if p=="anthropic":
        return ChatAnthropic(model=model,temperature=0.2,anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"))
    if p=="groq":
        return ChatGroq(model=model,temperature=0.2,groq_api_key=os.getenv("GROQ_API_KEY"))
    if p=="mistral":
        return ChatMistralAI(model=model,temperature=0.2,mistral_api_key=os.getenv("MISTRAL_API_KEY"))
    if p=="ollama":
        return ChatOllama(model=model,temperature=0.2,base_url=os.getenv("OLLAMA_URL","http://ollama:11434"))
    raise ValueError("Unknown provider")
