# CLI Cloud

> A permissionless compute layer

## Repository Structure

```
CLI-CLOUD-APP/
├── .docs/                        # Architecture docs, planning specs, guides
│   └── planning/                 # Detailed planning documents
├── .github/workflows/            # CI/CD pipelines
├── Artifacts/                    # Generated deliverables, specs, and research
├── apps/
│   ├── backend/                  # API server
│   ├── frontend/                 # Dashboard UI
│   └── www/                      # Landing page (Vite + React)
├── packages/
│   └── container-templates/      # One-click deploy container templates
│       ├── nextjs-starter/       # Full-stack React framework (Node.js 20)
│       ├── fastapi-starter/      # Python API + SQLite (Python 3.11)
│       ├── telegram-bot-starter/ # Telegram bot (long-running process)
│       ├── express-starter/      # Minimal Node.js API server
│       └── static-starter/       # Static HTML site
└── README.md
```

## Container Templates

CLI offers one-click deployment of containerized applications. Templates live in `packages/container-templates/` and include Dockerfiles, compose configs, and README instructions for each stack.

See the [Container Catalog Spec](.docs/container-catalog-spec.md) for the full catalog with runtime configurations, ports, storage, and build steps.

## Artifacts

The `Artifacts/` directory contains generated specifications, research documents, messaging templates, and design assets produced during development. Each artifact includes metadata describing its origin, purpose, and related task context.

## Contributing

See [AGENTS.md](AGENTS.md) for contribution guidelines. One concept per PR, clean commit messages, all changes documented in `.docs/`.
