---
name: logo-polish
description: Improve the sefa.is logo/wordmark and its consistency across every place it appears (navbar, footer, favicon, and any future OG image/app icon). Use when asked to improve, refine, or export the logo, or when touching components/logo.tsx or public/favicon.svg.
---

# Logo polish

The wordmark (`components/logo.tsx`) is a deliberate two-typeface signature
— "Se" in Playfair Display italic fused into "FA" in Space Grotesk, with a
gold diamond marking the seam (see the comment at the top of that file for
the full rationale). It's already a considered design; this skill is about
making it consistent everywhere it's used and giving it real staying power,
not redesigning it from scratch.

## Known gaps to close

1. **No exportable asset.** The logo only exists as live JSX/CSS
   (`components/logo.tsx`) — there is no standalone SVG/PNG lockup usable
   for the still-missing OG image (`/public/og-image.jpg`, see
   `seo-metadata-update` / `image-optimization`), app icons, or anywhere
   outside a rendered page. When asked to fix the OG image or add app
   icons, produce a real static export of this same wordmark + diamond
   mark rather than a different, disconnected graphic.
2. **Favicon is a simplified variant, not generated from one source.**
   `public/favicon.svg` (dark circle + gold diamond) shares the diamond
   motif but is hand-maintained separately from `logo.tsx`. There's also
   only a single SVG favicon — no `apple-touch-icon`, no maskable/PWA icon,
   no fallback PNG for browsers that don't support SVG favicons. If adding
   a fuller icon set, derive every size from the same mark (circle + gold
   diamond) rather than introducing a new visual treatment.
3. **Color values are duplicated by hand in three places.** The gold hex
   appears as `#B79355`/`#D4B87B` inline in `logo.tsx`'s SVG `fill`, again
   in `favicon.svg`, and as the `gold`/`gold.light` tokens in
   `tailwind.config.ts`. Inline SVG `fill` can't reference Tailwind classes,
   so exact duplication is somewhat unavoidable — but if `tailwind.config.ts`'s
   `gold` values ever change, grep for these two hex strings and update
   `logo.tsx` and `favicon.svg` in the same change, don't let them drift.
4. **Fully static.** The site has an established polish vocabulary for gold
   accents (`.shimmer-text`, `.mirror-shine` in `app/globals.css`) that the
   logo doesn't use at all. A subtle treatment — e.g. the diamond catching
   a `.mirror-shine`-style sweep on hover, or a one-time gentle shimmer on
   first paint — would match the bar set elsewhere, as long as it respects
   `prefers-reduced-motion` (skip/replace with a static state, same pattern
   as `hero-photos.tsx`'s `useReducedMotion` branch) and doesn't fire
   repeatedly/distractingly on every re-render.

## Check every usage site when changing the mark

`Logo` is currently used in two places — `components/navbar.tsx` (`<Logo dark />`,
sized via the parent's `text-2xl`) and `components/footer.tsx` (`<Logo />`,
default/light variant). Both rely on the component's `em`-based sizing
(`text-[1.15em]` etc.) scaling with the parent's font size rather than a
fixed pixel size — preserve that when editing, and visually check both
usages (not just whichever one you're looking at) since the `dark` prop
changes the diamond's shade (`#D4B87B` vs `#B79355`) for contrast against
different backgrounds.

## Accessibility

The component already sets `aria-label="Sefa"` on the outer `<span>` with
the decorative diamond `aria-hidden="true"` — this is the correct pattern
(the `aria-label` gives screen readers the clean word "Sefa" instead of
"Se FA" fragments or the SVG). Preserve both attributes if refactoring;
don't let a screen reader end up hearing the two typeface halves announced
separately or the diamond described as an image.

## After a logo change

Run `visual-check` against both the navbar and footer usages, at a couple
of sizes, and in both light and dark contexts — and re-check the favicon
tab in a real browser (it's easy to update the wordmark and forget the
favicon still shows the old mark).
