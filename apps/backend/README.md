# CLI Cloud — Backend

The backend service for cli.cloud's container deployment platform. Handles container lifecycle management, catalog definitions, user authentication, and deployment orchestration.

## Architecture

This is a monorepo backend (`apps/backend/`) that provides:

- Container deployment API — create, list, inspect, and destroy containers
- Catalog management — predefined templates users can deploy in one click
- Authentication and authorization — CLI account integration
- Deployment pipeline — build, push, and run containers from templates or custom images

## Container Catalog

The platform ships with six starter templates:

| Label | Template | Port | Runtime |
|---|---|---|---|
| Web App | Next.js | 3000 | Node.js 20 |
| AI Backend | FastAPI + SQLite | 8000 | Python 3.11 |
| Chat Bot | Telegram Bot (Python) | — | Python 3.11 |
| Simple Site | Static HTML | 80 | Nginx/Caddy |
| API Server | Express.js | 3000 | Node.js 20 |
| OpenClaw | Custom container | 8080 | Docker image |

Each catalog entry defines: template source repo, runtime kind, default port, env defaults, storage allocation, supported capabilities (logs/exec/metrics), build steps, and start command. See `container-catalog-spec.md` in the project docs for the full spec.

## API Endpoints

Core endpoints (extend as needed):

- `POST /deploy` — Deploy a container from a catalog template or custom image
- `GET /containers` — List running containers for the authenticated user
- `GET /containers/:id` — Inspect a specific container (status, logs, metrics)
- `DELETE /containers/:id` — Stop and remove a container
- `GET /catalog` — List available catalog templates
- `POST /auth/login` — Authenticate via CLI credentials

## Getting Started

1. Ensure Node.js 20+ and npm are installed
2. Install dependencies: `npm ci`
3. Configure environment variables (see `.env.example`)
4. Run in development: `npm run dev`
5. Run in production: `npm run build && npm start`

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `PORT` | Server listen port (default: 3000) | No |
| `DATABASE_URL` | Database connection string | Yes |
| `JWT_SECRET` | Token signing key | Yes |
| `CONTAINER_RUNTIME` | Runtime driver (docker/k8s) | Yes |

## Deployment

This backend is designed to run on CLI's own infrastructure. Deploy via the CLI platform or push to the monorepo's main branch for CI/CD.

## Notes

- The backend is functionally complete. Remaining work is frontend (landing page, deploy dialog UI) and marketing/onboarding.
- Container catalog entries are defined in code and can be extended without frontend changes.
- All template source repos live under the `clicloud` GitHub organization (e.g. `clicloud/templates/nextjs-starter`).
