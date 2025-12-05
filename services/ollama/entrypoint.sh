#!/bin/sh
set -e

MODEL="${DEFAULT_MODEL:-llama3.1:8b}"

echo "Starting Ollama; ensuring default model '${MODEL}' is available."
if ! ollama list 2>/dev/null | grep -q "${MODEL}"; then
  echo "Model '${MODEL}' not found locally. Pulling..."
  if ! ollama pull "${MODEL}"; then
    echo "Warning: failed to pull model '${MODEL}'. Ollama will still start; pull manually later." >&2
  fi
else
  echo "Model '${MODEL}' already present."
fi

exec ollama "$@"
