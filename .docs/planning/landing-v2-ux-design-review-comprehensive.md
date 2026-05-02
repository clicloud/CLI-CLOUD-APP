# Landing-v2 — Comprehensive UX & Design Review

Reviewer: Clide | Date: 2026-05-02
Repo: clicloud/Landing-v2 | Branch: main
Stack: Next.js 16.2.4, React 19.2.4, Tailwind v4, shadcn/ui, Framer Motion, Remotion 4
Scope: Full UX audit, design systems analysis, content audit, accessibility, conversion optimization, and implementation roadmap.

---

## 1. Executive Summary

Landing-v2 has a strong structural foundation: dark-only brand system with consistent tokens, 50+ shadcn UI primitives, clean component decomposition into 10 block sections, CI pipeline, and a production-quality hero with animated grid + browser chrome mock + Remotion video. The architecture is modular and ready for scaling.

Four issues block a credible public launch: (1) no container catalog section showing the core product value prop, (2) dead links throughout nav and footer, (3) a 24KB dead legacy prototype polluting the repo, and (4) an unverified "47s Avg deploy" stat. Beyond those, the page needs trust/compliance badges, accessibility work, placeholder content replacement, and typographic scale formalization before any marketing push.

This review synthesizes findings from the code audit (landing-v2-code-review.md), the linting/build checks spec (landing-v2-linting-build-checks.md), the container catalog spec (container-catalog-spec.md), and the RunPod migration research (runpod-container-migration-opportunities.md) into a single actionable document.

---

## 2. Design System Analysis

### 2.1 Color Tokens — Score: 8/10

