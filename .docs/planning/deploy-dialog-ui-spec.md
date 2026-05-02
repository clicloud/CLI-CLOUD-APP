# CLI — Deploy Dialog UI Component Specification

Author: Clide | Date: 2026-05-02
Task ID: f94cd3df-f14d-4387-b85d-304eac9c5ac3
Scope: React component specification for the "Start Deploying" flow
Stack: React 19, TypeScript, Tailwind v4, shadcn/ui, Framer Motion
Monorepo target: apps/web/src/components/deploy/

---

## 1. Overview

The deploy dialog is the primary conversion surface in the CLI app. It presents the container catalog (6 templates), collects project name and optional env vars, triggers deployment, and shows the result with a live URL.

This spec covers the full component tree, state machine, props interface, and implementation details. Ready for a developer to build directly from this document.

---

## 2. State Machine

```
[SELECT] → user picks template → [CONFIGURE] → user enters name + env vars →
[DEPLOYING] → API call in progress → [SUCCESS] (live URL) or [FAILURE] (retry)

Any state → Cancel → Close dialog (no deploy)
FAILURE → Retry → [CONFIGURE] (pre-filled)
SUCCESS → Close → Navigate to project dashboard
```

States:
- `select` — Template grid visible, no template chosen
- `configure` — Template chosen, config form visible
- `deploying` — Deploy API call in progress
- `success` — Deploy complete, live URL displayed
- `failure` — Deploy failed, error message + retry

---

## 3. Component Tree

```
<DeployDialog>
  <DeployDialogHeader />        // Title, subtitle, close button
  <DeployDialogBody>
    <TemplateGrid />             // Step: SELECT
    <DeployConfigForm />         // Step: CONFIGURE
    <DeployProgress />           // Step: DEPLOYING
    <DeploySuccess />            // Step: SUCCESS
    <DeployFailure />            // Step: FAILURE
  </DeployDialogBody>
  <DeployDialogFooter />        // Back, Deploy, Cancel buttons
</DeployDialog>
```

---

## 4. Component Specifications

### 4.1 DeployDialog (Root)

```typescript
interface DeployDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTemplateId?: string;  // Pre-select a template (for onboarding)
  onComplete?: (projectId: string, url: string) => void;
}
```

Layout:
- shadcn Dialog component, max-width 720px
- Dark theme consistent with app.cli.cloud
- Step indicator at top (dots: select → configure → deploy → done)

Behavior:
- Manages `DeployState` via React state
- On close during `deploying` state: show confirmation ("Deploy in progress. Cancel?")
- On `onOpenChange(false)`: reset state to `select`

### 4.2 TemplateGrid

```typescript
interface TemplateGridProps {
  templates: CatalogTemplate[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}
```

Layout:
- 2x3 grid on desktop, 1-column on mobile (scrollable)
- Each card: 220px wide, 160px tall
- Card content: icon (48px), template name (UI label), stack tag, one-line description
- "Recommended" badge on Static HTML (for new users)

Template data (from container-catalog-spec.md):

| ID | UI Label | Stack Tag | Description |
|---|---|---|---|
| web-app | Web App | Next.js | Full-stack React framework with SSR and API routes |
| ai-backend | AI Backend | FastAPI | Python API for AI/LLM applications |
| chat-bot | Chat Bot | Python | Telegram bot that responds to messages |
| simple-site | Simple Site | Static HTML | The fastest deploy. One HTML file, live in seconds |
| api-server | API Server | Express.js | Node.js API with one endpoint for backend services |
| openclaw | OpenClaw | Custom | Pre-configured self-hosted application container |

