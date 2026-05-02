# CLI — First-Time User Welcome / Onboarding Mode

Author: Clide | Date: 2026-05-02
Task ID: 6632b82e-c272-4814-94f0-885b1997ff7f
Scope: UX specification for the first-time user experience in the CLI app (app.cli.cloud)
Audience: Savage (review), developers (implementation reference)

---

## 1. Problem Statement

Gio identified a concrete UX gap during live product review: "a welcome mode for first time reviewers" pointing out key features. New users land on app.cli.cloud and see a blank dashboard or immediate deploy screen with no context. There is no guided introduction to what CLI is, what they can do, or where to start. This creates a high bounce risk for first-time visitors who don't immediately understand the value.

The onboarding mode should:
- Activate only for first-time users (detected via account age or explicit flag)
- Complete in under 90 seconds
- End with the user having deployed their first container or at minimum having selected a template
- Be dismissible at any point (skip link always visible)
- Never show again after completion or explicit dismissal

---

## 2. User Flows

### Flow A: New User — Guided Onboarding (Primary)

```
Landing page → "Start Deploying" CTA → App loads →
  Onboarding overlay activates →
    Step 1: Welcome splash ("Welcome to CLI. Deploy anything in seconds.")
    Step 2: Feature spotlight — Container Catalog ("Pick a template. We handle the rest.")
    Step 3: Interactive deploy — User selects a template (recommended: Static HTML for speed)
    Step 4: Deploy in progress — Show live status ("Your site is deploying...")
    Step 5: Success — Live URL displayed ("Your site is live at xyz.cli.cloud")
    Step 6: Next steps — "What would you like to do next?" (Deploy another, Configure, Explore dashboard)
  → Onboarding complete, flag set, normal app state
```

### Flow B: New User — Skip Onboarding

```
Landing page → "Start Deploying" CTA → App loads →
  Onboarding overlay activates →
    User clicks "Skip" at any step →
  → Onboarding dismissed, flag set, normal app state
```

### Flow C: Returning User — No Onboarding

```
App loads → Onboarding flag already set →
  Normal dashboard displayed, no overlay
```

### Flow D: Reactivation (Optional — Future)

```
Settings → "Restart onboarding" toggle →
  Clears flag → Onboarding activates on next load
```

---

## 3. Step-by-Step Component Breakdown

### Step 1: Welcome Splash

Component: `OnboardingWelcome`

Layout:
- Full-screen overlay with dark semi-transparent backdrop (bg-black/60)
- Centered card (max-width 480px)
- CLI logo (animated fade-in, 200ms delay)
- Headline: "Welcome to CLI"
- Subheadline: "Deploy containers in seconds. No telemetry. No lock-in."
- Two buttons: "Get Started" (primary, CLI orange) and "Skip for now" (ghost button, bottom right)
- Footer text: "Takes about 60 seconds"

States:
- Entry: backdrop fades in (150ms), card slides up + fades in (200ms)
- Exit on "Get Started": card slides up + fades out (150ms), step 2 slides in
- Exit on "Skip": card fades out (200ms), overlay dismissed, flag set

### Step 2: Feature Spotlight — Container Catalog

Component: `OnboardingCatalogSpotlight`

Layout:
- Semi-transparent overlay, but the catalog grid is highlighted/visible beneath
- Tooltip-style callout pointing to the catalog section
- Text: "Pick a template to deploy. We have starters for web apps, APIs, bots, and more."
- Spotlight effect: the catalog area is bright, everything else is dimmed
- "Got it, let's deploy" button → transitions to Step 3
- Skip link visible

States:
- Entry: spotlight mask animates in (300ms, radial gradient from catalog area)
- Exit: mask fades out as Step 3 overlay takes over

### Step 3: Interactive Deploy — Template Selection

Component: `OnboardingTemplateSelect`

Layout:
- Overlay with the 6 catalog cards visible (from container-catalog-spec.md)
- One card is highlighted as "Recommended for your first deploy" — Static HTML (Simple Site)
- User clicks any card → selection confirmed with checkmark animation
- "Deploy this" button activates after selection
- Skip link visible

States:
- No selection: all cards active, "Deploy this" button disabled
- Card hovered: card lifts with subtle shadow
- Card selected: checkmark overlay, orange border, other cards dim slightly
- "Deploy this" clicked: loading state on button, transitions to Step 4

### Step 4: Deploy In Progress

Component: `OnboardingDeployProgress`

Layout:
- Centered card showing deployment status
- Animated progress indicator (spinner or progress bar)
- Status text cycling through: "Preparing container..." → "Building..." → "Starting..." → "Running health check..."
- If deploy succeeds: auto-transitions to Step 5 after 500ms delay
- If deploy fails: show error state with "Try again" and "Skip" buttons
- Skip link visible

States:
- In progress: spinner active, status text updating
- Success: green checkmark animation, auto-transition
- Failure: error icon, retry options

### Step 5: Deploy Success — Live URL

Component: `OnboardingDeploySuccess`

Layout:
- Centered card with success state
- Green success icon
- Headline: "Your site is live"
- Live URL displayed in a code-style box: `https://your-project.cli.cloud`
- Copy URL button (copies to clipboard)
- "Open in new tab" link
- "Continue" button → transitions to Step 6

States:
- Entry: success icon scales in (spring animation), URL fades in
- Copy clicked: button text changes to "Copied!" for 2 seconds

### Step 6: Next Steps

