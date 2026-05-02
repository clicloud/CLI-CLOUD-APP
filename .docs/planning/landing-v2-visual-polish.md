# Landing-v2 — Visual Polish Review

Author: Clide | Date: 2026-05-02
Task ID: 78c8a62a-d244-4a6e-af04-f72eed6de8b1
Repo: clicloud/Landing-v2 | Stack: Next.js 16, Tailwind v4, shadcn/ui

---

## Objective

Raise the landing page from "solid dark SaaS page" to "expensive, premium platform." This is a code-level review with exact Tailwind values and specific element-level recommendations. Every fix is implementable without redesigning any section.

---

## 1. Spacing Rhythm

Current issue: Section spacing is inconsistent. Some sections use `py-24`, others use `py-20` or `py-32`. This breaks the vertical rhythm and makes the page feel uneven.

Fix: Standardize to a consistent rhythm:
- Between major sections: `py-24 md:py-32` (6rem mobile, 8rem desktop)
- Section internal padding: `gap-12 md:gap-16` between heading and content
- Card grid gaps: `gap-6` consistently

Apply to page.tsx:
```
Every <section> block gets: className="py-24 md:py-32"
Section heading to content: className="space-y-4 md:space-y-6"
Grid containers: className="grid gap-6"
```

---

## 2. Typography Hierarchy

Current issue: Section titles use varying sizes and weights across blocks. The hero title is well-scaled but section titles drift between `text-3xl` and `text-4xl` without a clear hierarchy.

Fix: Define three levels and apply consistently:

Hero title: `text-5xl md:text-7xl xl:text-[5.25rem] font-bold tracking-tight` (keep as-is)
Section titles: `text-3xl md:text-4xl font-semibold tracking-tight` (standardize all sections)
Card titles: `text-xl font-semibold`
Body text: `text-base leading-relaxed text-[#999]`
Label/caption: `text-sm text-[#6b6b6b] uppercase tracking-wider font-medium`

The `tracking-tight` on titles is critical — it signals premium. Without it, the type feels loose and generic.

---

## 3. Section Title Treatment

Current issue: Section titles are plain text with no visual differentiation from body content. Premium landing pages use subtle decorations to anchor each section.

Fix: Add a consistent label → title → description pattern to every section:

```tsx
<div className="text-center max-w-2xl mx-auto space-y-4">
  <span className="text-sm font-medium text-[#EA5600] uppercase tracking-wider">
    Section Label
  </span>
  <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
    Section Title
  </h2>
  <p className="text-base text-[#999] leading-relaxed">
    Section description
  </p>
</div>
```

The orange label above the title creates visual hierarchy and brand consistency. Apply this pattern to Features, How It Works, Integrations, and CTA sections.

---

## 4. Card Polish

Current issue: Feature cards use `bg-[#1c1c1c]` with `border-[#2a2a2a]`. Flat, functional, but not premium.

Fix: Add layered depth to cards:

```css
/* Base card */
bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl

/* Hover state */
hover:border-[#3a3a3a] hover:shadow-lg hover:shadow-black/20

/* Premium touch: subtle gradient overlay */
before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.02] before:to-transparent before:rounded-xl
```

The gradient overlay adds a barely-visible sheen that catches the eye subconsciously. The hover state with shadow creates depth perception.

---

## 5. Button Treatment

Current issue: Primary CTA buttons may lack refined states.

Fix for primary (orange) button:
```
bg-[#EA5600] text-white font-medium px-6 py-3 rounded-lg
hover:bg-[#FF6A1A] hover:shadow-lg hover:shadow-[#EA5600]/20
active:scale-[0.98]
transition-all duration-150
```

The `shadow-[#EA5600]/20` glow on hover is the premium signal — it creates a color-matched ambient light effect.

