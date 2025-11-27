FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir mlflow

EXPOSE 5000

VOLUME ["/app/mlruns"]

CMD ["mlflow", "server", "--host", "0.0.0.0", "--port", "5000", "--backend-store-uri", "sqlite:///mlflow.db", "--default-artifact-root", "/app/mlruns", "--allowed-hosts", "mlflow,mlflow:5000,localhost,localhost:5001,127.0.0.1,0.0.0.0", "--cors-allowed-origins", "*"]
