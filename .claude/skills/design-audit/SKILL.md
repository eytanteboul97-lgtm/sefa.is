---
name: design-audit
description: Audit a component or diff in sefa.is for adherence to the project's design system (color tokens, font roles, cn() usage, shared utility classes). Use before finalizing UI changes, or when asked to review/clean up styling.
---

# Design system audit

Sefa has a deliberate, centralized design system. This skill checks that new
or edited code stays consistent with it instead of drifting into one-off
styles.

## What to check

1. **Colors**: every color must resolve to a token defined in
   `tailwind.config.ts` — `paper`, `beige`, `ink` / `ink-soft`, `night` /
   `night-soft`, `coral` / `coral-dim`, `teal` / `teal-deep`, `gold` /
   `gold-light`, `pearl`. Flag any raw hex codes, `text-white`/`bg-black`
   used where a token fits better, or Tailwind default palette colors
   (`bg-blue-500`, `text-red-600`, etc.) that aren't part of this palette.
2. **Fonts**: check the right font role is used for the content type —
   `font-luxury` (Playfair Display) for editorial/hero headlines,
   `font-display` (Space Grotesk) for UI/tech labels and emphasis,
   `font-body` (Inter) for body copy, `font-accent` (Fraunces italic) for
   special accents. Flag arbitrary `font-[...]` values.
3. **className composition**: any conditional, merged, or prop-driven
   className must go through `cn()` from `@/lib/utils` (clsx + tailwind-merge)
   — flag manual template-string concatenation or `+` on classNames.
4. **Reuse before reinventing**: check whether an existing utility class in
   `app/globals.css` already does what a new inline style/`<style>` block is
   trying to do — `.glass` / `.glass-dark` (frosted panels), `.ticket` +
   `.ticket-notch--left/right` (appointment stub), `.shimmer-text` (gold
   shimmer), `.mirror-shine` (button hover sweep), `.gold-line` (hairline
   border), `.tilt-card` (3D hover tilt), `.band-divider` (tri-color divider).
   Flag reimplementations of these effects.
5. **Shared primitives**: buttons should use `components/ui/button.tsx`
   (`variant`: `primary`/`dark`/`ghost`/`outline`, `size`: `sm`/`md`/`lg`),
   not raw `<button className="...">`. Reveal-on-scroll animations should use
   `components/reveal.tsx`, not ad hoc `motion.div` + `whileInView` copies.
6. **Reduced motion**: any new custom CSS animation/transition should be
   covered by the blanket `@media (prefers-reduced-motion: reduce)` rule at
   the bottom of `globals.css` (it already collapses all animation/transition
   durations globally) — don't add a `will never respect reduced motion`
   inline animation that bypasses this (e.g. via JS-driven timers instead of
   CSS transitions/animations, or Framer Motion animations gated only by a
   custom check that ignores the OS setting).
7. **Path imports**: use the `@/` alias, not relative `../../` paths.

## Output

Report findings as a short list: file, line, what's off, and the token/
utility/pattern that should be used instead. Don't rewrite unrelated code
while auditing — flag only, unless asked to also fix.
