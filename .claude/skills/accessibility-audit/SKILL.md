---
name: accessibility-audit
description: Audit sefa.is for accessibility issues (contrast, keyboard navigation, ARIA, mobile navigation, semantic structure). Use when asked to improve accessibility/a11y, before finalizing new interactive components, or when reviewing existing sections for real usability gaps.
---

# Accessibility audit

This is a publicly indexed marketing site (`robots: index, follow`) with
real, fixable accessibility gaps already present in the codebase — this
skill exists to find and close them, not just recite generic WCAG advice.

## Known, concrete gaps (check these first)

1. **No mobile navigation.** `components/navbar.tsx` hides the nav links
   (`hidden md:flex`), the language toggle (`hidden sm:block`), and the
   primary CTA button (`hidden sm:inline-flex`) below their breakpoints —
   with no hamburger menu or any alternative way to reach them on mobile.
   This isn't just an a11y nicety, it's a real conversion bug: mobile
   visitors currently cannot reach "List your salon" at all from the navbar.
   Fixing this (a mobile menu button with proper `aria-expanded`,
   `aria-controls`, and focus trapping while open) is one of the highest-
   impact single fixes available in this codebase.
2. **`ProductShowcase`'s tabs aren't real tabs.** `package.json` already
   depends on `@radix-ui/react-tabs`, but `components/product-showcase.tsx`
   implements its own tab row with plain `<button onClick>` — no
   `role="tablist"`/`role="tab"`/`aria-selected`, and no arrow-key
   navigation between tabs. A screen reader user hears an unrelated row of
   buttons instead of a tab group. Prefer migrating this to the already-
   installed Radix `Tabs` primitive (same approach as `FAQ`'s use of Radix
   `Accordion`) over hand-rolling ARIA state.
3. **The language toggle button does nothing.** The `עב` button in
   `navbar.tsx` is a real `<button>` with no `onClick` and no `aria-label`
   beyond its own text — a screen reader announces a functional-sounding
   button that's actually inert (there's no real i18n routing yet, see
   `CLAUDE.md`). Either wire it to something real, or mark it honestly
   (`aria-disabled="true"` and/or a label like "Hebrew — coming soon")
   rather than leaving a silent dead control.

## Contrast

The palette (`ink` #17140F on `paper` #F6EFE4) is high-contrast at full
opacity, but a lot of secondary text uses low-opacity Tailwind modifiers —
`text-ink/35`, `/40`, `/45`, `/50`, `/55`, `/60`, `/65`, `/70` — which blend
toward the background and can quietly drop below WCAG AA (4.5:1 for body
text, 3:1 for large/bold text). When touching any text using one of these,
compute the actual blended contrast against its real background (not just
against `paper`/`ink` — glass panels, dark hero sections, and colored cards
all shift the effective background) before assuming it's fine. `ink/35` and
`ink/40` in particular (used for inactive states, e.g. the inactive tab
label in `ProductShowcase`) are worth specifically re-checking.

## Focus states

`app/globals.css` defines a global `:focus-visible` style (gold outline,
`outline: 2px solid #b79355`) — this is good and should be preserved.
Grep for `outline-none` before adding one; if a component needs to suppress
the default browser outline for custom styling, it must supply an
equivalent visible focus treatment, never remove focus indication entirely.

## Semantic structure

- One `<h1>` (in `Hero`), `<h2>` per section title — keep this hierarchy
  when adding sections via the `add-section` skill; don't skip to `<h3>`
  for a new section's main heading.
- Landmarks already exist (`<nav>` in `Navbar`, `<main>` in `app/page.tsx`,
  presumably a `<footer>` in `Footer`) — keep new sections inside `<main>`,
  don't add a second `<nav>` or `<main>`.
- Prefer existing accessible primitives (Radix `Accordion` in `FAQ`, Radix
  `Tabs` where tab-like UI is needed) over hand-built interactive widgets —
  they come with correct ARIA and keyboard handling for free.

## Icons and images

- Decorative icons sitting next to text that already conveys the same
  meaning (e.g. `lucide-react` icons like `Sparkles`, `BellRing`, `Check`,
  `ChevronDown` used throughout) should be `aria-hidden="true"` so screen
  readers don't announce a redundant icon name — check for this when
  touching a component that pairs an icon with a label.
- Image `alt` text and layout-shift concerns are covered by the
  `image-optimization` skill — cross-reference it rather than duplicating
  those checks here.

## Motion

`prefers-reduced-motion` handling (the global CSS override, `SmoothScroll`,
`HeroPhotos`, `ProductShowcase`'s GSAP check) is also an accessibility
concern (vestibular disorders), not just a performance one — when auditing
a11y, verify new animated components actually check for it rather than
assuming it's someone else's job.

## Forms

Any input added (waitlist email capture, founding-program signup, etc.)
needs a real associated `<label>` (visually hidden via `sr-only` if the
design calls for placeholder-only visuals) — a `placeholder` alone is not
an accessible label and disappears once the user starts typing.

## After an accessibility fix

Verify with the `visual-check` skill using keyboard-only navigation (Tab/
Shift+Tab/Enter/Arrow keys, no mouse) through the changed section, not just
a visual look — a change can look right and still be unreachable by
keyboard or announce nothing useful to a screen reader.
