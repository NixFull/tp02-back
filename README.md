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

## Variables d'environnement

- `OPENAI_API_KEY`, `GOOGLE_API_KEY`, `ANTHROPIC_API_KEY`, `GROQ_API_KEY`, `MISTRAL_API_KEY` : clés LLM selon le provider choisi.
- `OLLAMA_URL` : URL d'Ollama (par défaut `http://ollama:11434`).
- `VITE_API_URL` : URL de l'API pour le frontend (par défaut `http://localhost:8000`).

## Architecture

- **services/orchestrator** : API FastAPI + agents LangChain + graphe LangGraph orchestrant les agents.
- **frontend** : Vite + React + TypeScript, interface pour saisir l'énoncé, choisir le provider/modèle et visualiser les retours agents.
- **docker-compose.yml** : lance Ollama (optionnel), l'orchestrateur et le frontend (servi par Nginx).

## Flux principal

1. L'utilisateur soumet un énoncé de projet via le frontend.
2. Le backend déclenche les agents (mode spécifique ou `auto` pour tous).
3. Optionnellement, l'exécution passe par LangGraph pour que le superviseur déclenche chaque agent.
4. Les réponses structurées sont renvoyées au frontend qui les affiche par domaine.
