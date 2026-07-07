# Sefa — premium beauty-tech redesign

Full redesign in English: cinematic Ken Burns hero (real editorial
photography, no fabricated video links), a new AI section, a two-typeface
logo and a warm cream / deep noir / gold palette.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Production build: `npm run build && npm start`.

A `netlify.toml` is already configured at the project root for a direct
Netlify deploy — see the note at the bottom of this file if your project
folder isn't at the root of your Git repository.

## What's honestly not included (and why)

- **No real filmed video.** This environment has no access to stock-video
  libraries (Pexels, Artgrid, Coverr...), so I couldn't verify a video
  link would actually load. Instead, `components/hero-photos.tsx` runs a
  slow Ken Burns crossfade across real editorial beauty photography — a
  working, honest stand-in. Swap the `slides` array for real `<video>`
  sources once footage is shot.
- **No Spline scene.** Spline scenes are built and hosted on Spline's own
  platform with an account — they can't be generated from here. An earlier
  pass added a hand-built Three.js beauty scene as a stand-in
  (`components/beauty-scene.tsx`), but it was purely decorative floating
  objects with no functional or narrative purpose, so it was removed —
  don't reintroduce a 3D scene unless it's actually load-bearing for the
  design, not decoration for its own sake.
- **No guaranteed Lighthouse 95+.** Between the pinned scroll section
  (`ProductShowcase`) and the hero photo crossfade, there's still a real
  trade-off against raw performance. Test it yourself with the Lighthouse
  plugin Netlify offers on your dashboard, and dial back animations if a
  specific score matters more than the visual richness.

## Logo

Three directions were explored; the two-typeface fusion was kept:
"Se" in Playfair Display italic (editorial luxury) fused into "FA" in
Space Grotesk (geometric, technological), with a single gold diamond
marking the seam between the two. See `components/logo.tsx`.

## Netlify deployment note

If your project folder isn't at the root of your GitHub repository,
point `netlify.toml` at it explicitly:

```toml
[build]
  base = "path/to/folder"
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

`publish` stays relative to `base` — never repeat the `base` path inside it.
Simplest fix if things get tangled: delete the GitHub repository and
re-upload this project fresh at the repo root, then import it into a new
Netlify site — that's the cleanest path.
