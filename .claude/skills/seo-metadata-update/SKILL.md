---
name: seo-metadata-update
description: Update SEO metadata, Open Graph tags, or JSON-LD structured data for sefa.is in app/layout.tsx. Use when the user asks to change the site title, description, keywords, social preview image, or structured data.
---

# SEO metadata update

All site-wide SEO/social metadata lives in one place: `app/layout.tsx`. There
is no per-page metadata yet (single-page site) — everything is defined once
at the root.

## Where things live

- `siteUrl`, `title`, `description` — top-level constants near the top of
  `app/layout.tsx`, reused throughout the `metadata` object. Update these
  first; everything else derives from them.
- `metadata.keywords` — array of SEO keyword phrases (currently booking/
  salon/Israel focused). Keep phrases specific and consistent with actual
  page content — don't keyword-stuff.
- `metadata.openGraph` / `metadata.twitter` — social preview cards. The OG
  image is referenced as `/og-image.jpg` at 1200×630 — if this file doesn't
  exist in `public/`, note that to the user rather than silently leaving a
  broken image reference.
- `metadata.alternates.languages` — currently declares `en` and `he`
  alternates pointing at the same `siteUrl` (no actual localized routes
  exist). Don't add more language entries here without also creating the
  corresponding routes/content — metadata should reflect reality.
- `viewport` export — theme color and viewport settings; rarely needs
  changes.
- The inline `jsonLd` object in `RootLayout` — a minimal `WebSite` schema.
  Keep `name`, `url`, `description`, and `inLanguage` in sync with the
  constants above if they change.
- `icons.icon` — points at `/public/favicon.svg`.

## Rules

1. Keep `title.default` and the `openGraph`/`twitter` titles consistent —
   don't let them diverge into different wording.
2. `description` is reused in three places (`metadata.description`,
   `openGraph.description`, `twitter.description`, and `jsonLd.description`)
   — update all four together, they should stay identical.
3. If adding a genuinely new page/route later (not just editing the single
   home page), give it its own `export const metadata` using
   `title: "Page Name"` so Next.js applies the `template: "%s · Sefa"`
   pattern already defined in the root metadata.
4. Don't fabricate social proof, review counts, or claims in metadata/JSON-LD
   that aren't backed by real content on the page (e.g. don't add
   `AggregateRating` schema unless real rating data exists).
5. After changing metadata, there's no automated check for this — mention to
   the user that social previews (OG image, title/description truncation)
   are best verified with a link-preview debugger tool if it matters for the
   change.
