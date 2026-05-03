# Cosign Container Signing Integration Spec — CLI Build Pipeline

## Overview
Cosign (from Sigstore) provides keyless and key-based container image signing. Integrating cosign into CLI's container build pipeline adds image attestation and verification as a security differentiator — users can verify that containers running on CLI were built from trusted source.

## What Cosign Does
- Signs container images with cryptographic signatures stored in the OCI registry
- Supports keyless signing via OIDC identity (GitHub Actions, Google, Microsoft)
- Generates SBOM (Software Bill of Materials) attestations
- Verifies signatures before container execution
- Works with any OCI-compliant registry

## Integration Architecture

### Build-Time Signing Flow
```
Source Commit → Build Image → Push to Registry → Sign with Cosign → Attest SBOM → Mark Verified
```

1. Developer pushes code to CLI monorepo
2. CI pipeline builds container image
3. Image pushed to `registry.cli.cloud` (or ghcr.io/clicloud)
4. Cosign signs image using keyless OIDC (GitHub Actions identity)
5. Cosign attaches SBOM attestation
6. Signature and attestation stored alongside image in registry
7. Image marked as `verified` in CLI catalog metadata

### Deploy-Time Verification Flow
```
User Deploys Container → CLI Pulls Image → Verify Signature → Allow/Block Deploy
```

1. User selects template and clicks deploy
2. CLI pulls the container image from registry
3. Before starting container, CLI verifies cosign signature
4. If signature valid: container starts normally
5. If signature invalid or missing: deploy blocked with clear error message
6. Verification result logged and visible in CLI dashboard

## Cosign Commands Reference

### Signing (CI Pipeline)
```bash
# Keyless signing via GitHub Actions OIDC
cosign sign --yes registry.cli.cloud/clicloud/comfyui:latest

# Sign with specific key
cosign sign --key cosign.key registry.cli.cloud/clicloud/comfyui:latest

# Attach SBOM attestation
cosign attest --yes \
  --predicate sbom.spdx.json \
  --type spdxjson \
  registry.cli.cloud/clicloud/comfyui:latest

# Attach build provenance
cosign attest --yes \
  --predicate provenance.json \
  --type slsaprovenance \
  registry.cli.cloud/clicloud/comfyui:latest
```

### Verification (Deploy Time)
```bash
# Verify signature (keyless — checks against OIDC issuer)
cosign verify \
  --certificate-identity-regexp="^https://github.com/clicloud/" \
  --certificate-oidc-issuer="https://token.actions.githubusercontent.com" \
  registry.cli.cloud/clicloud/comfyui:latest

# Verify SBOM attestation
cosign verify-attestation \
  --type spdxjson \
  --certificate-identity-regexp="^https://github.com/clicloud/" \
  --certificate-oidc-issuer="https://token.actions.githubusercontent.com" \
  registry.cli.cloud/clicloud/comfyui:latest
```

## CI Pipeline Integration (GitHub Actions)

```yaml
name: Build and Sign Container
on:
  push:
    branches: [main]
    paths: ['containers/comfyui/**']

jobs:
  build-sign:
    runs-on: ubuntu-latest
    permissions:
      id-token: write    # Required for keyless signing
      packages: write    # Push to ghcr.io

    steps:
      - uses: actions/checkout@v4

      - name: Login to Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and Push
        uses: docker/build-push-action@v5
        with:
          context: ./containers/comfyui
          push: true
          tags: |
            ghcr.io/clicloud/comfyui:latest
            ghcr.io/clicloud/comfyui:${{ github.sha }}

      - name: Install Cosign
        uses: sigstore/cosign-installer@v3

      - name: Sign Image (Keyless)
        run: |
          cosign sign --yes ghcr.io/clicloud/comfyui:latest
          cosign sign --yes ghcr.io/clicloud/comfyui:${{ github.sha }}

      - name: Generate SBOM
        uses: anchore/sbom-action@v0
        with:
          image: ghcr.io/clicloud/comfyui:latest
          output-file: sbom.spdx.json

      - name: Attach SBOM Attestation
        run: |
          cosign attest --yes \
            --predicate sbom.spdx.json \
            --type spdxjson \
            ghcr.io/clicloud/comfyui:latest
```

## CLI Platform Changes Required

### 1. Container Metadata Schema
Add signing fields to the container catalog metadata:
```yaml
security:
  signing:
    enabled: true
    issuer: "https://token.actions.githubusercontent.com"
    identity_pattern: "^https://github.com/clicloud/"
    require_verified: true  # Block deploy if unsigned
  attestations:
    - type: spdxjson  # SBOM
    - type: slsaprovenance  # Build provenance
```

### 2. Deploy-Time Verification Hook
Before container start, CLI orchestrator runs:
```python
def verify_container_image(image_ref: str, security_config: dict) -> bool:
    """Verify cosign signature before allowing deploy."""
    result = subprocess.run([
        "cosign", "verify",
        "--certificate-identity-regexp", security_config["identity_pattern"],
        "--certificate-oidc-issuer", security_config["issuer"],
        image_ref
    ], capture_output=True, text=True)
    return result.returncode == 0
```

### 3. Dashboard UI
- Container detail page shows "Verified" badge with signature details
- Clicking badge reveals: signer identity, timestamp, SBOM contents
- Unsigned containers show "Unverified" warning

### 4. User-Facing Verification (Optional)
Advanced users can verify images themselves:
```bash
cosign verify \
  --certificate-identity-regexp="^https://github.com/clicloud/" \
  --certificate-oidc-issuer="https://token.actions.githubusercontent.com" \
  ghcr.io/clicloud/comfyui:latest
```

## Security Differentiators
1. **Every CLI container is signed** — no unsigned images in production
2. **SBOM attestation** — full software bill of materials for every image
3. **Build provenance** — cryptographic proof of where/when/how image was built
4. **Keyless signing** — no key management burden, tied to CI identity
5. **Deploy-time enforcement** — blocked deploys for tampered images

## Competitive Positioning
- Railway: no container signing
- DigitalOcean: no container signing
- Fly.io: no container signing
- CLI: first platform with mandatory signed containers and SBOM attestations

This is a genuine security differentiator for enterprise and compliance-sensitive customers.

## Implementation Estimate
- CI pipeline setup: 2-4 hours per container template
- CLI verification hook: 4-8 hours
- Dashboard UI changes: 8-16 hours
- Total: ~2-3 days for full integration across existing templates

## Dependencies
- Cosign CLI installed in CI runners
- Cosign CLI installed on CLI deploy nodes
- GitHub Actions OIDC identity configured
- Registry must support OCI referrers (GHCR does)
