# CLI — Where We Are and Where We're Going

## What CLI Does

CLI (cli.cloud) is a container deployment platform that lets developers spin up GPU workloads, LLM serving endpoints, and AI tooling in seconds — no DevOps required. One-click deploy for models like Llama, Mistral, and Gemma on RunPod-grade GPU infrastructure, with a catalog of pre-configured containers for everything from ComfyUI to Ollama to full-stack databases.

We're building the platform that makes deploying AI infrastructure as simple as deploying a static site on Vercel.

## What We've Built (April–May 2026)

### Platform Foundation
- **Container deployment pipeline** — Full backend for provisioning, configuring, and serving container workloads. RunPod integration live. Database-as-a-service specs in progress.
- **Container catalog** — Specs drafted for Ollama (lightweight LLM), ComfyUI (image generation), vLLM (high-throughput serving), and database containers. Railway and DigitalOcean competitive research complete.
- **CI/CD pipeline** — GitHub Actions pipeline running lint, build, and test on every push/PR across the monorepo.

### Landing and Brand
- **Landing page V2** — Full redesign in progress. Dark, technical, minimal aesthetic. Deploy dialog component spec'd (container picker replaces generic "Start Deploying" button). Welcome onboarding mode spec'd for first-time users.
- **SVG marketing canvas tool** — Custom visual tool built in-house for generating marketing assets directly in the browser.
- **Brand identity forming** — VIP community visuals, verification screen redesign, and hero animation all in pipeline.

### Infrastructure
- **Monorepo architecture** — clicloud/cli-cloud and CLI-CLOUD-APP repos structured as a proper monorepo with frontend, backend, and shared packages. CodeRabbit integrated for automated PR review.
- **42 commits across two production bursts** — Foundation scaffolding (April 23) and a full documentation/spec avalanche (May 2).
- **Cosign container signing** — Spec complete for supply-chain-verified container images.

### Community
- **Dev hangout community** — Live developer community with inbound interest from active builders. Moose and others are waiting for the on-ramp.
- **Operations agent (Clide)** — Custom AI operations manager handling task routing, team accountability, GitHub automation, and documentation production. Running 24/7 in Telegram.

## Where We're Going

### Immediate (This Week)
- Finalize and ship the landing page V2 with deploy dialog and welcome flow
- Push container templates live (Ollama, ComfyUI, vLLM, databases)
- Open the platform to the dev hangout community for feedback

### Near-Term (30 Days)
- Full public launch of the container catalog
- BOSS (Business Operations & Scoring System) — workspace token for verifiable contributor economics
- Dedicated Telegram channels for community feedback, tasks, and updates

### Long-Term Vision
CLI becomes the default deployment layer for AI workloads — the same way Railway owns simple app deploys and Vercel owns frontend, CLI owns GPU and AI container deployment. One-click, infrastructure-grade, developer-first.

## The Team

Seven contributors across systems architecture, full-stack development, DeFi/blockchain infrastructure, product design, brand strategy, and operations. Distributed across US, South Africa, and Egypt. Shipping daily.

## Reach

We're early, we're fast, and we're building in public. The platform is taking shape and the community is already asking when they can deploy on it.
