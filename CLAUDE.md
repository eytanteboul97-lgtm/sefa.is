# CLAUDE.md

Guidance for Claude Code (and other AI assistants) working in this repository.

## What this is

**Sefa** is a marketing/landing page for a beauty-booking platform ("Israel's
digital beauty house" — think a consumer app for booking salons, hairdressers,
spas and barbershops, plus a B2B pitch to salon owners). It is currently a
**single-page, static marketing site** — there is no backend, no database, no
auth, and no real booking functionality. Every interactive-looking feature
(waitlist, style quiz, pricing) is presentational/UI-only.

Stack: **Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS**,
with **Framer Motion** and **GSAP/Lenis** for animation and smooth scroll.
An earlier pass added a Three.js/React Three Fiber "beauty scene" to the
hero, but it was purely decorative floating objects with no real purpose
and was removed — don't reintroduce a 3D scene without a concrete reason,
per the `performance-audit` skill's cost concerns.

## Repository structure

```
app/
  layout.tsx       Root layout: fonts (next/font/google), <html>/<body>,
                    global SEO metadata + JSON-LD, wraps children in SmoothScroll
  page.tsx          The entire site: imports and stacks every section component
  globals.css       Tailwind directives + small set of global utility classes
                    (.glass, .ticket, .shimmer-text, .mirror-shine, .tilt-card, etc.)
                    and a prefers-reduced-motion override
components/
  ui/button.tsx     Shared <Button> primitive (variant/size props, cva-style)
  *.tsx             One component per landing-page section (see below), plus
                     small reusable pieces (Reveal, AnimatedCounter, Logo, ScrollProgress)
lib/
  utils.ts          `cn()` helper — clsx + tailwind-merge, used everywhere for className composition
public/
  favicon.svg
next.config.mjs      reactStrictMode, remote image pattern for images.unsplash.com
tailwind.config.ts    Design tokens: colors, fonts, custom keyframes/animations
netlify.toml          Netlify build config (`npm run build`, @netlify/plugin-nextjs)
tsconfig.json         `@/*` path alias → repo root
```

### Page sections (in render order, `app/page.tsx`)

`Navbar`, `ScrollProgress`, `Hero`, `CategoryGrid`, `BeautyRituals`,
`PopularSalons`, `StyleQuiz`, `AIFeatures`, `SalonOwnerFeatures`,
`ProductShowcase`, `Testimonials`, `SmartWaitlist`, `FoundingProgram`,
`Pricing`, `FAQ`, `CTA`, `Footer`.

Each is a self-contained component in `components/` with its own copy,
styling and animation — there's no shared section wrapper or layout system
beyond Tailwind utility classes. When adding a new section, follow this same
pattern: one file, default export a named function component, import and
place it in `app/page.tsx`.

## Conventions

- **Client vs. server components**: Most section components are `"use client"`
  because they use Framer Motion, GSAP, or browser APIs. Keep components
  server components (no `"use client"`) unless they need interactivity,
  animation hooks, or browser-only APIs — don't add the directive reflexively.
- **Styling**: Tailwind utility classes only, composed with the `cn()` helper
  from `lib/utils.ts` (never string-concatenate classNames manually). Custom
  one-off visual effects (glass, shimmer, ticket notch, mirror shine) live as
  named classes in `app/globals.css`, not as inline `<style>` blocks.
- **Design tokens**: Colors, fonts, radii, shadows and keyframes are defined
  centrally in `tailwind.config.ts`. Use the semantic token names (`paper`,
  `ink`, `coral`, `teal`, `gold`, `pearl`, etc.) rather than raw hex values or
  Tailwind's default palette — the palette is a deliberate warm
  cream/noir/gold brand system, documented inline in `tailwind.config.ts`.
- **Fonts**: Four font roles are wired through CSS variables in
  `app/layout.tsx`/`tailwind.config.ts`: `font-display` (Space Grotesk, UI/tech),
  `font-body` (Inter), `font-luxury` (Playfair Display, editorial serif),
  `font-accent` (Fraunces italic). Pick the role that matches the existing
  usage pattern for that kind of text (see `hero.tsx` for the canonical mix).
- **Animation**: Framer Motion for scroll-linked/in-view reveals (see
  `components/reveal.tsx` for the standard fade-up-on-view pattern), GSAP +
  ScrollTrigger + Lenis for global smooth scroll (`components/smooth-scroll.tsx`).
  Always respect `prefers-reduced-motion` — `SmoothScroll` already skips
  inertial scrolling for it, and `globals.css` has a blanket override that
  collapses animation/transition durations.
- **Images**: Only `images.unsplash.com` is whitelisted as a remote pattern in
  `next.config.mjs`. Add new hostnames there before using `next/image` with a
  new external source.
- **No fabricated assets**: Per `README.md`, this project deliberately avoids
  fake video links or third-party embeds (e.g. Spline) that can't be verified
  to work in this environment. The hero uses a real Ken Burns photo crossfade
  (`components/hero-photos.tsx`) and a hand-built three.js scene
  (`components/beauty-scene.tsx`) instead. Don't reintroduce placeholder
  video URLs or unverifiable embeds.
- **Path imports**: Use the `@/` alias (e.g. `@/components/button`,
  `@/lib/utils`) rather than relative paths — configured in `tsconfig.json`.

## Development workflow

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve production build
npm run lint     # next lint (eslint-config-next)
```

There is **no test suite** (no Jest/Vitest/Playwright config, no `test`
script). Verifying a change means running `npm run dev` and checking the
affected section in the browser, plus `npm run build` to catch type/lint
errors before committing — there's nothing else to run.

## Deployment

Deploys via Netlify using `netlify.toml` (`npm run build` +
`@netlify/plugin-nextjs`). If the project root ever moves within its repo,
`netlify.toml` needs an explicit `base` pointing at the new folder (see the
note at the bottom of `README.md`).

## Project skills

`.claude/skills/` has repo-specific skills — invoke them (or let them
trigger automatically) instead of improvising these workflows from scratch:

- `add-section` — scaffold a new landing-page section the same way existing
  ones are built.
- `design-audit` — check code against the color/font/utility-class design
  system.
- `netlify-deploy-check` — validate `netlify.toml` and diagnose Netlify
  build-config issues.
- `seo-metadata-update` — update SEO/OG/JSON-LD metadata in `app/layout.tsx`
  consistently.
- `visual-check` — actually view a UI change in the browser before calling
  it done.
- `copy-tone-check` — keep new marketing copy in the site's premium
  editorial-luxury voice.
- `image-optimization` — `next/image` usage, remote host whitelisting,
  hero/LCP handling, alt text, and the missing OG image gap.
- `video-integration` — wire in a real video (self-hosted or embed) once one
  exists; never fabricates a video source.
- `performance-audit` — bundle size, Core Web Vitals, and the cost of
  scroll-pinned sections.
- `accessibility-audit` — contrast, keyboard nav, ARIA, and the known
  mobile-nav/custom-tabs gaps.
- `photo-treatment` — consistent crossfade transitions and a shared warm
  color grade across all photography.
- `responsive-parity` — mobile is a first-class layout, not desktop with
  things quietly hidden.
- `logo-polish` — keep the wordmark/diamond mark consistent across navbar,
  footer, and favicon, and give it a real exportable asset.

## Working in this repo

- This is a small, single-purpose site (~1,900 lines across `components/`).
  Prefer editing the existing section component over adding new abstraction
  layers — there is intentionally no CMS, no data layer, and no shared
  section framework.
- Copy is in English by default; `layout.tsx` metadata mentions `fr`/`he`
  alternates but no actual localized content or routing exists yet — don't
  assume i18n infrastructure is in place.
- Since this is a marketing site, treat visual/animation quality and
  copywriting tone (premium, warm, editorial-luxury) as first-class parts of
  any change, not just functional correctness.
