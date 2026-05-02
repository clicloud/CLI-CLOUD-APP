# RunPod Container Migration Opportunities — CLI Platform

Clide research scan: 2026-05-02T16:48 UTC
Purpose: Identify containers, pods, and serverless workloads on RunPod that can be tested, replicated, or migrated to CLI's own container platform.

---

## Current State

- RunPod gateway LIVE at app.cli.cloud/llm — health check passing
- Active pod: m23e9pw2qaz3mn — Qwen 3.6-35B-A3B-GPTQ-Int4 on NVIDIA A40 (48GB), $0.44/hr
- Gateway provides: OpenAI-compatible API, sync/async batch, pod lifecycle (auto start/stop on idle), streaming completions
- Available GPUs: RTX 3090/4090/5090, L4, A5000, A40, L40S, RTX 6000 Ada, A100 80GB, H100, H200, B200
- Serverless endpoint capability confirmed (runpodctl serverless create)
- Templates include: PyTorch 2.1-2.8, ComfyUI, base Ubuntu — plus custom templates possible

---

## High-Value Migration Opportunities

### Tier 1 — Immediate, Proven, High ROI

#### 1. vLLM Serving Containers (LLM Inference as a Service)
- What RunPod does: One-click vLLM pods serving any HuggingFace model via OpenAI-compatible API
- CLI migration path: Package vLLM + model config as a CLI container template. User picks model, GPU tier, gets an instant /v1/chat/completions endpoint
- Why high value: This is the exact workload already running on CLI's gateway. Productizing it = CLI's flagship container
- Priority: Critical — this IS the product demo
- Estimated effort: Template + orchestration layer already exists (the gateway). Need: container packaging, CLI catalog entry, deploy dialog

#### 2. ComfyUI / AI Image Generation Containers
- What RunPod does: Pre-built ComfyUI templates with GPU acceleration, model management, API access
- CLI migration path: Package ComfyUI with CUDA as a deployable container. Users get a Stable Diffusion / Flux endpoint
- Why high value: High-demand use case, visual output is great for demos, GPU monetization opportunity
- Priority: High
- Estimated effort: Medium — container is straightforward, model storage and checkpoint management needs design

#### 3. Jupyter / Development Environment Containers
- What RunPod does: GPU-powered Jupyter notebooks for ML experimentation
- CLI migration path: Jupyter + CUDA container with persistent storage for notebooks
- Why high value: Developer onboarding tool, educates users on CLI's GPU capabilities, sticky (data persists)
- Priority: High
- Estimated effort: Low — well-documented Docker images exist

### Tier 2 — Trending, Differentiated, Ecosystem-Building

#### 4. Ollama / Local LLM Runtime Containers
- What RunPod does: Users run Ollama to serve open-source models (Llama, Mistral, Gemma)
- CLI migration path: Ollama container with pre-loaded popular models. One-click deploy = instant LLM endpoint
- Why high value: Simpler than vLLM for smaller models, popular with indie devs, CLI can compete on ease-of-use
- Priority: High
- Estimated effort: Low-medium — Ollama has official Docker support

#### 5. AI Agent / MCP Server Containers
- What's trending: AI agent frameworks (LangChain, CrewAI, AutoGen) running as persistent services
- CLI migration path: Pre-built agent containers that connect to LLM APIs. Deploy an agent, get an API endpoint
- Why high value: CLI's unique angle — deploy AI agents as containers that other containers can call. Agent-to-agent marketplace
- Priority: High — differentiator
- Estimated effort: Medium — needs standardized agent interface spec

#### 6. DevOps / CI Runner Containers
- What RunPod does: GPU-accelerated CI runners for model training pipelines
- CLI migration path: GitHub Actions runner container, GitLab runner container
- Why high value: Practical, enterprise-adjacent, complements CI/CD push already in progress
- Priority: Medium
- Estimated effort: Low — runner images are well-documented

#### 7. Database-as-a-Service Containers
- What platforms do: One-click Postgres, Redis, MongoDB, Qdrant (vector DB)
- CLI migration path: Package popular databases as managed containers with persistent volumes
- Why high value: Every app needs a database. If CLI offers one-click DB deploys alongside app deploys, it becomes a full platform
- Priority: High — complements existing catalog spec
- Estimated effort: Low-medium per database

#### 8. WordPress / CMS Containers
- What DigitalOcean/Railway do: One-click WordPress with MySQL/MariaDB
- CLI migration path: WordPress + MariaDB container combo with persistent storage
- Why high value: Massive market, proven demand, Anita's PHP/MariaDB expertise is a direct fit
- Priority: Medium-High
- Estimated effort: Medium — need dual-container orchestration (app + DB)

### Tier 3 — Bleeding Edge, Trending, Experimental

#### 9. Cosign / Sigstore-Signed Container Registry
- Connection to Savage's directive: Research cosign.run for signing CLI's own container images
- CLI migration path: Integrate cosign verification into CLI's deploy pipeline. Every container gets a signed attestation
- Why high value: Security differentiator. CLI becomes the platform where every deploy is verified
- Priority: Medium — infrastructure layer, not user-facing container
- Estimated effort: Medium — needs registry integration

#### 10. WebAssembly (Wasm) Runtime Containers
- What's trending: WasmEdge, wasmtime as lightweight alternative to Docker
- CLI migration path: Offer Wasm runtimes alongside Docker containers for lighter workloads
- Why high value: Cost efficiency (no full OS overhead), fast cold starts, edge-deployment story
- Priority: Low-Medium — forward-looking
- Estimated effort: High — different runtime model

#### 11. Serverless Function Containers
- What RunPod does: Serverless GPU endpoints that scale to zero
- CLI migration path: Build a serverless function runtime. Users upload code (Python/JS), CLI wraps it in a container, auto-scales
- Why high value: Serverless is the #1 ask for container platforms. Zero-to-scale story
- Priority: High — but depends on core container platform maturity
- Estimated effort: High — needs orchestration, cold-start optimization, billing integration

---

## Immediate Next Actions

1. Test-probe the existing vLLM pod with different models to validate the migration pattern
2. Create ComfyUI container template as the second deployable offering
3. Draft Ollama container spec for lightweight LLM serving
4. Research Railway/DigitalOcean container repos for copyable templates (Savage's earlier directive)
5. Integrate cosign.run signing into the container build pipeline
6. Package Qdrant or Postgres as the first database container

---

## Dependencies

- RunPod API direct access: Currently returning 404s on REST endpoints. Gateway works. May need to verify API key rotation or use runpodctl CLI instead of REST
- Container platform backend: Anita's deployment pipeline needs to be functional before containers can be tested end-to-end
- GPU pricing model: CLI needs to decide how to price GPU containers vs CPU containers

---

This document is a living planning ledger. Update as opportunities are validated or deprioritized.
