---
name: image-optimization
description: Optimize how images are sourced, loaded, and rendered on sefa.is (next/image usage, remote hosts, hero/LCP images, alt text, missing OG image). Use when adding new images, touching the hero photo crossfade, or asked to improve image performance/SEO/accessibility.
---

# Image optimization

Sefa is a visually heavy marketing site (hero crossfade, product/salon
photography, 3D scene) where images are a major factor in both performance
and the "premium" feel. The README already flags that Lighthouse 95+ isn't
guaranteed because of this — this skill is about not making that worse, and
fixing what's already sub-optimal.

## Always use `next/image`

Every new image must go through `next/image`, never a raw `<img>` tag —
this project relies on Next's automatic resizing/format negotiation and
lazy-loading. If you find a raw `<img>` while touching a component, flag it
and convert it.

## Remote image hosts

Only `images.unsplash.com` is currently whitelisted in
`next.config.mjs` (`images.remotePatterns`). Before using any other external
image URL (a different stock source, a CDN, a client's own asset host), add
its hostname there first — Next.js will otherwise refuse to render it:

```js
images: {
  remotePatterns: [
    { protocol: "https", hostname: "images.unsplash.com" },
    // add new hosts here, one object per hostname
  ],
},
```

Prefer moving genuinely final assets into `public/` over relying on a remote
host long-term, especially for anything brand-critical (logo marks, hero
stills) — remote hosts are fine for placeholder/stock imagery during
iteration.

## Hero / LCP images

The hero (`components/hero-photos.tsx`, `components/hero.tsx`) is almost
certainly the Largest Contentful Paint element. Any image in the initial
viewport must:

- set `priority` on the `next/image` (or the first slide only, if it's a
  crossfade/carousel — don't mark every slide `priority`, only the one
  visible on load),
- provide accurate `sizes` matching the responsive layout (this site uses
  `sm`/`md`/`lg` breakpoints throughout — match the image's actual rendered
  width at each),
- avoid layout shift: set explicit `width`/`height` (or `fill` with a sized
  parent) so nothing jumps in as it loads.

Below-the-fold images (`ProductShowcase`, `PopularSalons`, testimonials,
etc.) should NOT use `priority` — let them lazy-load normally.

## Alt text

Every image needs a real, descriptive `alt` — this is a `robots: index,
follow` site, so alt text also feeds SEO, not just accessibility. Decorative
images only (e.g. a background texture with no informational content) may
use `alt=""`, but check first whether the image actually conveys content
(salon photo, product shot) before treating it as decorative.

## Known gap: missing OG image

`app/layout.tsx` references `/og-image.jpg` (1200×630) in `openGraph.images`
and `twitter.images`, but no such file currently exists in `public/`. If
working on anything metadata- or image-related, flag this to the user — link
previews (Slack, X, WhatsApp) currently point at a broken image. Fixing it
means adding a real `public/og-image.jpg` at 1200×630, matching the site's
warm cream/noir/gold visual identity (see `seo-metadata-update` skill for the
metadata side of this).

## Format and weight

- Prefer photography already in modern, compressed formats; `next/image`
  handles WebP/AVIF negotiation automatically for supported browsers, so
  don't manually pre-convert unless serving a static asset outside
  `next/image` (e.g. `favicon.svg`, the OG image itself, which social
  platforms fetch directly and don't get Next's optimization pipeline).
- Don't drop large uncompressed source files (multi-MB PNGs) into `public/`
  — compress before committing.

## Placeholder / perceived performance

For heavier photography (hero crossfade, product showcase), consider
`placeholder="blur"` with a generated `blurDataURL` to avoid a flash of
empty space while the image loads, consistent with the site's otherwise
polished, considered motion design (see `components/reveal.tsx` and the
`.shimmer-text`/`.mirror-shine` treatment for the general bar of polish
expected here).

## After changing images

Run the `visual-check` skill to confirm images render correctly across
viewport sizes and that nothing shifts on load, and `netlify-deploy-check`
if a new remote host was added, since `next.config.mjs` changes affect the
build.
