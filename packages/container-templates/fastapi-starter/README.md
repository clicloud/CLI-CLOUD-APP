# AI Backend Starter — FastAPI + SQLite

Python API with one endpoint and a SQLite database. Perfect for AI/LLM app backends. Deploy on CLI in under 5 minutes.

## Deploy on CLI

1. Fork or clone this repo
2. Push to your GitHub account
3. In CLI dashboard: New Deployment → Select Repo → Deploy
4. Your API is live at `https://your-app.cli.cloud`
5. Visit `/docs` for the interactive Swagger UI

## Test it

```bash
curl https://your-app.cli.cloud/
curl -X POST "https://your-app.cli.cloud/items?name=my-first-item"
curl https://your-app.cli.cloud/items
```

## What to build next

- **LLM proxy** — Add an OpenAI/Anthropic API integration
- **RAG pipeline** — Add vector search with embeddings
- **Agent backend** — Build a tool-calling agent API

## Tech stack

- FastAPI 0.111
- Uvicorn with HTTP/2 support
- Python 3.11
- SQLite with persistent volume
