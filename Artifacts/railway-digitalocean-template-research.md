# Railway & DigitalOcean Container Template Research — CLI Catalog

## Objective
Survey Railway and DigitalOcean GitHub repos for pre-built container solutions (WordPress, databases, dev tools). Extract relevant template patterns that can be rebranded for the CLI container catalog.

## Railway Templates — Key Findings

### Source: github.com/railwayapp/templates
Railway maintains a template registry with ~100+ community and official templates. Each template is a GitHub repo with a `railway.json` or `railway.toml` config.

#### Relevant Templates for CLI Catalog

| Template | Category | CLI Relevance | Priority |
|----------|----------|---------------|----------|
| PostgreSQL | Database | Direct — DBaaS tier | High |
| Redis | Cache/Queue | Direct — DBaaS tier | High |
| Qdrant | Vector DB | Direct — AI/ML tier | High |
| Meilisearch | Search | Search-as-a-service | Medium |
| Grafana | Monitoring | Observability add-on | Low |
| Ghost | CMS | Web hosting catalog | Medium |
| WordPress | CMS | Web hosting catalog | High (high demand) |
| Plausible | Analytics | Web hosting catalog | Low |
| Uptime Kuma | Monitoring | Observability add-on | Low |

#### Pattern: Railway Template Structure
Each template uses:
- `railway.json` — service definition with start command, health check, environment variables
- Environment variable schema for user-configurable fields
- Auto-detected Dockerfile or Nixpacks build
- Persistent volume mounts for stateful services
- Internal networking via Railway's private mesh

**Extractable patterns for CLI**:
1. Environment variable schema → CLI deploy dialog field definitions
2. Health check definitions → CLI container health monitoring
3. Volume mount patterns → CLI persistent storage tiers
4. Start command templating → CLI container entry points

### Source: github.com/railwayapp/starters
Railway starters are simpler one-click deploy templates organized by framework.

**Notable patterns**:
- One repo per template with README deployment instructions
- `Dockerfile` included in each
- Environment variables documented in README
- Template metadata (name, description, icon) in repo root

## DigitalOcean Templates — Key Findings

### Source: github.com/digitalocean — multiple repos
DO maintains container templates under several repos:

#### marketplace-apps (github.com/digitalocean/marketplace-apps)
- Docker-based 1-click apps for DO Droplets
- Each app has a manifest (YAML) with:
  - `metadata`: name, description, version, minimum resources
  - `instructions`: user-visible setup guide
  - `services`: container definitions with ports, volumes, env vars
- Uses Docker Compose format

**Relevant 1-Click Apps for CLI**:

| App | Category | CLI Relevance | Priority |
|-----|----------|---------------|----------|
| Docker WordPress | CMS | Direct | High |
| Docker PostgreSQL | Database | Direct | High |
| Docker Redis | Cache | Direct | High |
| Docker LAMP Stack | Web | Reference pattern | Medium |
| Docker Node.js | Runtime | Reference pattern | Medium |
| Docker Django | Framework | Reference pattern | Low |
| Docker MongoDB | Database | Direct (NoSQL tier) | Medium |
| Docker Elasticsearch | Search | Search tier | Low |
| Docker Grafana | Monitoring | Observability | Low |
| Docker Adminer | DB Admin | Tooling add-on | Low |

#### doctl / Apps Platform
- DigitalOcean App Platform uses YAML-based `app.yaml` specs
- Components: services (stateless), workers (background), databases (managed)
- Each component has: `dockerfile_path`, `run_command`, `env_vars`, `routes`
- Auto-scaling and health checks built in

**Extractable patterns for CLI**:
1. YAML manifest with resource minimums → CLI tier validation
2. Component-based architecture → CLI service grouping
3. Managed database integration → CLI DBaaS hooks
4. Route/ingress definitions → CLI gateway routing

## Template Pattern Extraction — What CLI Should Adopt

### Universal Template Schema
Based on both platforms, a CLI container template should define:

```yaml
# cli-template.yaml
name: template-name
version: 1.0.0
category: database | runtime | tool | ai-ml | web
description: One-line description
icon: url-or-emoji

container:
  image: docker-image-reference
  ports:
    - container_port: 5432
      protocol: tcp
      expose: public | private
  volumes:
    - mount_path: /data
      size_gb: 10
      persistent: true
  environment:
    - key: ADMIN_PASSWORD
      label: Admin Password
      type: password
      required: true
      secret: true
    - key: MAX_CONNECTIONS
      label: Max Connections
      type: number
      default: 100
      required: false

tiers:
  - name: Starter
    resources: { cpu: 2, ram_gb: 4, storage_gb: 20 }
    gpu: false
  - name: Standard
    resources: { cpu: 4, ram_gb: 8, storage_gb: 50 }
    gpu: false

health_check:
  interval_seconds: 30
  timeout_seconds: 10
  retries: 3
  http_get: { path: /health, port: 5432 }
  # OR
  tcp_socket: { port: 5432 }

startup:
  command: ["postgres", "-c", "config_file=/etc/postgresql.conf"]
  readiness_wait_seconds: 30
```

### Recommended CLI Catalog Entries (from this research)

1. **WordPress** — High demand CMS. DO template provides Docker Compose with MySQL + WP. Adapt as single CLI container with managed DB backend.
2. **PostgreSQL** — Reference DO and Railway templates. Add persistent volumes, backup hooks, and connection string exposure.
3. **Redis** — Simple stateful container. Railway pattern is cleanest.
4. **MongoDB** — DO has solid Docker Compose template. Adapt for CLI.
5. **Grafana** — Observability add-on. Both platforms have good templates.
6. **Ghost CMS** — Node.js blog platform. Railway template is well-maintained.

### Implementation Priority
1. **Phase 1** (immediate): PostgreSQL, Redis, Qdrant (already spec'd)
2. **Phase 2** (next): WordPress, MongoDB, Ghost
3. **Phase 3** (later): Elasticsearch, Meilisearch, Grafana, Uptime Kuma

## Action Items
- [ ] Create `cli-template.yaml` schema as canonical template definition format
- [ ] Build PostgreSQL container spec using DO + Railway patterns
- [ ] Build Redis container spec using Railway pattern
- [ ] Build WordPress container spec using DO marketplace pattern
- [ ] Create template validation tool (check schema, Dockerfile, health check)
