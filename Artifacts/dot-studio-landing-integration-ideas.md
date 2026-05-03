# Dot Studio SVG → CLI Landing Page Integration Ideas
Prepared for Anita | May 3, 2026

## What Dot Studio Does
Dot Studio takes any SVG input and generates branded wavy dot patterns — those distinctive cloud-like dot arrays that carry CLI's visual identity. It's a single HTML file already pushed to the CLI GitHub. The task is to weave this tool into the landing page so it's both a visual layer and a functional demo, not just a static page describing a product.

The current landing page (Landing-v2) is Next.js 16 + Tailwind v4 + shadcn/ui + Framer Motion. Dark-only theme with CLI orange (#EA5600) as primary. Brand tokens in CSS custom properties. 10 block components in page.tsx.

---

## IDEA 1 — Interactive Hero Background (Recommended)

**What:** Replace or augment the current LampContainer glow behind the hero with a live Dot Studio canvas. As the page loads, the dot pattern blooms outward from behind the hero text and browser chrome mock, filling the viewport with CLI's branded dot language.

**How it works:**
- Extract the core SVG generation logic from the Dot Studio HTML file into a React component (e.g., `DotCanvas.tsx`)
- Mount it as a full-viewport background behind the hero section using absolute positioning and z-index layering
- The dots animate on load (stagger in, bloom outward) and respond subtly to mouse movement — parallax or gentle wave displacement
- The hero text, browser chrome mock, and hero-video.mp4 sit on top as they do now
- On mobile, use a static rendered dot pattern (no animation) for performance

**Why this works:** It immediately demonstrates what the tool does without the user needing to scroll or click anything. The first thing they see IS the product.

**Implementation notes:**
- Port the SVG generation to a client-side React component with canvas rendering
- Use `requestAnimationFrame` for the animation loop, not Framer Motion (performance)
- Add `prefers-reduced-motion` check — serve static SVG for users who opt out
- Keep the LampContainer as a fallback/supplement if the dot canvas needs a warm glow underneath

---

## IDEA 2 — Dot Pattern as Section Dividers

**What:** Between each major section of the landing page (Hero → How It Works → Features → Integrations → Clide), insert a full-width dot pattern band that visually connects sections using the Dot Studio aesthetic.

**How it works:**
- Generate 5-6 distinct dot pattern variants using Dot Studio (different densities, wave amplitudes, color gradients)
- Each section transition gets a slightly different pattern, creating visual rhythm without repetition
- The dot bands are SVG elements (not canvas) for crisp rendering at any resolution
- Animate them on scroll-into-view using Intersection Observer — dots fade in with a wave effect

**Why this works:** It creates visual continuity across the entire page and reinforces the brand language at every scroll point. It also makes the page feel cohesive rather than a stack of disconnected sections.

**Implementation notes:**
- Pre-generate the SVG patterns at build time and import them as React components
- Use Tailwind's `bg-clip` and gradient utilities for color variation within the dot bands
- Keep each band thin (80-120px) so they don't eat scroll real estate

---

## IDEA 3 — Live Playground Section ("Try It")

**What:** Add a dedicated section on the landing page where users can interact with Dot Studio directly — upload or select an SVG, adjust parameters (dot size, spacing, wave amplitude, color), and see the dot pattern render in real-time.

**How it works:**
- Embed the Dot Studio HTML tool as an iframe initially (fastest path), then refactor into a native React component
- Provide 3-4 preset SVGs (CLI logo, a cloud icon, a code bracket, a container icon) so users don't need to upload anything to start playing
- Show real-time parameter sliders: dot radius, gap, wave intensity, color stops (orange gradient vs monochrome)
- Add a "Copy SVG" or "Download" button so the output feels tangible
- Position this section between Features and Integrations (around the 60% scroll mark)

**Why this works:** This is the strongest conversion tool on the page. A user who plays with the generator for 30 seconds is invested. They've experienced the product, not just read about it. It answers "what does CLI actually do?" with a visceral demo.

**Implementation notes:**
- iframe embed gets it shipped fast (days). Native React component is the proper long-term path
- For the iframe approach: host the Dot Studio HTML on a CLI subdomain or serve it from the Next.js public folder
- For the native approach: extract the generation core into a shared utility, build a React UI around it with shadcn Slider, Select, and Button components
- Performance guard: cap the dot count for the live playground (max ~2000 dots) to keep frame rate smooth

---

## IDEA 4 — Container Catalog Cards with Dot Overlay

**What:** When the container catalog section gets built (per the UX review, it's the #1 missing piece), each container card (Next.js, FastAPI, Telegram Bot, etc.) gets a unique Dot Studio pattern as its visual identity — a branded dot texture specific to each template.

**How it works:**
- Run each container's icon through Dot Studio to generate a unique dot pattern
- Use the pattern as a subtle overlay or background on each catalog card
- On hover, the dots animate (pulse outward, shift color gradient) to signal interactivity
- The card's deploy CTA overlays the dot pattern

**Why this works:** It solves two problems at once — the missing container catalog AND the need to showcase Dot Studio's output. Every card is simultaneously a product listing and a demo of what the SVG tool produces.

**Implementation notes:**
- Pre-generate patterns for each catalog item at build time
- Store as inline SVG in the card component for instant rendering
- Animate on hover with CSS transforms (scale, opacity) rather than JS for performance

---

## IDEA 5 — Dot Trail Cursor Effect

**What:** Add a subtle trailing dot effect that follows the user's cursor across the landing page — dots bloom and fade behind the pointer, matching the Dot Studio aesthetic.

**How it works:**
- Track cursor position via `mousemove`
- Spawn small dot elements at intervals behind the cursor path
- Each dot fades out and scales down over ~500ms
- Use the CLI orange gradient palette
- Disable on mobile (touch devices)

**Why this works:** It's a micro-interaction that makes the entire page feel alive and connected to the dot theme. Low implementation effort, high visual payoff. Similar effects are used on premium agency sites and always get positive reactions.

**Implementation notes:**
- Use CSS animations for the fade-out (GPU-accelerated, no JS animation loop needed)
- Pool and recycle dot elements instead of creating/destroying DOM nodes
- Cap at 20 active dots to prevent DOM bloat

---

## Recommended Implementation Order

1. **Idea 1 (Hero Background)** — Highest visual impact, first thing users see. Do this first.
2. **Idea 3 (Live Playground)** — Strongest conversion tool. Ship as iframe first, native later.
3. **Idea 2 (Section Dividers)** — Visual continuity. Quick to implement once the component exists.
4. **Idea 4 (Catalog Cards)** — Depends on the container catalog section being built. Queue after catalog exists.
5. **Idea 5 (Cursor Effect)** — Polish layer. Last priority, easy win.

## Quick Start

1. Pull the Dot Studio HTML file from the CLI GitHub repo
2. Study its generation logic (how it converts SVG input → dot array → output)
3. Extract the core algorithm into a reusable function
4. Build the `DotCanvas` React component from Idea 1
5. Wire it into the hero section of Landing-v2

The dot generation logic is the shared foundation — once you have that extracted, every other idea becomes a variation on how you display and interact with its output.
