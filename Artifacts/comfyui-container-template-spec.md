# ComfyUI Container Template Spec — CLI Catalog

## Overview
ComfyUI is a node-based Stable Diffusion GUI/workflow engine. This spec defines how CLI provisions ComfyUI as a GPU-accelerated container with CUDA support, persistent model storage, and API access.

## Container Image
- **Base**: `nvidia/cuda:12.1.1-runtime-ubuntu22.04`
- **Application**: ComfyUI (latest from `comfyanonymous/ComfyUI` GitHub repo)
- **Python**: 3.11 via pyenv
- **CUDA**: 12.1+ (required for SDXL, Flux, etc.)
- **Exposed ports**: 8188 (web UI / API)

## Resource Tiers

| Tier | GPU | VRAM | RAM | vCPU | Storage | Price Target |
|------|-----|------|-----|------|---------|-------------|
| Starter | 1x T4 | 16GB | 16GB | 4 | 50GB SSD | Entry |
| Standard | 1x A10G | 24GB | 32GB | 8 | 100GB SSD | Mid |
| Pro | 1x A100 | 80GB | 64GB | 12 | 200GB SSD | High |
| Multi | 2x A100 | 160GB | 128GB | 16 | 400GB SSD | Enterprise |

## Model Storage Design
- **Persistent volume**: `/workspace/models/` mounted from separate block storage
- Directory structure follows ComfyUI conventions:
  - `models/checkpoints/` — SDXL, Flux, SD 1.5 checkpoint files
  - `models/loras/` — LoRA adapters
  - `models/vae/` — VAE models
  - `models/controlnet/` — ControlNet models
  - `models/clip/` — CLIP models
- Model cache persists across container restarts
- Initial seed: popular SDXL model pre-downloaded on first boot

## API Access Patterns

### REST API (ComfyUI native)
```
POST /prompt          — Submit workflow JSON for execution
GET  /history/{id}    — Get execution result
GET  /view            — Retrieve generated image
WS   /ws              — Real-time execution progress
```

### CLI Integration
- API key injected via `CLI_API_KEY` environment variable
- All endpoints proxied through CLI gateway at `api.cli.cloud/containers/{id}/`
- Webhook support for async completion notification

### Example Workflow Submission
```json
{
  "prompt": {
    "3": {
      "class_type": "KSampler",
      "inputs": {
        "seed": 156680208700286,
        "steps": 20,
        "cfg": 8,
        "sampler_name": "euler",
        "scheduler": "normal",
        "denoise": 1,
        "model": ["4", 0],
        "positive": ["6", 0],
        "negative": ["7", 0],
        "latent_image": ["5", 0]
      }
    }
  }
}
```

## Dockerfile Reference
```dockerfile
FROM nvidia/cuda:12.1.1-runtime-ubuntu22.04

RUN apt-get update && apt-get install -y \
    git python3 python3-pip python3-venv \
    libgl1 libglib2.0-0 libsm6 libxrender1 \
    && rm -rf /var/lib/apt/lists/*

RUN python3 -m venv /opt/comfyui
ENV PATH="/opt/comfyui/bin:${PATH}"

RUN git clone https://github.com/comfyanonymous/ComfyUI.git /opt/ComfyUI
WORKDIR /opt/ComfyUI
RUN pip install --no-cache-dir -r requirements.txt

VOLUME /workspace/models
EXPOSE 8188

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost:8188/ || exit 1

CMD ["python3", "main.py", "--listen", "0.0.0.0", "--port", "8188"]
```

## Deploy Dialog UI Labels

| Field | Label | Type | Default | Required |
|-------|-------|------|---------|----------|
| tier | GPU Tier | dropdown | Starter | yes |
| model_seed | Pre-load Model | dropdown | SDXL 1.0 | no |
| persist_storage | Persistent Storage | toggle | true | no |
| api_key | CLI API Key | auto | (generated) | yes |
| auto_shutdown | Auto-shutdown idle (min) | number | 30 | no |

## Security Considerations
- API key required for all requests
- No root access from external
- Model downloads restricted to HTTPS sources only
- GPU memory isolation via NVIDIA MPS or MIG where available
- Resource limits enforced to prevent runaway generation loops

## Health Check
- HTTP GET to `:8188/` every 30 seconds
- Container marked unhealthy after 3 consecutive failures
- Auto-restart on unhealthy status (max 3 retries, then alert user)

## Backup & Recovery
- Model storage volumes are snapshot-capable
- Workflow configurations exportable as JSON
- Container state is ephemeral; only `/workspace/models/` persists

## Competitive References
- RunPod ComfyUI template: one-click deploy with model caching
- Modal serverless ComfyUI: pay-per-inference without persistent container
- This template differentiates via CLI's unified API gateway, persistent tiered storage, and simple deploy dialog
