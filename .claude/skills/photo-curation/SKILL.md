---
name: photo-curation
description: Choose or replace the actual stock photography on sefa.is so every photo feels premium and belongs to the same visual set, instead of generic, mismatched stock images. Use when asked to fix/improve/replace the site's photos, or when the current image bank is called out as inconsistent or low-quality.
---

# Photo curation

The site's actual photo *content* (not just its color treatment — see
`photo-treatment` for that layer) has a known, confirmed problem: the
current Unsplash photos are generic and don't cohere as one set. This skill
is the criteria and process for fixing that — it deliberately does not
pick photos itself when written, because photo curation requires actually
loading and looking at candidate images, which this environment could not
do (`unsplash.com` returned 403 on every path tested — same restriction
`README.md` already documents for stock video). Whoever has real browsing
access (the user, or a future session with different network access) should
use this skill's criteria rather than grabbing generic results.

## Hard rule: verify before committing

Never wire in an image URL (or photo ID recalled from memory/training)
without actually loading it and confirming both that it resolves and that
it shows the right subject — a URL that "should" show a hair salon based on
its slug/ID is not verified. This is the same discipline `video-integration`
already requires for video sources; it applies equally here. A broken or
mismatched photo is worse than the current generic-but-working one.

## Full current inventory (replace like-for-like, don't miss one)

Twelve hardcoded `images.unsplash.com` URLs exist across three files:

- `components/hero-photos.tsx` — 5 slides (`slides` array), full-bleed
  hero background, Ken Burns crossfade, seen first and largest. These set
  the tone for the entire site — they need to look editorial, not
  stock-catalog.
- `components/popular-salons.tsx` — 4 salon card images (`salons` array),
  each paired with a name/category (e.g. "Maison Glow" / "Hair · Colour ·
  Tel Aviv"). The photo should plausibly match its category (a nails photo
  for the nails salon, not a generic interior for all four).
- `components/testimonials.tsx` — 3 small avatar images (`quotes` array),
  40×40px. Low stakes individually, but should still match the same warm
  tone as everything else, not a cool/neutral daylight headshot.

## What makes the current set feel generic/incoherent

Reject candidates that show any of these — they're the actual complaints
about the current set:

- **Mixed lighting temperature.** Warm golden-hour tones next to cool
  blue/fluorescent studio lighting in the same carousel or grid reads as
  mismatched. Pick photos that already lean warm/neutral, since the
  `.photo-grade` overlay (see `photo-treatment`) can nudge tone slightly
  but can't fix a fundamentally cool-lit photo.
- **Generic "stock corporate" staging.** Camera-facing forced smiles,
  obviously staged poses, isolated product-on-white-background shots — none
  of that matches an editorial-luxury brand voice (see `copy-tone-check`
  for the equivalent bar on copy). Prefer candid-feeling, editorial
  compositions: real hands mid-task, considered negative space, natural
  light.
- **Inconsistent framing/subject distance across the same group.** The 4
  salon cards and 5 hero slides should each internally share a similar
  crop distance and composition style (e.g. all medium-close, all with
  similar negative space for text/badges) — not one tight close-up next to
  three wide interior shots.
- **Visible unrelated branding, text, or watermarks** in the photo itself.
- **Content that doesn't match its caption.** A hero slide captioned around
  "hair, makeup, facials, nails, barbering" (per the comment in
  `hero-photos.tsx`) needs each slide to actually represent one of those,
  not five similar-looking generic salon-interior shots.

## What to look for instead

- Warm, neutral-to-golden lighting consistent with the `paper`/`ink`/`gold`
  palette in `tailwind.config.ts`.
- Editorial composition: intentional negative space, natural gestures,
  shallow depth of field where it isolates a single beauty action (a
  blowout mid-motion, hands applying polish) rather than a static room.
  shot.
- A believable, specific match to context: the right treatment for each
  hero slide's implied category, the right salon "feel" for each card's
  category label.

## After replacing photos

Run `photo-treatment` to reapply/tune the `.photo-grade` overlay against
the new images (a warm photo may need a lighter touch than a neutral one),
`image-optimization` to confirm `alt` text actually describes the new
content and blur placeholders still make sense, and `visual-check` to
confirm the full set reads as one coherent system side by side — check the
hero crossfade and the 4-card grid in the same viewport, not one image at
a time in isolation.
