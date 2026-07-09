---
name: seo-structured-data
description: Add or extend JSON-LD structured data on sefa.is (FAQPage, Organization) so real existing content earns rich snippets in search results. Use when asked to improve SEO/structured data/rich snippets, or when touching the JSON-LD in app/layout.tsx or the FAQ content in components/faq.tsx.
---

# SEO structured data

`app/layout.tsx` currently emits a single, minimal `WebSite` JSON-LD block.
Meanwhile `components/faq.tsx` already has five real, well-written Q&A
pairs sitting unused for SEO purposes — that's a concrete, fast structured-
data win: a `FAQPage` schema can make Google show these questions directly
in search results (an accordion under the listing) with zero new copy
needed, just markup.

## Add FAQPage schema from the real FAQ content

Don't hand-type the questions/answers a second time in `layout.tsx` — that
creates exactly the kind of drift `seo-metadata-update` already warns
about for the rest of the metadata. Instead:

1. Extract the `faqs` array out of `components/faq.tsx` into a shared
   location (e.g. `lib/faq-data.ts`) so it has one source of truth.
2. Import it both in `FAQ` (for the rendered accordion) and wherever the
   JSON-LD is emitted.
3. Render a second `<script type="application/ld+json">` with a
   `FAQPage` schema built from that same array:
   ```ts
   {
     "@context": "https://schema.org",
     "@type": "FAQPage",
     mainEntity: faqs.map((f) => ({
       "@type": "Question",
       name: f.q,
       acceptedAnswer: { "@type": "Answer", text: f.a },
     })),
   }
   ```
   Since `FAQ` is a client component (`"use client"`, for the Radix
   Accordion) but `app/layout.tsx` / `app/page.tsx` are server components,
   the simplest correct place for this script is inline in `app/page.tsx`
   (a server component) right where `<FAQ />` is rendered, importing the
   same shared `faqs` data — not inside the client component itself.
4. If the FAQ copy changes, the schema updates automatically since it's
   generated from the same array — that's the point of extracting it.

## Organization schema — only what's real

Add an `Organization` block alongside the existing `WebSite` one in
`app/layout.tsx`, but only with fields that are actually true today:
`name: "Sefa"`, `url: siteUrl`, and `logo` (point it at a real asset —
`/favicon.svg` or a dedicated logo export, see `logo-polish`). Do **not**
add a `sameAs` array of social profile URLs — `components/footer.tsx`
currently links "Instagram" etc. to `href="#"` placeholders, not real
profiles (see `CLAUDE.md`'s no-fabricated-assets rule). Add `sameAs` only
once real social URLs exist; a schema pointing at nonexistent profiles is
worse than no schema at all for search engines' trust signals.

## Validate before considering it done

After adding/editing JSON-LD, validate the actual rendered HTML (view
source or Google's Rich Results Test) rather than just eyeballing the
object literal — a JSON-LD script with a typo'd key or missing `@type`
fails silently (no runtime error, just no rich snippet), so this is easy
to ship broken without noticing.

## After a structured-data change

Cross-reference `seo-metadata-update` for the rest of the metadata object,
and re-run `npm run build` — structured data lives in server-rendered HTML,
so a build/type error here would be caught the same way as any other
`app/` change.
