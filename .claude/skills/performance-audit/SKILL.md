---
name: performance-audit
description: Audit and improve real-world load/runtime performance of sefa.is (bundle size, Lighthouse/Core Web Vitals, heavy animation libraries, scroll-pinned section cost). Use when asked to make the site faster, before/after adding heavy dependencies or animations, or when a change touches hero/scroll-pinned sections.
---

# Performance audit

This site carries real, acknowledged performance risk: `README.md` says
Lighthouse 95+ isn't guaranteed because of the pinned-scroll `ProductShowcase`
section and the `HeroPhotos` Ken Burns crossfade. (An earlier three.js
"beauty scene" in the hero was removed for being decorative dead weight
with no real purpose — don't reintroduce a 3D scene or similarly heavy
dependency without a concrete reason.) This skill is about measuring the
remaining risk concretely and not making it worse — this is arguably the
highest-leverage lever for actually improving the site, since slow load
directly costs bounce rate, SEO ranking, and conversions on a marketing
page.

## Baseline: know the current numbers

Run `npm run build` and read the route table it prints. As of the last
audit, the home route was:

```
Route (app)                              Size     First Load JS
┌ ○ /                                    74.1 kB         206 kB
+ First Load JS shared by all            87.4 kB
```

Treat this as the baseline. After any change that adds a dependency, a new
section, or new client-side code, re-run the build and compare — a
meaningful jump (tens of kB) in Size or First Load JS for `/` is a signal to
investigate, not just accept.

## Heavy dependencies already in play

`package.json` carries `framer-motion` (used almost everywhere) and
`gsap` + `lenis` (global smooth scroll + ScrollTrigger). Before adding
another animation/scroll/3D library, check whether one of these already
covers the need — every new dependency here compounds an already-heavy
client bundle. A three.js/React Three Fiber hero scene was previously
removed for being purely decorative with no functional payoff — don't
bring 3D back in without a concrete, non-decorative reason.

## Use next/dynamic for anything heavy and non-critical

Any client-only, heavy, below-the-fold component (a chart library, a 3D
scene, a heavy modal) should be lazy-loaded with `next/dynamic` +
`ssr: false` rather than imported eagerly at the top of a section file:

```tsx
const HeavyThing = dynamic(
  () => import("@/components/heavy-thing").then((m) => m.HeavyThing),
  { ssr: false }
);
```

This keeps it out of the initial bundle and out of server-side rendering
entirely, so it only costs bytes/CPU for users who actually scroll to it.

## Scroll-driven sections

`components/product-showcase.tsx` pins the viewport for
`panels.length * 500` px (currently 2000px) via GSAP `ScrollTrigger` with
`scrub: 0.4`, and `components/smooth-scroll.tsx` runs Lenis + ScrollTrigger
globally. This combination is real work on every scroll frame:

- If adding a new pinned/scrubbed section, keep the pin duration
  proportional to actual content (don't pin longer than needed just for
  effect) — longer pins mean more scroll-frame computation and more
  perceived-scroll-hijacking risk.
- Test scroll smoothness with Chrome DevTools' Performance panel under CPU
  throttling (4x–6x slowdown) before and after changes — a section that
  feels smooth on a dev machine can visibly jank on a mid-range phone.
- Both `SmoothScroll` and `ProductShowcase` already check
  `prefers-reduced-motion` and skip their respective animation work — any
  new scroll-driven section must do the same (see the `useReducedMotion`/
  `matchMedia` pattern in those two files), which also reduces work for
  users who've opted out, not just an accessibility nicety.

## Core Web Vitals checklist

- **LCP**: the hero image already sets `priority` and `sizes="100vw"`
  (`hero-photos.tsx`) — keep this on whatever ends up being the largest
  above-the-fold element. Don't add `priority` to more than one image.
- **CLS**: images use `fill` with sized/positioned parents or explicit
  `width`/`height` — don't introduce an image or embed without one of these,
  it will shift layout as it loads.
- **INP**: heavy synchronous work in scroll/resize handlers is the main
  risk given Lenis + ScrollTrigger + Framer Motion all listening to scroll.
  Avoid adding another scroll listener when an existing one
  (`useScroll`/`ScrollTrigger`) could be reused.

## Running a real Lighthouse pass

Netlify offers a Lighthouse plugin on the dashboard (see `README.md`) — that
is the most representative real-world measurement since it runs against the
actual deployed build. Locally, `npm run build && npm start` then a
Chrome DevTools Lighthouse run in incognito (extensions can skew results) is
the next best thing. Don't rely on `npm run dev` for performance numbers —
dev mode is unoptimized and unrepresentative.

## After a performance change

Run the `visual-check` skill to confirm nothing visually broke from
lazy-loading or reduced-motion branches, and re-run `npm run build` to
confirm the bundle size moved in the direction expected.