Fix for secondary (ghost) button:
```
border border-[#2a2a2a] text-[#999] font-medium px-6 py-3 rounded-lg
hover:border-[#3a3a3a] hover:text-white
active:scale-[0.98]
transition-all duration-150
```

---

## 6. Hero Section Polish

The hero is already the strongest section. Targeted improvements:

### Grid Background
Add a very subtle blue tint to the grid lines to break the pure-gray monotony:
```css
background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
```

### Orange Glow
Increase the glow radius and add a secondary, larger, softer glow:
```
Primary glow: w-[600px] h-[300px] bg-[#EA5600]/15 blur-[120px]
Secondary glow: w-[900px] h-[400px] bg-[#EA5600]/5 blur-[200px]  (larger, softer)
```

This creates a more cinematic atmosphere without being distracting.

### Stats Strip
Add a subtle top border to separate stats from hero content:
```tsx
<div className="border-t border-[#2a2a2a]/50 pt-8 mt-12">
```

---

## 7. Background Texture

Current issue: Below the hero, the background is flat #0a0a0a. This feels empty on long scroll.

Fix: Add a very subtle dot grid or noise texture to the body background:
```css
body {
  background-color: #0a0a0a;
  background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 24px 24px;
}
```

This adds texture without competing with content. The dots should be barely visible — if you have to look for them, the density is right.

Alternative: SVG noise filter for a more organic texture:
```css
background-image: url("data:image/svg+xml,...");
opacity: 0.015;
```

---

## 8. Section Divider Treatment

Current issue: Sections bleed into each other on scroll. No visual separation.

Fix: Add subtle dividers between sections:
```tsx
<div className="h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent" />
```

Place between every major section block. The gradient (fading from transparent at edges) creates an elegant separator that doesn't feel like a hard line.

---

## 9. Footer Polish

Current issue: Footer is minimal and feels disconnected.

Fix:
- Add a top divider (gradient line from item 8)
- Increase vertical padding: `py-16 md:py-20`
- Two-column layout on desktop: left column (logo + description), right column (links grid)
- Logo should be slightly muted: `opacity-80`
- Links should have hover states: `hover:text-white transition-colors duration-150`
- Copyright line at bottom: `text-sm text-[#6b6b6b]`
- Add social icons (GitHub, Twitter/X, Discord) with hover effects

---

## 10. Animation Refinement

Current issue: Animations are present but could be more controlled.

Fixes:
- Reduce Framer Motion stagger delay from `0.1s` to `0.08s` between items — feels snappier.
- Add `ease: [0.25, 0.1, 0.25, 1]` (custom ease-out curve) to all section entrance animations.
- Scroll-triggered animations should have a `viewport={{ once: true, margin: "-100px" }}` — animate once, trigger 100px before entering viewport.
- Avoid animating `width` or `height` properties — use `transform: translateY` and `opacity` only for GPU-accelerated performance.

---

## 11. Color Edge Cases

- Orange (#EA5600) should never appear on dark backgrounds smaller than 16px — below that size, the contrast is insufficient for readability. Use white text on orange backgrounds, orange text on dark backgrounds only at heading/body scale.
- Muted text (#6b6b6b) on cards (#1c1c1c) — contrast ratio is ~4.8:1 which passes WCAG AA for normal text. Fine for secondary content.
- Error states should use `#EF4444` (red-500), not orange — orange is brand, red is error. Don't conflate them.

---

## Priority Implementation Order

1. Section title treatment (label + title + description pattern) — instant visual upgrade
2. Card hover states with shadow — depth perception
3. Section dividers (gradient lines) — visual rhythm
4. Background texture (dot grid) — premium atmosphere
5. Button glow on hover — conversion element polish
6. Typography standardization — consistency
7. Footer expansion — completeness
8. Animation timing refinement — feel

Items 1-4 are highest visual impact per effort. Items 5-8 are polish that compounds.

---

Review complete. All recommendations are specific Tailwind values and implementable without section redesign. Awaiting Savage review and comments.
