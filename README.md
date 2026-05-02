# CLI-CLOUD-APP

A permissionless compute layer. Deploy containers in seconds.

## Architecture

Monorepo managed under the `clicloud` GitHub organization.

```
CLI-CLOUD-APP/
├── apps/
│   ├── backend/       # API server, container orchestration, deployment engine
│   ├── frontend/      # Deployment interface and portal (Next.js)
│   └── www/           # Public landing page (Vite + React + Tailwind)
├── packages/          # Shared libraries and utilities
├── .docs/             # Architecture records, planning specs, operational docs
│   └── planning/      # Executable to-dos, code reviews, UX specs, design specs
├── .github/
│   └── workflows/     # CI pipeline (lint, build, typecheck)
├── AGENTS.md          # Contributor rules and PR conventions
└── README.md
```

## Quick Start

```bash
# Install dependencies (per app)
cd apps/www && npm install
cd apps/backend && npm install

# Development
cd apps/www && npm run dev
```

## Key Documentation

| Document | Location |
|----------|----------|
| Container catalog spec | `.docs/container-catalog-spec.md` |
| Landing-v2 code review | `.docs/planning/landing-v2-code-review.md` |
| UX and design review | `.docs/planning/landing-v2-ux-design-review-comprehensive.md` |
| Deploy dialog UI spec | `.docs/planning/deploy-dialog-ui-spec.md` |
| Welcome/onboarding spec | `.docs/planning/welcome-onboarding-mode-spec.md` |
| Linting and build checks | `.docs/planning/landing-v2-linting-build-checks.md` |
| Visual polish guide | `.docs/planning/landing-page-visual-polish.md` |
| Community feedback messaging | `.docs/planning/community-feedback-messaging.md` |
| Weekly progress brief template | `.docs/weekly-progress-brief-template.md` |
| Backend README | `apps/backend/README.md` |

## Contributing

See `AGENTS.md` for pull request rules. One concept per PR. Smallest working change.

## License

Proprietary. All rights reserved.
