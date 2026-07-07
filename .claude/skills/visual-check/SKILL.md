---
name: visual-check
description: Visually verify a UI change to sefa.is by running the dev server and viewing/screenshotting the affected section in a real browser. Use before reporting any styling, layout, animation, or new-section change as complete.
---

# Visual verification

This is a visual, marketing-focused site — type-checking and `npm run build`
passing does NOT mean a change looks right. Always verify UI changes in an
actual browser before calling them done, per the project's own testing
philosophy (there is no automated test suite here; visual review is the only
verification available).

## Steps

1. Start the dev server if it isn't already running:
   ```bash
   npm run dev
   ```
   (defaults to `http://localhost:3000`). Run it in the background so you can
   continue interacting with the browser.
2. Use the pre-installed Chromium via Playwright
   (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers` is already configured in this
   environment — do not run `playwright install`) to open
   `http://localhost:3000` and navigate/scroll to the affected section.
3. Check the golden path first: does the section render, is copy legible
   against its background (`ink`/`paper`/`night` combinations), do CTAs use
   the shared `Button` styling correctly, does layout hold at both mobile
   and desktop widths (this site is `sm`/`md`/`lg` responsive throughout).
4. Check edge cases relevant to a landing page:
   - Reduced-motion: emulate `prefers-reduced-motion: reduce` and confirm
     animations collapse instead of breaking layout (the global CSS rule in
     `app/globals.css` should handle this, but scroll-triggered Framer
     Motion/GSAP effects can still behave oddly — verify).
   - Narrow viewport (mobile) and very wide viewport, since sections use
     custom breakpoints (`sm:`, `md:`, `lg:` prefixes) rather than a rigid
     grid.
   - If the change touches the hero, check both the `BeautyScene` (three.js,
     `ssr: false`, loads client-side only) and the `HeroPhotos` crossfade.
5. Take a screenshot of the before/after (or just after, if there's no
   meaningful before) and describe what you observed — don't just say
   "looks good," name what you actually checked (contrast, spacing,
   responsiveness, animation behavior).
6. Stop the dev server (or leave it running in the background) when done,
   and mention its state to the user.

## Don't

- Don't claim a UI change is verified based on `npm run build` or TypeScript
  passing alone — those catch compile errors, not visual regressions.
- Don't skip this for "small" CSS tweaks — small Tailwind class changes are
  exactly the kind of thing that silently breaks contrast or spacing.
