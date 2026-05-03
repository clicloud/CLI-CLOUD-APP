# Ollama Container Spec — CLI Catalog

## Overview
Ollama provides lightweight, local LLM serving with a simple pull/run API pattern. This spec defines how CLI provisions Ollama containers with pre-loaded popular models, persistent model cache, and resource-tiered configurations.

## Container Image
- **Base**: `ubuntu:22.04`
- **Application**: Ollama (latest from `ollama/ollama` official image)
- **Exposed ports**: 11434 (Ollama API)

## Resource Tiers

| Tier | GPU | VRAM | RAM | vCPU | Storage | Price Target | Best For |
|------|-----|------|-----|------|---------|-------------|----------|
| Nano | CPU only | — | 8GB | 4 | 20GB SSD | Cheapest | Small models (Phi-3, TinyLlama) |
| Starter | 1x T4 | 16GB | 16GB | 4 | 50GB SSD | Entry | 7B-13B models |
| Standard | 1x A10G | 24GB | 32GB | 8 | 100GB SSD | Mid | 13B-34B models, Q4/Q5 quant |
| Pro | 1x A100 | 80GB | 64GB | 12 | 200GB SSD | High | 70B+ models, full precision |

## Pre-loaded Models

### Default (auto-pulled on first boot)
- `llama3:8b` — Meta Llama 3 8B, Q4_K_M quantization (~4.7GB)
- `gemma3:4b` — Google Gemma 3 4B (~2.5GB)
- `mistral:7b` — Mistral 7B v0.3, Q4_K_M (~4.4GB)

### Available on-demand (user selects from catalog)
- `llama3:70b` — Llama 3 70B (requires Pro tier)
- `codellama:34b` — Code Llama 34B (requires Standard+)
- `deepseek-coder:33b` — DeepSeek Coder 33B (requires Standard+)
- `phi3:14b` — Microsoft Phi-3 Medium 14B
- `qwen2:72b` — Qwen 2 72B (requires Pro tier)

### Model Download Strategy
- On container start, Ollama pulls selected models sequentially
- Models stored in persistent volume `/workspace/.ollama/`
- Subsequent starts skip already-cached models
- Download progress exposed via CLI dashboard
- Background pull does not block API availability for already-cached models

## Persistent Volume Design
- **Mount**: `/workspace/.ollama` → persistent block storage
- Contains model blobs, metadata, and Ollama config
- Survives container restarts and re-deploys
- Snapshot-capable for backup

## API Access Patterns

### Ollama REST API (proxied through CLI gateway)
```
POST /api/generate    — Generate completion
POST /api/chat        — Chat completion
POST /api/embeddings  — Generate embeddings
GET  /api/tags        — List available models
POST /api/pull        — Pull a new model
POST /api/show        — Show model info
```

### CLI Gateway Proxy
- All endpoints accessible at `api.cli.cloud/containers/{id}/`
- API key injected via `CLI_API_KEY` env var
- Rate limiting per tier:
  - Nano: 10 req/min
  - Starter: 30 req/min
  - Standard: 60 req/min
  - Pro: 120 req/min

### Example Chat Request
```bash
curl -X POST api.cli.cloud/containers/{id}/api/chat \
  -H "Authorization: Bearer $CLI_API_KEY" \
  -d '{
    "model": "llama3:8b",
    "messages": [
      {"role": "user", "content": "Explain quantum computing in one paragraph"}
    ],
    "stream": false
  }'
```

### Streaming Support
- SSE streaming supported via `"stream": true`
- CLI gateway proxies stream directly to client
- Connection timeout: 300s for generation, 30s for idle

## Dockerfile Reference
```dockerfile
FROM ollama/ollama:latest

# Install curl for healthcheck and model management
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Persistent model storage
VOLUME /workspace/.ollama

# Copy startup script
COPY ollama-startup.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/ollama-startup.sh

EXPOSE 11434

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost:11434/api/tags || exit 1

ENTRYPOINT ["ollama-startup.sh"]
```

### Startup Script (`ollama-startup.sh`)
```bash
#!/bin/bash
set -e

# Start Ollama server in background
ollama serve &
SERVER_PID=$!

# Wait for server to be ready
for i in $(seq 1 30); do
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        break
    fi
    sleep 1
done

# Pull pre-selected models (comma-separated in MODEL_LIST env var)
IFS=',' read -ra MODELS <<< "${MODEL_LIST:-llama3:8b,gemma3:4b,mistral:7b}"
for model in "${MODELS[@]}"; do
    model=$(echo "$model" | xargs)  # trim whitespace
    if [ -n "$model" ]; then
        echo "Pulling model: $model"
        ollama pull "$model" || echo "Warning: failed to pull $model"
    fi
done

echo "Ollama ready with models: $(ollama list)"

# Keep server running
wait $SERVER_PID
```

## Deploy Dialog UI Labels

| Field | Label | Type | Default | Required |
|-------|-------|------|---------|----------|
| tier | Resource Tier | dropdown | Starter | yes |
| model_list | Pre-load Models | multi-select | llama3:8b, gemma3:4b, mistral:7b | no |
| persist_storage | Persistent Storage | toggle | true | no |
| api_key | CLI API Key | auto | (generated) | yes |
| auto_shutdown | Auto-shutdown idle (min) | number | 60 | no |
| max_context | Max Context Length | number | 4096 | no |

## Security Considerations
- API key required for all requests through CLI gateway
- Ollama API listens on localhost only; external access via proxy
- No root shell access from external
- Model downloads restricted to `registry.ollama.ai` only
- Container runs as non-root user
- GPU memory enforced via NVIDIA device plugin limits

## Health Check
- HTTP GET to `:11434/api/tags` every 30 seconds
- Returns 200 with model list when healthy
- Container marked unhealthy after 3 consecutive failures
- Auto-restart on unhealthy (max 3 retries, then alert)

## Competitive References
- RunPod Ollama template: one-click with model pre-loading
- Ollama official Docker: basic serve without persistence or gateway
- This template differentiates via CLI's unified API gateway, tiered GPU allocation, persistent model cache, and rate-limited multi-tenant access
