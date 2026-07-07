---
name: photo-treatment
description: Make photography on sefa.is feel like one cohesive visual system — smooth, consistent crossfade/scroll transitions and a shared warm color grade across all photos (hero, salon cards, testimonials), instead of raw, uncorrected stock images. Use when adding new photos, touching any image transition, or asked to make images look more polished/consistent.
---

# Photo treatment: transitions + color typology

Right now the site's photography is a mix of raw Unsplash images with no
shared color treatment — the hero crossfade gets a strong `bg-ink/72` scrim
that ties it into the warm/noir palette, but `TicketCard` (salon photos) and
`Testimonials` (avatars) show completely uncorrected stock photos next to
that same palette. This skill is about closing that gap: every photo on the
site should read as part of the same warm cream/noir/gold system, and every
photo transition should feel deliberate, not like a generic carousel.

## Color typology: one grade across all photography

Add a shared treatment (a CSS class in `app/globals.css`, alongside
`.glass`/`.shimmer-text`/etc.) that any photo container can opt into:

```css
.photo-grade {
  position: relative;
}
.photo-grade::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, rgba(23,20,15,0.18), rgba(183,147,85,0.12));
  mix-blend-mode: multiply;
  pointer-events: none;
}
```

This uses the existing `ink` (#17140F) and `gold` (#B79355) tokens, not new
colors — the goal is a subtle warm/dark wash that makes any stock photo
look like it belongs to this palette rather than a neutral daylight photo.
Tune the opacity/angle per component rather than copying these numbers
blindly; the point is consistency, not a single magic value. Apply it to:

- `TicketCard`'s image wrapper (currently raw `object-cover`, no treatment)
- `Testimonials`' avatar images (currently raw, tiny — a lighter touch may
  be enough here, or skip if 40px avatars make the effect invisible)
- Any future gallery/section photo

`HeroPhotos` already achieves a similar effect via its own scrim + gradient
— don't double up the treatment there, but keep the same visual target
(warm, dark-leaning, never a neutral/cool-toned photo sitting untouched
next to the rest of the palette).

## Smooth, deliberate transitions

`HeroPhotos` already has the reference pattern: `AnimatePresence` +
crossfade opacity + slow Ken Burns scale, gated by `useReducedMotion` (see
`hero-photos.tsx`). When adding a new photo transition (a gallery, a
before/after slider, a new crossfade), match its feel rather than inventing
a different timing language:

- Use the site's standard ease curve, `[0.16, 1, 0.3, 1]` (already used in
  `Reveal`, `ProductShowcase`, `Navbar`) for opacity/position transitions —
  don't default to Framer Motion's built-in ease or a linear curve for
  anything except a continuous ambient effect like the Ken Burns zoom
  itself (which intentionally uses `linear` because it's a constant drift,
  not a discrete transition).
- Crossfade, don't cut — a hard image swap reads as broken/unfinished on a
  site this polished. If two images can't overlap technically (e.g. a CSS
  `background-image` swap), fade through a brief opacity dip rather than
  an instant replace.
- Respect `prefers-reduced-motion` exactly like `HeroPhotos` does: shorten
  or remove continuous motion (zoom, auto-advance timers) while keeping a
  simple crossfade for the actual content change — see the
  `useReducedMotion` branch already in `hero-photos.tsx` for the pattern.
- Pair every new photo transition with a `placeholder="blur"` per the
  `image-optimization` skill — a crossfade into a hard pop-in defeats the
  point.

## After a photo-treatment change

Run `visual-check` to confirm the grade doesn't crush shadow detail or make
faces/products illegible (a warm wash is meant to unify, not obscure), and
check it against both a light and dark surrounding section since the site
alternates `paper` and `ink` backgrounds.