Visual states per card:
- Default: dark card (#1c1c1c) with border (#2a2a2a)
- Hover: border becomes CLI orange (#EA5600), subtle lift (translateY -2px)
- Selected: orange border, orange glow shadow, checkmark overlay (top-right)
- Recommended: "Recommended" badge (orange text, no fill)

### 4.3 DeployConfigForm

```typescript
interface DeployConfigFormProps {
  template: CatalogTemplate;
  onDeploy: (config: DeployConfig) => void;
  onBack: () => void;
}
```

Layout:
- Selected template summary at top (icon + name + description, smaller)
- Project name input:
  - Label: "Project name"
  - Placeholder: "my-awesome-project"
  - Validation: lowercase alphanumeric + hyphens, 3-30 chars, unique per user
  - Live validation with error messages
  - Slug preview: "Your project will be live at: {name}.cli.cloud"
- Environment variables (optional, collapsible):
  - "Add environment variables" toggle
  - When expanded: key-value pair rows with add/remove buttons
  - Suggested env vars from template spec pre-populated (e.g., BOT_TOKEN for Chat Bot)
  - Values masked by default (password field type)
- "Deploy" button (primary, CLI orange)
- "Back" button (ghost, returns to template grid)
- "Cancel" link

Validation rules:
- Project name required, validated on blur and on submit
- Env var keys must be uppercase, alphanumeric + underscores
- No duplicate env var keys

### 4.4 DeployProgress

```typescript
interface DeployProgressProps {
  status: 'preparing' | 'building' | 'starting' | 'health-check';
  progress: number;  // 0-100
}
```

Layout:
- Centered progress indicator (circular spinner or progress bar)
- Status text updating through stages:
  1. "Preparing container..." (0-25%)
  2. "Building from template..." (25-60%)
  3. "Starting application..." (60-85%)
  4. "Running health check..." (85-100%)
- Animated status transitions (fade out old text, fade in new text)
- No cancel during this state (deploy is committed)
- Footer: "This usually takes under 60 seconds"

### 4.5 DeploySuccess

```typescript
interface DeploySuccessProps {
  projectName: string;
  projectUrl: string;
  onOpenProject: () => void;
  onClose: () => void;
}
```

Layout:
- Green success icon (animated scale-in)
- Headline: "Your project is live"
- Project name displayed
- URL in code box: `https://{name}.cli.cloud`
  - Copy button (copies to clipboard, shows "Copied!" for 2s)
  - "Open in new tab" link (external icon)
- Two action buttons:
  1. "Go to project" (primary) — navigates to project dashboard
  2. "Deploy another" (secondary) — resets to select state
- Close button

### 4.6 DeployFailure

```typescript
interface DeployFailureProps {
  error: string;
  onRetry: () => void;
  onChangeConfig: () => void;
}
```

Layout:
- Error icon (red)
- Headline: "Deployment failed"
- Error message from API (user-friendly, not raw stack trace)
- Two action buttons:
  1. "Try again" (primary) — re-attempts deploy with same config
  2. "Change settings" (secondary) — returns to configure state
- Close button (dismisses dialog)

---

## 5. API Integration

### Trigger Deploy

```typescript
POST /api/deploy
Body: {
  templateId: string;
  projectName: string;
  envVars?: Record<string, string>;
}
Response (success): {
  projectId: string;
  url: string;
  status: 'deploying';
}
Response (error): {
  error: string;
  code: 'NAME_TAKEN' | 'TEMPLATE_UNAVAILABLE' | 'DEPLOY_FAILED';
}
```

### Check Deploy Status (polling)

```typescript
GET /api/deploy/{projectId}/status
Response: {
  status: 'deploying' | 'running' | 'failed';
  progress: number;
  url?: string;
  error?: string;
}
```

Poll interval: 2 seconds. Stop polling when status is `running` or `failed`.

---

## 6. Accessibility

- Dialog uses shadcn Dialog (built on Radix) — focus trap, escape key, aria-modal all handled
- Template cards are buttons (keyboard navigable, focus ring)
- Form inputs have associated labels and error messages (aria-describedby)
- Progress status announced via aria-live region
- Success/failure states announced via aria-live
- All interactive elements have minimum 44px touch targets on mobile

---

## 7. Responsive Behavior

| Breakpoint | Grid | Card Size | Form Layout |
|---|---|---|---|
| Desktop (>= 768px) | 3 columns | 220px wide | Full width inputs |
| Tablet (>= 640px) | 2 columns | Full width | Full width inputs |
| Mobile (< 640px) | 1 column | Full width | Stacked, env vars below |

Dialog width: max-w-2xl on desktop, full screen on mobile (< 640px).

---

## 8. File Structure

```
apps/web/src/components/deploy/
  deploy-dialog.tsx              # Root dialog + state machine
  template-grid.tsx              # Catalog card grid
  template-card.tsx              # Individual template card
  deploy-config-form.tsx         # Project name + env vars form
  deploy-progress.tsx            # Deploying state with status polling
  deploy-success.tsx             # Success state with live URL
  deploy-failure.tsx             # Failure state with retry
  deploy-types.ts                # Shared TypeScript interfaces
  use-deploy.ts                  # Hook: deploy API call + status polling
```

---

## 9. Animation Notes

- Card hover: `transition-all duration-150 ease-out`
- Card selection: checkmark scales in from 0 (spring, 200ms)
- Progress spinner: standard Tailwind animate-spin
- Status text: crossfade (opacity 0→1, 200ms)
- Success icon: scale from 0.5 to 1 (spring, 300ms)
- All animations respect `prefers-reduced-motion: reduce`

---

Savage to review and comment. This spec is buildable as-is by any React developer familiar with shadcn/ui and Tailwind.
Cross-references: container-catalog-spec.md (template data), welcome-onboarding-mode-spec.md (Step 3-5 integration)
