---
name: responsive-parity
description: Verify a section is as readable and usable on phone as on desktop — font scaling, tap targets, spacing, and no truncated/overflowing content. Use when adding or editing any section, and especially after the navbar mobile-menu fix, since the site had a real gap where mobile was worse than desktop.
---

# Responsive parity (phone == desktop)

The site already had one real mobile gap that's since been fixed (the
navbar hid all nav links and the CTA below `sm`/`md` with no menu — see the
git history for that fix). This skill exists so the next gap gets caught
before shipping, not after. The bar is: mobile should feel like a first-
class version of the design, not a shrunk desktop layout with things
quietly missing or unreadable.

## Breakpoints already in use

The whole site sticks to Tailwind's default three breakpoints —
`sm` (640px), `md` (768px), `lg` (1024px) — with no custom breakpoints.
Keep using these three rather than introducing an arbitrary `xl:` or a
custom pixel breakpoint; consistency here makes every section behave
predictably at the same widths.

## Checklist for any new or edited section

1. **Nothing conditionally disappears without a replacement.** Grep for
   `hidden` combined with a breakpoint prefix (`hidden md:flex`,
   `hidden sm:block`, etc.) in the component you're touching. Every time
   content is hidden below a breakpoint, ask: how does a mobile user reach
   the same content/action? (This is exactly the bug the navbar had.) If
   there's no answer, it's not "responsive," it's a mobile regression.
2. **Font scaling stays legible at the smallest realistic width (~375px,
   iPhone SE/mini).** Fluid units like `Hero`'s `text-[13vw]` need checking
   at the narrow end, not just skimmed — verify it doesn't overflow its
   container or collide with adjacent elements before the `sm:` override
   kicks in at 640px.
3. **Tap targets are large enough.** Interactive elements should have
   comfortable padding on mobile — the existing `Button` sizes (`sm`/`md`/
   `lg` from `components/ui/button.tsx`) and the FAQ accordion's `py-5`
   trigger are the reference bar; don't introduce a smaller custom
   touch target than those.
4. **No horizontal overflow.** Watch for fixed pixel widths
   (`w-[240px]`, `max-w-[140px]`, etc.) that aren't paired with a
   responsive override — `PhoneMockup`'s `w-[240px] sm:w-[270px]` is the
   right pattern (fixed but breakpoint-aware and small enough to fit any
   phone); a new fixed-width element should follow the same shape, not
   assume desktop width is available.
5. **Grids collapse sensibly, not just technically.** `PopularSalons`'
   `grid gap-6 sm:grid-cols-2 lg:grid-cols-4` and `ProductShowcase`'s
   `grid gap-10 lg:grid-cols-2` are the reference patterns — a new grid
   should collapse to a single column on mobile rather than cramming
   multiple narrow columns, and check the `sizes` attribute on any
   `next/image` inside it still matches the new column count (see
   `image-optimization`).
6. **Long content doesn't get clipped.** Check real (not lorem-ipsum)
   copy at mobile width for headings, badges, and stat labels — the
   `AnimatedCounter` labels and ticket-card category strings are examples
   of short text that must stay on one line or wrap gracefully, not
   truncate silently.

## Testing

Check at minimum: 375px (iPhone SE/mini), 390–430px (standard phones),
768px (tablet portrait, right at the `md` boundary), and 1024px+ (desktop).
Use the `visual-check` skill's browser access to actually resize/screenshot
at these widths rather than assuming Tailwind's responsive classes did the
right thing — a class being present isn't the same as the result looking
right.

## After a responsive fix

Cross-reference `accessibility-audit` for anything that overlaps (mobile
menu focus/ARIA, tap target sizing is both a responsive and an a11y
concern) rather than duplicating that review from scratch.
