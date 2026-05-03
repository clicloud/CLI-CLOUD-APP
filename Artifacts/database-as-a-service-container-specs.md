# Database-as-a-Service Container Specs — CLI Catalog

## Overview
Three database container templates for CLI: PostgreSQL (relational), Redis (cache/broker), and Qdrant (vector DB). Each follows the same structural pattern: container image, resource tiers, persistent storage, connection exposure, backup approach, and deploy dialog UI.

---

## 1. PostgreSQL

### Container Image
- **Base**: `postgres:16-alpine`
- **Exposed ports**: 5432 (PostgreSQL wire protocol)
- **Variants**: `postgres:16-alpine` (default), `postgres:16-bookworm` (full glibc)

### Resource Tiers

| Tier | RAM | vCPU | Storage | Max Connections | Price Target |
|------|-----|------|---------|-----------------|-------------|
| Nano | 1GB | 1 | 10GB SSD | 50 | Cheapest |
| Starter | 4GB | 2 | 25GB SSD | 200 | Entry |
| Standard | 16GB | 4 | 100GB SSD | 500 | Mid |
| Pro | 64GB | 8 | 500GB SSD | 1000 | High |
| Enterprise | 128GB | 16 | 1TB SSD | 2000+ | Enterprise |

### Configuration
- Default database: `cli_default`
- Default user: auto-generated (`cli_user_{random}`)
- Password: auto-generated (32-char alphanumeric)
- Superuser access: disabled by default (optional toggle for admin)
- `shared_buffers` auto-tuned to 25% of tier RAM
- `max_connections` set per tier
- `wal_level = replica` enabled for backup support
- SSL enabled by default (`ssl = on`)

### Connection String Exposure
```
postgresql://cli_user_abc123:{password}@{container-host}.cli.cloud:5432/cli_default
```
- Connection string visible in CLI dashboard under container details
- Available via CLI API: `GET /containers/{id}/connection`
- Internal DNS: `{container-name}.internal.cli.cloud` for inter-container networking

### Backup Approach
- **Continuous WAL archiving** to CLI-managed object storage
- **Daily base backup** at 02:00 UTC (configurable)
- **Point-in-time recovery** available (up to 7 days on Standard+, 30 days on Pro+)
- Manual snapshot trigger via dashboard or API
- Backup restoration: new container from snapshot or in-place restore

### Deploy Dialog UI

| Field | Label | Type | Default | Required |
|-------|-------|------|---------|----------|
| tier | Resource Tier | dropdown | Starter | yes |
| db_name | Database Name | text | cli_default | yes |
| version | PostgreSQL Version | dropdown | 16 | yes |
| ssl_mode | SSL Required | toggle | true | no |
| superuser | Enable Superuser Access | toggle | false | no |
| backup_schedule | Backup Time (UTC) | time | 02:00 | no |
| persist_storage | Persistent Storage | toggle | true | no |

---

## 2. Redis

### Container Image
- **Base**: `redis:7-alpine`
- **Exposed ports**: 6379 (Redis protocol)
- **Variants**: `redis:7-alpine` (default), `redis:7-alpine` with RedisSearch module

### Resource Tiers

| Tier | RAM | vCPU | Storage | Max Memory Policy | Price Target |
|------|-----|------|---------|-------------------|-------------|
| Nano | 512MB | 1 | 5GB SSD | allkeys-lru | Cheapest |
| Starter | 2GB | 1 | 10GB SSD | allkeys-lru | Entry |
| Standard | 8GB | 2 | 25GB SSD | noeviction | Mid |
| Pro | 32GB | 4 | 100GB SSD | noeviction | High |
| Enterprise | 128GB | 8 | 250GB SSD | noeviction | Enterprise |

### Configuration
- `requirepass` set to auto-generated password
- `maxmemory` set to 90% of tier RAM
- `maxmemory-policy` set per tier (LRU for small, noeviction for large)
- `appendonly yes` for persistence
- `appendfsync everysec` for balance of durability/performance
- TLS supported via `redis_tls` mode (port 6380)

