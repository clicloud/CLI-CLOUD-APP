# Landing-v2 UX Review — Design Systems Perspective
Reviewer: Clide (automated code audit) | Date: 2026-05-02

## Architecture Summary
Next.js 16 + Tailwind v4 + shadcn/ui + Radix primitives + Framer Motion + Remotion.
Dark-only theme. 10 block components composited in page.tsx. 77 source files total.
Brand tokens defined in globals.css via CSS custom properties. CLI orange (#EA5600) as primary.

## Strengths
1. Consistent dark palette — background (#0a0a0a), card (#1c1c1c), border (#2a2a2a), muted text (#6b6b6b). No light mode drift.
2. Proper shadcn component library — 50+ UI primitives under components/ui/. Card, Button, Dialog, Accordion, etc. all use the same design token layer.
3. Hero section is well-structured — LampContainer for glow, AnimatedGroup for stagger, browser chrome mock + hero-video.mp4 for product demo. Strong above-fold value proposition.
4. How It Works section uses numbered step cards with embedded interactive visuals (progress bars, terminal output, detection badges). This is production-quality storytelling.
5. Clide section features a realistic chat illustration matching the actual product UI. This builds trust.
6. Responsive header with scroll-aware state — collapses to a rounded pill with blur on scroll. Good mobile menu toggle.
7. Integrations section uses animated orbital layout for LLM providers. Strong visual hierarchy with CLI at center.

## Issues & Recommendations

### Critical
1. **No container catalog section** — Team consensus (documented in Clide memory) requires a container catalog strip above the fold. The current page has no catalog grid or marketplace preview. This was listed as a key spec item. Without it, the landing page does not communicate what users can actually deploy.
   
2. **CTAs are all anchor tags with `#`** — Every "Start deploying" button links to `https://app.cli.cloud` (good), but "Read docs" links to `#docs` which doesn't resolve. Footer links for GitHub, Discord, Twitter all point to `#`. These need real destinations before launch.

3. **content-reference.jsx is a legacy standalone file** — This 24KB file contains an entirely separate landing page implementation using inline styles, DM Sans font, blue/purple gradients, and a different brand palette. It appears to be Anthro's original prototype before the Tailwind rewrite. It should be removed from the repo to avoid confusion about which implementation is canonical.

### High Priority
4. **Typography inconsistency** — content-reference.jsx uses 'DM Sans' while the actual blocks use Inter Tight (via next/font/google). The hero uses clamp() for responsive sizing which is good, but some blocks hardcode pixel sizes in the reference file. Ensure all blocks use the same typographic scale.

5. **Feature cards lack the container catalog visual** — The features section shows Container Management, Resource Presets, and Clide chat. These are good, but per the agreed spec, a container catalog grid showing deployable options (Next.js, FastAPI, etc.) should be visible. The features section is the natural place for this.

6. **Stats strip claims "47s Avg deploy"** — This needs to be verifiable. If the actual average is different, this becomes a credibility issue. Consider "Under 2 minutes" or remove the stat until measured.

### Medium Priority
7. **No trust/compliance signals section** — The spec calls for trust signals visible above or near the fold. Currently, compliance mentions are buried in a feature card description ("SOC 2 Type II. FedRAMP Moderate."). These should be badges, not body copy.

8. **Footer is minimal** — No social links resolve. No legal links (Privacy, Terms). No copyright year. This is fine for internal review but needs completion before public launch.

9. **Testimonials section exists but likely has placeholder content** — Needs real quotes or should be removed. Placeholder testimonials damage credibility.

10. **FAQ section accordion** — Verify content is accurate. Placeholder FAQ items should be replaced with real questions from user research.

### Low Priority / Polish
11. **No skip-to-content or accessibility audit** — The page uses semantic HTML (sections, headers, nav) which is good. But no skip link, and the animated elements may need prefers-reduced-motion handling.

12. **Remotion HeroVideo component** — 31KB, complex. This generates the hero video programmatically. Verify it renders correctly in production and that the pre-rendered hero-video.mp4 in public/ is kept in sync.

13. **Multiple font loads** — Inter Tight + JetBrains Mono + Google Fonts import in content-reference.jsx. The reference file loads DM Sans separately. Clean up unused fonts after removing content-reference.jsx.

## Recommended Next Steps (Priority Order)
1. Add container catalog strip/section (matching the deploy dialog spec)
2. Wire all footer and nav links to real destinations
3. Delete content-reference.jsx from the repo
4. Add trust/compliance badge strip
5. Verify/replace stats and testimonials with real data
6. Accessibility pass (skip link, reduced-motion, aria)
7. Medo integrates Dot Studio SVG system for visual layer polish
