class MissingApiKeyError(ValueError):
    """Raised when a provider is selected without the required API key."""


class ModelNotFoundError(ValueError):
    """Raised when a model name is missing or invalid."""