Component: `OnboardingNextSteps`

Layout:
- Three option cards in a row:
  1. "Deploy another" — icon: plus circle — returns to catalog
  2. "Configure your project" — icon: settings — goes to project settings
  3. "Explore the dashboard" — icon: layout — goes to main dashboard
- "Finish onboarding" button at bottom
- No skip link needed (this is the final step)

States:
- Card hover: lift + shadow
- Card clicked: navigates to destination, onboarding flag set to complete
- "Finish" clicked: dismisses overlay, goes to main dashboard

---

## 4. State Management

### Onboarding State Shape

```typescript
interface OnboardingState {
  isActive: boolean;
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  selectedTemplateId: string | null;
  deployStatus: 'idle' | 'deploying' | 'success' | 'failure';
  deployedProjectUrl: string | null;
  isCompleted: boolean;
  isSkipped: boolean;
}
```

### Persistence

- `isCompleted` and `isSkipped` stored server-side on user account (not localStorage)
- On app load, fetch user profile → check `onboardingCompleted` flag
- If flag is false and account age < 24h (or flag is null for existing users), activate onboarding
- On flag set, never show again unless user manually resets in settings

### Transition Logic

```
Step 1 → Get Started → Step 2
Step 1 → Skip → End (flag: skipped)
Step 2 → Got it → Step 3
Step 2 → Skip → End (flag: skipped)
Step 3 → Select template → Deploy this → Step 4
Step 3 → Skip → End (flag: skipped)
Step 4 → Deploy success → Step 5
Step 4 → Deploy failure → Retry or Skip
Step 4 → Skip → End (flag: skipped)
Step 5 → Continue → Step 6
Step 6 → Choose option or Finish → End (flag: completed)
```

---

## 5. Animation Specification

All animations use `prefers-reduced-motion` checks. If reduced motion is preferred:
- Skip all slide/fade transitions (instant state change)
- Skip spotlight mask animation (show full overlay instead)
- Skip progress spinner (show static progress text)

| Element | Animation | Duration | Easing |
|---|---|---|---|
| Overlay backdrop | Fade in | 150ms | ease-out |
| Welcome card | Slide up + fade in | 200ms | ease-out |
| Step transitions | Slide left/right (directional) | 200ms | ease-in-out |
| Spotlight mask | Radial gradient expand | 300ms | ease-out |
| Card selection | Scale to 1.02 + border | 150ms | spring |
| Checkmark icon | Scale in from 0 | 200ms | spring |
| Success icon | Scale in from 0 | 300ms | spring |
| Copy confirmation | Opacity pulse | 200ms | ease-out |

---

## 6. Edge Cases

- **Deploy fails during onboarding**: Show error state. Offer retry (re-attempts deploy) or skip (dismisses onboarding, flag set to skipped). Don't block the user.
- **User closes browser mid-onboarding**: Next load resumes from Step 1. Don't persist mid-flow state — it's simpler and the flow is short enough.
- **User navigates away via browser back**: Dismiss onboarding, set flag to skipped.
- **Mobile layout**: Stack option cards vertically in Step 6. Ensure catalog cards in Step 3 are scrollable on small screens. All touch targets minimum 44px.
- **Existing users who never saw onboarding**: Check for `onboardingCompleted: null` (not false). If null and account exists, show a lightweight "What's new" variant or skip entirely. Don't force onboarding on existing users.
- **No templates available (backend down)**: Show "Setup is almost complete" message instead of Step 3-5, skip directly to Step 6 with dashboard exploration option.

---

## 7. File Structure (Monorepo Placement)

```
apps/web/
  src/
    components/
      onboarding/
        onboarding-provider.tsx       # Context provider, state management
        onboarding-overlay.tsx        # Backdrop + step container
        steps/
          onboarding-welcome.tsx       # Step 1
          onboarding-catalog-spotlight.tsx  # Step 2
          onboarding-template-select.tsx    # Step 3
          onboarding-deploy-progress.tsx    # Step 4
          onboarding-deploy-success.tsx     # Step 5
          onboarding-next-steps.tsx         # Step 6
        hooks/
          use-onboarding.ts           # Hook for accessing onboarding state
          use-reduced-motion.ts       # Animation preference check
    app/
      (dashboard)/
        layout.tsx                    # Check onboarding flag here
```

---

## 8. API Requirements

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/user/onboarding` | GET | Fetch onboarding state (completed, skipped, null) |
| `/api/user/onboarding` | PATCH | Update onboarding state (set completed or skipped) |
| `/api/deploy` | POST | Trigger deploy (used in Step 4) — existing endpoint |

No new API endpoints needed beyond the onboarding state read/write.

---

## 9. Success Metrics

- Onboarding completion rate > 60% (users who reach Step 6)
- First deploy rate > 40% (users who successfully deploy in Step 5)
- Skip rate < 30% (users who dismiss without completing)
- Time to complete < 90 seconds (median)
- Post-onboarding engagement: users who complete onboarding deploy a second project within 7 days at 2x the rate of users who skip

---

## 10. Dependencies

- Container catalog API must return available templates (Step 3)
- Deploy API must be functional for the selected template (Step 4)
- User authentication must be working (to persist onboarding flag)
- app.cli.cloud frontend must be on the CLI monorepo stack (Next.js + React + Tailwind)

---

Savage to review and comment. Once approved, this feeds into the deploy dialog implementation (item 5) and the visual polish recommendations (item 7).