### Connection String Exposure
```
redis://cli_user_abc123:{password}@{container-host}.cli.cloud:6379
rediss://cli_user_abc123:{password}@{container-host}.cli.cloud:6380  # TLS
```

### Backup Approach
- **AOF persistence** (append-only file) on persistent volume
- **RDB snapshot** every 15 minutes (configurable)
- Manual `SAVE`/`BGSAVE` via CLI API
- Cross-region replication available on Pro+ tiers

### Deploy Dialog UI

| Field | Label | Type | Default | Required |
|-------|-------|------|---------|----------|
| tier | Resource Tier | dropdown | Starter | yes |
| version | Redis Version | dropdown | 7 | yes |
| tls | Enable TLS | toggle | false | no |
| modules | Additional Modules | multi-select | none | no |
| persist_storage | Persistent Storage | toggle | true | no |

---

## 3. Qdrant

### Container Image
- **Base**: `qdrant/qdrant:latest`
- **Exposed ports**: 6333 (REST API), 6334 (gRPC)
- **GPU optional**: enables faster vector search on GPU tiers

### Resource Tiers

| Tier | RAM | vCPU | Storage | GPU | Vectors Est. | Price Target |
|------|-----|------|---------|-----|-------------|-------------|
| Nano | 2GB | 1 | 10GB SSD | — | ~100K (768d) | Cheapest |
| Starter | 8GB | 2 | 25GB SSD | — | ~1M (768d) | Entry |
| Standard | 32GB | 4 | 100GB SSD | — | ~5M (768d) | Mid |
| Pro | 64GB | 8 | 250GB SSD | 1x T4 | ~20M (768d) | High |
| Enterprise | 128GB | 16 | 500GB SSD | 1x A10G | ~50M+ (768d) | Enterprise |

### Configuration
- Default collection auto-created: `cli_default` (cosine similarity, 768d vectors)
- Storage path: `/qdrant/storage` on persistent volume
- Snapshot path: `/qdrant/snapshots`
- API key enabled by default
- CORS enabled for CLI dashboard access

### Connection String Exposure
```
# REST API
https://{container-host}.cli.cloud:6333
Header: api-key: {auto-generated-key}

# gRPC
{container-host}.cli.cloud:6334
```

### Backup Approach
- **Snapshot API**: `POST /collections/{name}/snapshots`
- Scheduled snapshots every 6 hours (configurable)
- Snapshots stored on persistent volume, downloadable via CLI API
- Full collection replication available on Standard+ tiers

### Deploy Dialog UI

| Field | Label | Type | Default | Required |
|-------|-------|------|---------|----------|
| tier | Resource Tier | dropdown | Starter | yes |
| vector_size | Default Vector Size | number | 768 | yes |
| distance | Distance Metric | dropdown | cosine | yes |
| gpu_enabled | Enable GPU Acceleration | toggle | false | no |
| persist_storage | Persistent Storage | toggle | true | no |

---

## Universal Database Template Schema

All three share a common base schema that extends the generic container template:

```yaml
kind: database
spec:
  connection:
    protocol: postgres | redis | qdrant
    port: 5432 | 6379 | 6333
    credentials: auto-generated
    expose:
      - type: connection-string
        format: "{protocol}://{user}:{password}@{host}:{port}/{database}"
      - type: env-var
        name: DATABASE_URL  # or REDIS_URL, QDRANT_URL
  persistence:
    enabled: true
    path: /var/lib/postgresql/data | /data | /qdrant/storage
    backup:
      method: wal | aof | snapshot
      schedule: daily
      retention_days: 7
    restore:
      from_snapshot: optional
      point_in_time: optional (postgres only)
  monitoring:
    metrics:
      - connections
      - query_latency
      - storage_usage
      - cache_hit_ratio
    alerts:
      - connections > 80% max
      - storage > 90% capacity
      - replication_lag > 30s
```

## Next Steps
- [ ] Validate resource tier estimates against real workload benchmarks
- [ ] Build Dockerfiles for each with CLI-specific health checks
- [ ] Implement connection string auto-generation in CLI orchestrator
- [ ] Build backup scheduler service
- [ ] Create dashboard components for database monitoring
