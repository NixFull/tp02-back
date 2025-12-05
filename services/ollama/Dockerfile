FROM ollama/ollama:latest

ARG DEFAULT_MODEL=llama3.1:8b
ENV DEFAULT_MODEL=${DEFAULT_MODEL}

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# The base image already exposes 11434; we wrap the entrypoint to ensure the model is present.
ENTRYPOINT ["/entrypoint.sh"]
CMD ["serve"]