Strengths:
- Dark-only palette is cohesive: background #0a0a0a, card #1c1c1c, border #2a2a2a, muted text #6b6b6b
- CLI orange (#EA5600) as primary accent is used consistently for CTAs, highlights, and interactive elements
- CSS custom properties in globals.css create a single source of truth

Weaknesses:
- Token duplication: globals.css defines the full set in both `:root` and `.dark`. Since CLI is dark-only, the `.dark` block is redundant and creates maintenance risk (any change must be made in two places)
- No semantic success/warning/error color tokens defined. If the deploy dialog or status screens need state colors (success = green, error = red, warning = amber), they'll be invented ad-hoc
- No elevation system — card shadows and border opacity could benefit from explicit tier tokens (elevation-1, elevation-2, etc.)

Recommendation: Consolidate to `:root` only. Add semantic state colors and elevation tokens to the theme before building the deploy dialog and container catalog components.

### 2.2 Typography — Score: 6/10

Strengths:
- Inter Tight (via next/font/google) for body, JetBrains Mono for code — both loaded with display swap
- Hero section uses responsive clamp() sizing

Weaknesses:
- No formal typographic scale. The hero uses `text-6xl md:text-7xl xl:text-[5.25rem]`, section headings use `text-4xl`, descriptions use `text-lg` — but these are hardcoded per component rather than drawn from a shared scale
- No heading hierarchy tokens in the theme (h1, h2, h3, body-lg, body, body-sm, caption)
- Line height and letter spacing are left to Tailwind defaults rather than explicitly set for the brand

Recommendation: Define a typographic scale in globals.css:
```
--text-hero: 5.25rem
--text-h1: 3rem
--text-h2: 2.25rem
--text-h3: 1.25rem
--text-body: 1rem
--text-caption: 0.875rem
```
With responsive breakpoints at md and xl. Apply consistently across all blocks.

### 2.3 Spacing & Layout — Score: 7/10

Strengths:
- Consistent max-width container pattern
- Section spacing is regular (py-20 to py-24)
- Grid layouts use Tailwind's responsive grid utilities

Weaknesses:
- Some blocks use `gap-6` for card grids, others use `gap-4` — no shared spacing token
- Mobile padding is inconsistent (px-4 in some blocks, px-6 in others)
- No documented grid system (12-col? fluid?) — blocks compose independently which is fine for now but risks drift

Recommendation: Standardize section padding to `py-24 md:py-32`, card grid gap to `gap-6`, and mobile horizontal padding to `px-6`. Document in the component structure standard.

### 2.4 Component Library — Score: 9/10

Strengths:
- 50+ shadcn/ui primitives properly installed and configured
- All primitives use the same design token layer — consistent theming
- Block components are well-decomposed: HeroSection, FeaturesSection, HowItWorksSection, ClideSection, IntegrationsSection, etc.
- One component per file, named exports, TypeScript interfaces

Weaknesses:
- Some components use default exports (from earlier shadcn patterns) — should be converted to named exports per the new convention
- No component documentation (no docz, no storybook, no inline JSDoc on props)

---

## 3. Section-by-Section UX Audit

### 3.1 Header/Nav — Score: 6/10

Current behavior: Fixed header, collapses to rounded pill with backdrop blur on scroll. Mobile hamburger menu. Links: Logo, Docs, Pricing, Clide.

Issues:
- **Dead anchor links**: Docs → `#docs`, Pricing → `#pricing`, Clide → `#clide`. None of these section IDs exist in the DOM. Clicking them scrolls nowhere.
- No active link state when scrolled to a section
- Mobile menu UX is functional but untested on varied device sizes
- No "Start Deploying" CTA in the nav — the primary conversion action is buried below the fold

Fixes:
1. Add `id` attributes to corresponding section elements: `id="features"` (or docs), `id="pricing"`, `id="clide"`
2. Add a prominent "Start Deploying" CTA button in the nav (right side, desktop; bottom of mobile menu)
3. Add scroll-spy active state on nav links

### 3.2 Hero Section — Score: 8/10

Strengths:
- Strong above-fold value proposition with animated grid background and orange glow (LampContainer)
- Browser chrome mock showing the product UI
- Remotion-generated hero video (hero-video.mp4) with autoplay
- Stats strip (47s deploy, 0 telemetry, 1 command)

Issues:
- **Unverified stat**: "47s Avg deploy" is a specific, falsifiable claim. If actual deploy time differs, this damages credibility on day one.
- Video element has no `poster` attribute, no `width`/`height`, no `preload` hint — blank black rectangle on slow connections
- No CTA variant testing structure (only one "Start deploying" button style)

Fixes:
1. Soften stat to "Under 2 min" or "Seconds, not minutes" until measured
2. Add poster frame + explicit dimensions to video element
3. Add trust/badge strip between hero and features for compliance signals

### 3.3 Features Section — Score: 5/10

Current: Three feature cards — Container Management, Resource Presets, Clide Chat. Each has an illustration, title, and description.

Critical issue: **No container catalog grid.** The core product differentiator — deployable container templates — has zero visibility. Users cannot see what they can deploy. The container-catalog-spec.md defines 6 templates (OpenClaw, Next.js, FastAPI, Static HTML, Express API, Telegram Bot) that should be visible somewhere on this page.

Additional issues:
- Compliance mentions ("SOC 2 Type II. FedRAMP Moderate.") are buried in card body copy — should be badges/strip
- Feature cards are text-heavy with no interactive preview or expandable details

Recommended redesign:
1. Replace or augment the features section with a Container Catalog grid showing the 6 deployable templates
2. Each card: template icon + name + stack tag + one-line description + "Deploy" micro-CTA
3. Add trust/compliance badge strip above or below the catalog
4. Consider a "See all templates" expansion or link to a full catalog page

### 3.4 How It Works Section — Score: 9/10

Three numbered step cards with embedded interactive visuals:
1. Select container → progress bar animation
2. Configure resources → terminal output animation
3. Deploy → detection badge animation

This is production-quality storytelling. Each step has a micro-interaction that demonstrates the product flow visually. No changes needed beyond ensuring the container names match the actual catalog.

### 3.5 Clide Section — Score: 8/10

Features a realistic chat illustration matching the actual product UI. Shows the Clide bot conversation flow. This builds trust — users can see exactly what the agent experience looks like.

Minor: The chat mock could include a deployment example to tie back to the container catalog narrative.

### 3.6 Integrations Section — Score: 8/10

Animated orbital layout showing LLM providers (OpenAI, Anthropic, Google, Meta, etc.) orbiting around CLI at center. Strong visual hierarchy.

Minor: Could add a "Coming Soon" or "In Development" badge for planned integrations to show roadmap momentum.

### 3.7 Testimonials Section — Needs Content Audit

Testimonials exist but content was not fully visible in the reviewed files. Risk: if these contain placeholder quotes, they damage credibility.

Action: Audit all testimonial content. Replace placeholders with real beta user quotes or remove the section entirely.

### 3.8 FAQ Section — Needs Content Audit

Accordion-style FAQ. Same risk as testimonials.

Action: Verify content accuracy. Replace placeholder questions with real ones from user research or the most common questions from the dev hangout community.

### 3.9 CTA Section — Score: 7/10

Standard bottom CTA with "Start Deploying" button. Functional but generic.

Enhancement: Add a secondary CTA option — "Talk to Clide" or "See what you can deploy" to give users a lower-commitment entry point.

### 3.10 Footer — Score: 4/10

Issues:
- **All social links are `#`**: GitHub, Discord, Twitter → dead
- No legal links (Privacy, Terms)
- No copyright year
- Minimal structure

Fixes: Wire social links to real URLs. Add legal links. Add copyright. This is a launch blocker.

---

## 4. Content Audit

### Verified Good
- Product tagline and value props in hero, features, and CTA sections
- How It Works step descriptions
- Clide chat dialogue
- Integration provider names

### Needs Verification
- Stats strip numbers (47s, 0 telemetry, 1 command)
- Testimonial quotes and attributions
- FAQ questions and answers
- Feature card descriptions (especially compliance claims)

### Needs Replacement
- content-reference.jsx — 24KB dead file containing an entirely separate landing page implementation with a different brand palette (blue/purple gradients, DM Sans font, inline styles). Not imported anywhere. Delete from repo.

---

## 5. Accessibility Audit

### Passing
- Semantic HTML structure (header, nav, main, sections, footer)
- Proper heading hierarchy in most blocks
- Button elements for CTAs (not divs)
- Video has autoplay + muted + playsInline attributes

### Failing
- No skip-to-content link in layout
- No `prefers-reduced-motion` handling — Framer Motion animations, CSS keyframes, and the animated grid all fire regardless of user preference
- No `aria-label` on all interactive elements (some sections lack them)
- Video has no transcript or audio description
- Color contrast: verify all text colors against WCAG AA minimums (muted text #6b6b6b on background #0a0a0a passes, but verify all card text combinations)

Required fixes:
1. Add visually-hidden skip link in layout.tsx
2. Wrap Framer Motion animations in `useReducedMotion()` check
3. Add `@media (prefers-reduced-motion: reduce)` in globals.css to disable keyframes
4. Add `aria-label` on all section elements
5. Verify contrast ratios across all text/background combinations

---

## 6. Conversion Optimization

### Current Conversion Funnel
1. Hero CTA → "Start Deploying" → links to app.cli.cloud (good)
2. Mid-page CTAs → "Start Deploying" → same link (consistent)
3. Bottom CTA → "Start Deploying" → same link

### Missing Conversion Elements
1. **No container catalog preview** — users can't see what they'd deploy before clicking
2. **No social proof** — testimonials are unverified/placeholder
3. **No trust signals above fold** — compliance badges are in body copy
4. **No secondary CTA** — only one action path (start deploying)
5. **No exit-intent or engagement capture** — no email capture, no chat widget

### Recommended Conversion Architecture
```
Hero (value prop + video + stats)
  ↓
Trust Badge Strip (SOC 2, FedRAMP, etc.)
  ↓
Container Catalog Grid (6 templates with deploy CTAs)
  ↓
How It Works (3 steps)
  ↓
Social Proof (real testimonials + metrics)
  ↓
Clide Demo (interactive chat preview)
  ↓
Integrations (orbital display)
  ↓
FAQ (real questions)
  ↓
Final CTA (primary + secondary)
```

---

## 7. Performance Notes

### Bundle Size Concerns
- Remotion dependency (~500KB+) for one hero video that's pre-rendered as MP4. Consider lazy-loading or removing the Remotion player from the landing page bundle.
- Multiple unused shadcn components installed (recharts, react-day-picker, react-resizable-panels, vaul, sonner, input-otp, cmdk) — installed via `shadcn add` but not used on the landing page.
- `next-themes` installed but app is dark-only with no toggle.

### Performance Wins
- next/image is used for header/footer logos (good)
- Tailwind v4 with PostCSS (modern, efficient)
- CI pipeline already runs lint + build

### Recommendations
1. Lazy-load Remotion or remove it from the landing page bundle
2. Audit and remove unused dependencies
3. Add typecheck step to CI (`tsc --noEmit`)
4. Run `npm run build` and audit the bundle output for size surprises

---

## 8. Implementation Roadmap

### Phase 1 — Launch Blockers (Est. 1-2 days)
1. Delete content-reference.jsx (5 min)
2. Add section IDs and wire all nav/footer links (30 min)
3. Add container catalog section between hero and features (2-4 hours with design)
4. Verify or soften stats (15 min decision)
5. Wire footer social links to real URLs (15 min)

### Phase 2 — Credibility Fixes (Est. 1 day)
6. Add trust/compliance badge strip (1 hour)
7. Audit and replace testimonial content (1-2 hours)
8. Audit and replace FAQ content (1 hour)
9. Add "Start Deploying" CTA to nav (30 min)
10. Add video poster frame (15 min)

### Phase 3 — Quality & Polish (Est. 1-2 days)
11. Accessibility pass: skip link, reduced-motion, aria (2 hours)
12. Typographic scale formalization (1 hour)
13. Remove CSS token duplication (15 min)
14. Prune unused dependencies (30 min)
15. Consolidate spacing constants (30 min)

### Phase 4 — Enhancement (Post-launch)
16. Secondary CTA ("Talk to Clide" / "See what you can deploy")
17. Container catalog interactive preview or expandable details
18. Email capture or engagement mechanism
19. A/B testing framework for hero variants
20. Analytics integration (page views, CTA clicks, scroll depth)

---

## 9. Cross-Reference with Existing Specs

### Container Catalog Spec (container-catalog-spec.md)
The 6 templates defined in the catalog spec (OpenClaw, Next.js, FastAPI, Static HTML, Express API, Telegram Bot) should drive the Container Catalog section design. Each catalog card on the landing page should mirror the catalog entry's icon, name, stack tag, and description. The "Deploy" CTA on each card should link to the deploy flow in app.cli.cloud.

### Linting & Build Checks (landing-v2-linting-build-checks.md)
The component structure standard defined in the linting spec should be applied to any new components built for the landing page (catalog section, trust badges, etc.). Named exports, one component per file, kebab-case filenames, explicit FC typing.

### RunPod Migration Research (runpod-container-migration-opportunities.md)
The RunPod research identified vLLM serving, ComfyUI, Jupyter, and Ollama as high-value container migration opportunities. These should be reflected in the container catalog section as "Coming Soon" entries or a "More templates coming" callout to show platform momentum.

---

## 10. Summary Scorecard

| Category | Score | Status |
|---|---|---|
| Color & Theme | 8/10 | Good — minor cleanup needed |
| Typography | 6/10 | Needs formalization |
| Spacing & Layout | 7/10 | Mostly consistent |
| Component Library | 9/10 | Excellent foundation |
| Header/Nav | 6/10 | Dead links, missing CTA |
| Hero Section | 8/10 | Strong, minor fixes |
| Features Section | 5/10 | Missing catalog — critical |
| How It Works | 9/10 | Production quality |
| Clide Section | 8/10 | Good trust builder |
| Integrations | 8/10 | Visually strong |
| Testimonials | ?/10 | Needs content audit |
| FAQ | ?/10 | Needs content audit |
| Footer | 4/10 | All links dead |
| Accessibility | 5/10 | No reduced-motion, no skip link |
| Conversion Flow | 5/10 | Single path, no preview |
| Performance | 7/10 | Remotion concern, unused deps |

Overall: The page is 70% of the way to launch-ready. The remaining 30% is concentrated in container catalog visibility, dead link resolution, content verification, and accessibility compliance — all fixable in 2-3 focused sessions.

---

Review complete. Savage to review and leave comments.
Cross-references: landing-v2-code-review.md, landing-v2-linting-build-checks.md, container-catalog-spec.md, runpod-container-migration-opportunities.md