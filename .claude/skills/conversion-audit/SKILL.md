---
name: conversion-audit
description: Check that every section of sefa.is pushes toward a clear, working action (waitlist, salon signup) with consistent CTA language and visible social proof. Use when asked to improve conversion, review CTAs, or when adding/editing any button, form, or section with a call to action.
---

# Conversion audit

This is a marketing site whose entire job is to move two audiences —
consumers and salon owners — toward an action. A CTA that looks right but
does nothing is worse than no CTA, because it teaches the visitor the site
doesn't work. This skill exists because that exact bug is already present
in more than one place.

## Known gap: several primary CTAs go nowhere

`Button` renders a plain `<button>` with no `href`/`onClick` unless one is
passed. Several of the site's most prominent CTAs currently pass neither:

- **`components/hero.tsx`'s two main buttons** — "Discover a salon" and
  "For salon owners" — are the very first interactive elements a visitor
  sees, and neither does anything. They should anchor-link to the sections
  that already exist for exactly this purpose: `#salons`
  (`components/category-grid.tsx` has `id="salons"`) and `#for-salons`
  (`components/salon-owner-features.tsx` has `id="for-salons"`) — the same
  anchors `Navbar`'s own link list already targets. This is the single
  highest-impact fix available under this skill: wrap them in `<a
  href="#salons">`/`<a href="#for-salons">` (or pass an `asChild`-style
  anchor) so the very first thing a visitor can click actually goes
  somewhere.
- **`components/founding-program.tsx`'s "Apply to the Founding Program →"**
  and **`components/smart-waitlist.tsx`'s "Notify me instead"** are also
  inert. At minimum, anchor them to `#signup` (the real email-capture form
  in `components/cta.tsx`) so clicking them takes the visitor to the one
  place on the site that actually captures a lead, rather than a dead end.

This isn't a call to fake a working backend — per `CLAUDE.md`, this site is
intentionally presentational with no real booking/backend. But an anchor
link to the site's one real capture form is honest and free; a button that
silently does nothing is not.

## Consistency checklist for any CTA you touch or add

1. **Every CTA either does something real (the `CTA` section's email form)
   or honestly points somewhere (an anchor to a relevant section)** — never
   ship a bare decorative button with no destination.
2. **Match CTA verb tense/voice across the funnel.** Existing patterns:
   "Discover a salon", "Start free →", "Apply to the Founding Program →",
   "Get 3 months free" — imperative, active, benefit-forward. Don't
   introduce a passive or vague CTA ("Learn more", "Click here") next to
   these.
3. **Consumer vs. salon-owner CTAs stay visually distinct where they
   coexist** (e.g. `Hero`'s primary/outline button pairing) so a visitor
   self-selects the right path instead of both paths looking identical.
4. **Repeat the core offer consistently.** "3 months free" / "No credit
   card" appears in `Pricing`, `FoundingProgram`, and `CTA` — if this offer
   changes, grep for all three and update together; a visitor who reads two
   different free-trial lengths on the same site trusts it less, not more.

## Social proof placement

The site already has real proof points wired up — `AnimatedCounter` stats
(`48,000+ appointments`, `620+ salons`, `4.9★`) in both `Hero` and
`Testimonials`, and named testimonials with real-sounding roles. When
adding a new section that makes a claim ("salons love Sefa", "clients book
in a breath"), back it with one of these existing proof points near the
claim rather than introducing a new, disconnected stat — and never invent
a new number that doesn't match the ones already established in `Hero`/
`Testimonials` (see `copy-tone-check`'s rule against unverifiable stats).

## After a conversion-focused change

Run `visual-check` to confirm the fixed CTA actually scrolls to the right
section (anchors can silently point at a typo'd `id`), and re-check on
mobile per `responsive-parity` — a CTA that works on desktop but is
unreachable/mis-tappable on mobile defeats the point.
