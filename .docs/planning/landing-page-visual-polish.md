# Landing-v2 — Visual Polish: Code-Level Recommendations

Author: Clide | Date: 2026-05-02
Task ID: 78c8a62a-d244-4a6e-af04-f72eed6de8b1
Scope: Specific spacing, typography, and hierarchy recommendations for each section
Audience: Savage (execute), developers (reference)

---

## 1. Purpose

The code review identified that the landing page is structurally strong but short of the "expensive, polished look" target. This document provides exact, implementable spacing/typography/hierarchy changes per section — not a redesign, but a refinement pass that elevates the existing structure to premium quality.

All class names reference Tailwind v4 utilities. Apply to the existing block components in `src/components/blocks/`.

---

## 2. Global Changes

### 2.1 Section Spacing

Current: Sections use `py-20` to `py-24` inconsistently.

Change: Standardize all sections to `py-24 md:py-32 lg:py-40`.
This adds more breathing room between sections, creating the "expensive" feel through generous whitespace. The desktop experience should feel spacious, not cramped.

Apply to: Every block component's outermost section/wrapper element.

### 2.2 Container Width

Current: Content containers use inconsistent max-widths.

Change: Standardize to `max-w-7xl mx-auto px-6 lg:px-8` for all sections.
Narrow sections (stats strip, trust badges): `max-w-5xl mx-auto px-6 lg:px-8`.

### 2.3 Typographic Scale

Define and apply consistently:

| Element | Current | Target |
|---|---|---|
| Hero headline | `text-6xl md:text-7xl xl:text-[5.25rem]` | Keep (good) |
| Section headline | Mixed `text-4xl`, `text-3xl` | `text-4xl md:text-5xl font-semibold tracking-tight` |
| Section subtitle | Mixed `text-lg`, `text-xl` | `text-lg md:text-xl text-[var(--muted-foreground)]` |
| Card title | Mixed sizes | `text-xl font-semibold` |
| Body text | `text-sm` to `text-base` | `text-base leading-relaxed` |
| Caption/label | Mixed | `text-sm text-[var(--muted-foreground)]` |

Add to globals.css:
```css
:root {
  --text-hero: clamp(3rem, 5.25rem, 6rem);
  --text-h1: 3rem;
  --text-h2: 2.25rem;
  --text-h3: 1.25rem;
  --text-body: 1rem;
  --text-caption: 0.875rem;
}
```

---

## 3. Section-Specific Recommendations

### 3.1 Hero Section (hero-section.tsx)

Spacing:
- Increase vertical padding between headline and subtitle: `mt-6` → `mt-8`
- Increase spacing between subtitle and CTA buttons: `mt-8` → `mt-10`
- Stats strip: increase gap between items: `gap-8` → `gap-12 md:gap-16`

Typography:
- Headline: keep current clamp sizing
- Subtitle: ensure `text-xl md:text-2xl` with `text-[var(--muted-foreground)]` and `leading-relaxed`
- Stats: `text-3xl md:text-4xl font-bold` for numbers, `text-sm text-[var(--muted-foreground)]` for labels

Visual:
- Orange glow (LampContainer): increase the gradient radius slightly for a softer, more premium feel
- Grid background lines: reduce opacity from current to `opacity-[0.03]` — more subtle
- Browser chrome mock: add a subtle reflection gradient (white overlay at 2% opacity, top-to-bottom fade)

### 3.2 Features Section (features-section.tsx)

Spacing:
- Card grid gap: `gap-6` → `gap-8`
- Card internal padding: ensure `p-6 lg:p-8`
- Card title to description: `mt-2` → `mt-3`

Typography:
- Section headline: `text-4xl md:text-5xl font-semibold tracking-tight`
- Card title: `text-xl font-semibold` (consistent)
- Card description: `text-base text-[var(--muted-foreground)] leading-relaxed`

