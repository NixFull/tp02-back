
import os
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_groq import ChatGroq
from langchain_mistralai import ChatMistralAI
from langchain_community.chat_models import ChatOllama


def _require_env(var_name: str, provider: str) -> str:
    """Raise a helpful error when a provider is selected without its API key."""
    value = os.getenv(var_name)
    if not value:
        raise ValueError(f"{var_name} is required to use provider '{provider}'.")
    return value


def get_llm(provider: str, model: str):
    p = provider.lower()
    if p == "openai":
        return ChatOpenAI(
            model=model,
            temperature=0.2,
            openai_api_key=_require_env("OPENAI_API_KEY", provider),
        )
    if p == "anthropic":
        return ChatAnthropic(
            model=model,
            temperature=0.2,
            anthropic_api_key=_require_env("ANTHROPIC_API_KEY", provider),
        )
    if p == "groq":
        return ChatGroq(
            model=model,
            temperature=0.2,
            groq_api_key=_require_env("GROQ_API_KEY", provider),
        )
    if p == "mistral":
        return ChatMistralAI(
            model=model,
            temperature=0.2,
            mistral_api_key=_require_env("MISTRAL_API_KEY", provider),
        )
    if p == "ollama":
        return ChatOllama(
            model=model,
            temperature=0.2,
            base_url=os.getenv("OLLAMA_URL", "http://ollama:11434"),
            # Keep responses snappy on CPU-only setups.
            num_ctx=2048,
            num_predict=256,
            request_timeout=120,
        )
    raise ValueError(f"Unknown provider '{provider}'. Use openai, anthropic, groq, mistral, or ollama.")
