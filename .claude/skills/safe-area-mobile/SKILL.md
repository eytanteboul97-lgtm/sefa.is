---
name: safe-area-mobile
description: Make fixed/edge-pinned UI on sefa.is respect notches, Dynamic Island, and home-indicator safe areas on modern phones. Use when touching Navbar, ScrollProgress, or any other fixed-position element, or when asked to fix notch/safe-area issues.
---

# Safe-area handling for notched phones

Two elements are pinned to the very edge of the viewport with no safe-area
awareness: `components/navbar.tsx` (`fixed top-0 inset-x-0 ... pt-4`) and
`components/scroll-progress.tsx` (`fixed left-0 right-0 top-0 z-[60]
h-[2px]`, actually rendered *above* the navbar in z-index). On an iPhone
with a notch or Dynamic Island — especially in landscape, where the notch
sits along the same edge these elements are pinned to — this hairline bar
and the navbar's top padding can end up clipped by or crammed against the
sensor housing instead of sitting cleanly below it.

## The fix has two required parts — don't do one without the other

CSS `env(safe-area-inset-*)` only resolves to a nonzero value if the
viewport meta tag opts in. Both parts are needed together:

1. **`app/layout.tsx`'s `viewport` export** needs `viewportFit: "cover"`:
   ```ts
   export const viewport: Viewport = {
     themeColor: "#17140F",
     width: "device-width",
     initialScale: 1,
     viewportFit: "cover",
   };
   ```
2. **Use the safe-area inset in the fixed elements' spacing**, added to
   (not replacing) the existing design spacing:
   - `Navbar`: change the header's top padding to combine the existing
     `pt-4` feel with the inset, e.g. via an inline style or an arbitrary
     Tailwind value: `style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}`
     on the `motion.header`, so it never sits tighter than the current
     design on non-notched devices but pushes down further when a real
     inset is present.
   - `ScrollProgress`: nudge its `top` the same way —
     `style={{ top: "env(safe-area-inset-top, 0px)" }}` merged with its
     existing `scaleX` style object (it already sets `style={{ scaleX }}`,
     so add `top` to that same object rather than introducing a second
     style prop).
3. If the mobile menu panel (`components/navbar.tsx`'s `motion.nav
   id="mobile-menu"`) or any future bottom-pinned UI is added, apply the
   same treatment with `env(safe-area-inset-bottom)` for the home-indicator
   area on iPhones without a physical home button.

## Don't over-apply this

Only elements that are actually `fixed`/pinned to a screen edge need this
— regular in-flow content (every section in `app/page.tsx`) already
respects normal document flow and doesn't need `env()` anywhere. Adding
safe-area padding to non-fixed elements is a no-op at best and an
unnecessary layout change at worst.

## Testing

`env(safe-area-inset-*)` is 0 on desktop browsers and most Android devices
— it can't be visually verified in a generic desktop screenshot. Use
Chrome DevTools' device toolbar with an iPhone preset (which simulates the
inset) or, if available, an actual notched-device test via the
`visual-check` skill's browser access with the viewport's `isMobile`/
device-emulation options — checking that the navbar and progress bar sit
visibly clear of the simulated notch area in both portrait and landscape.