Visual:
- Feature card illustrations: ensure consistent sizing across all 3 cards (same width, proportional height)
- Card borders: add a subtle gradient border effect (top border uses CLI orange at 10% opacity, rest is standard #2a2a2a)
- Card hover: `transition-all duration-300 hover:border-[#EA5600]/20 hover:shadow-lg hover:shadow-[#EA5600]/5`

### 3.3 How It Works Section

Spacing:
- Step cards: increase vertical gap between steps: `gap-6` → `gap-8 md:gap-12`
- Step number to title: ensure `mt-4`
- Title to description: `mt-2` → `mt-3`

Typography:
- Step number: `text-5xl font-bold text-[#EA5600]/20` (large, faded, decorative)
- Step title: `text-xl font-semibold`
- Step description: `text-base text-[var(--muted-foreground)] leading-relaxed`

Visual:
- The interactive visuals (progress bar, terminal, badges) are already strong. No changes needed.
- Add a connecting line between steps on desktop (thin dashed line, `border-dashed border-[#2a2a2a]`, from step 1 to step 3)

### 3.4 Clide Section

Spacing:
- Chat illustration: ensure `max-w-lg mx-auto` and `mt-12` below section headline

Typography:
- Section headline: same as other sections
- Chat bubble text: ensure `text-sm leading-relaxed`

Visual:
- Chat bubble backgrounds: use slightly different shade for user vs bot messages for clarity
- Add a subtle pulsing cursor in the last bot message to indicate "live" feeling

### 3.5 Integrations Section

Spacing:
- Orbital layout: ensure generous spacing between provider logos and CLI center icon
- Provider label text: `text-xs` to avoid visual noise

Visual:
- The orbital animation is strong. Ensure consistent logo sizing (all 32x32 or 40x40)
- CLI center icon: slightly larger than providers (48x48 vs 32x32) to reinforce hierarchy

### 3.6 Testimonials Section

Spacing:
- Testimonial card padding: `p-6 lg:p-8`
- Attribution line: `mt-4` below quote text
- Star rating: `mb-3` above quote

Typography:
- Quote: `text-lg md:text-xl leading-relaxed italic text-[var(--muted-foreground)]`
- Attribution name: `text-sm font-semibold`
- Attribution role: `text-xs text-[var(--muted-foreground)]`

Visual:
- Quote mark: large decorative `"` in CLI orange at 20% opacity, positioned top-left of card, behind text

### 3.7 FAQ Section

Spacing:
- Accordion items: `gap-2` between items
- Question text: `py-4 px-6`
- Answer text: `px-6 pb-4`

Typography:
- Question: `text-base font-semibold`
- Answer: `text-base text-[var(--muted-foreground)] leading-relaxed`

Visual:
- Accordion trigger: add `hover:bg-[#1c1c1c]/50` for subtle row hover
- Active item: `border-l-2 border-[#EA5600]` for visual indication of expanded state

### 3.8 CTA Section

Spacing:
- Increase padding: `py-16` → `py-20 md:py-24`
- Button to subtitle spacing: `mt-6` → `mt-8`

Typography:
- Headline: `text-3xl md:text-4xl font-semibold tracking-tight`
- Subtitle: `text-lg text-[var(--muted-foreground)]`

Visual:
- Background: subtle gradient from background color to slightly lighter shade
- CTA button: ensure size is `lg` with `px-8 py-3` for generous hit target
- Add a subtle glow behind the CTA button (`shadow-lg shadow-[#EA5600]/10`)

### 3.9 Footer

Spacing:
- Top padding: `py-12` → `py-16`
- Bottom padding: `pb-8` (for copyright)

Typography:
- Link text: `text-sm text-[var(--muted-foreground)] hover:text-white transition-colors`
- Copyright: `text-xs text-[var(--muted-foreground)]`

Visual:
- Add a top border: `border-t border-[#2a2a2a]`
- Social icons: 20x20, `text-[var(--muted-foreground)] hover:text-[#EA5600] transition-colors`
- Logo: slightly muted (opacity 0.8) compared to header

---

## 4. Dark Mode Refinements (Global)

Since CLI is dark-only, optimize the dark palette for premium feel:

- Background: keep `#0a0a0a` (almost black)
- Card: consider lightening slightly to `#141414` for better differentiation from background
- Border: keep `#2a2a2a` but add `border-opacity-50` where appropriate to soften
- Muted text: verify `#6b6b6b` passes WCAG AA on `#0a0a0a` (it does, but verify on `#141414` card surfaces too)
- Primary orange: keep `#EA5600` — consider a subtle gradient variant (`bg-gradient-to-r from-[#EA5600] to-[#FF7A33]`) for primary CTA buttons

---

## 5. Motion Refinements

- Stagger animations: ensure all stagger delays use consistent timing (100ms between items)
- Fade-in on scroll: all sections should fade in when entering viewport (use Intersection Observer or Framer Motion `whileInView`)
- Reduce animation duration by 20% across the board — snappier feels more premium
- Add `transition-colors duration-200` to all interactive elements (links, buttons, cards)

---

## 6. Implementation Order

1. Global spacing standardization (Section 2.1, 2.2) — 30 min
2. Typographic scale definition in globals.css (Section 2.3) — 15 min
3. Section-specific spacing adjustments (Sections 3.1-3.9) — 1-2 hours
4. Dark palette refinements (Section 4) — 15 min
5. Motion refinements (Section 5) — 30 min
6. Visual polish details (borders, shadows, gradients) — 1 hour

Total estimated effort: 3-4 hours for a single pass.

---

Savage to execute or delegate. These are incremental refinements on top of the existing structure — no architectural changes required.
