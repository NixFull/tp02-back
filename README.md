# Orchestrateur multi-agents (MGL7360)

Preuve de concept d'une application multi-agents qui assiste la conception et la réalisation de projets logiciels.  
Les agents (planification, architecture, DevOps, risques) peuvent être exécutés séquentiellement ou pilotés par un graphe LangGraph. Le frontend React consomme l'API FastAPI exposée par le service `orchestrator`.

## Démarrage rapide

1. Renseigner les clés API nécessaires dans `.env` (voir `.env.example`).  
2. Lancer l'environnement complet :
   ```bash
   docker-compose up --build
   ```
3. Frontend : http://localhost:3000  
   API FastAPI : http://localhost:8000/docs  
   Ollama (optionnel) : http://localhost:11434  
   MLflow UI : http://localhost:5001

## Variables d'environnement

- `OPENAI_API_KEY`, `GOOGLE_API_KEY`, `ANTHROPIC_API_KEY`, `GROQ_API_KEY`, `MISTRAL_API_KEY` : clés LLM selon le provider choisi.
- `MLFLOW_TRACKING_URI` (optionnel) : URL du serveur MLflow pour tracer les runs ; si non défini, rien n'est enregistré (ex: `http://mlflow:5000`).
- `MLFLOW_EXPERIMENT_NAME` (optionnel) : nom d'expérience MLflow (défaut `orchestrator`).
- `OLLAMA_URL` : URL d'Ollama (par défaut `http://ollama:11434`).
- `VITE_API_URL` : URL de l'API pour le frontend (par défaut `http://localhost:8000`).

## Architecture

- **services/orchestrator** : API FastAPI + agents LangChain + graphe LangGraph orchestrant les agents.
- **services/mlflow** : serveur MLflow (SQLite + artifacts locaux) pour tracer les runs du backend.
- **frontend** : Vite + React + TypeScript, interface pour saisir l'énoncé, choisir le provider/modèle et visualiser les retours agents.
- **docker-compose.yml** : lance Ollama (optionnel), l'orchestrateur, MLflow et le frontend (servi par Nginx).

## Flux principal

1. L'utilisateur soumet un énoncé de projet via le frontend.
2. Le backend déclenche les agents (mode spécifique ou `auto` pour tous).
3. Optionnellement, l'exécution passe par LangGraph pour que le superviseur déclenche chaque agent.
4. Les réponses structurées sont renvoyées au frontend qui les affiche par domaine.
