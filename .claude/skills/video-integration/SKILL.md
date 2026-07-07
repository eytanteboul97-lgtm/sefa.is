---
name: video-integration
description: Integrate a real video (self-hosted file, or YouTube/Vimeo embed) into sefa.is, most likely replacing or supplementing the hero photo crossfade. Use only once a real, working video source exists — a local file, a purchased/licensed stock clip, or a real platform URL the user provided. Never fabricate or guess a video URL.
---

# Video integration

The hero currently uses a Ken Burns photo crossfade
(`components/hero-photos.tsx`) specifically because no verified, working
video source was available when it was built (see `README.md`, "What's
honestly not included and why"). This skill exists for the moment that
changes — it does NOT include finding or generating a video.

## Hard rule: never fabricate the source

- Do not invent a stock-video URL, guess a CDN path, or paste in a "probably
  works" link. If the user hasn't given you an actual file or a real,
  user-provided URL, stop and ask for one — don't improvise.
- If a URL is provided, verify it actually resolves/loads before wiring it
  into the component (fetch it, check content-type is a video format, check
  it isn't a 404/placeholder page) rather than trusting it blindly.
- If a local file is provided, confirm it exists on disk and is a reasonable
  size for the web (see weight guidance below) before using it.

## Option A: self-hosted `<video>` file

Use this when the user has an actual exported file (mp4/webm).

1. Place the file in `public/` (e.g. `public/hero.mp4`). Keep it reasonably
   compressed — a hero background loop should generally stay well under
   10MB; re-encode with a sane bitrate/resolution (e.g. 1920×1080, H.264,
   ~2–4 Mbps) if the source is heavier, and mention this to the user rather
   than silently shipping a huge file.
2. Replace (or sit alongside, see "Fallback" below) the `HeroPhotos`
   crossfade with a `<video>` element matching its container/positioning:
   ```tsx
   <video
     autoPlay
     muted
     loop
     playsInline
     preload="auto"
     poster="/hero-poster.jpg"
     className="absolute inset-0 h-full w-full object-cover"
   >
     <source src="/hero.mp4" type="video/mp4" />
   </video>
   ```
   `muted` + `playsInline` are required for autoplay to work on mobile
   Safari/Chrome — don't drop them. Provide a real `poster` frame (matches
   the "no flash of empty space" bar set by the `image-optimization` skill's
   blur-placeholder work) — extract a representative frame from the video
   itself, don't reuse an unrelated stock photo.
3. Keep the same overlay treatment already in `hero-photos.tsx`
   (`bg-ink/72` scrim + bottom gradient) so text contrast over the hero
   doesn't regress.
4. Respect `prefers-reduced-motion`: pause or hide the video and show the
   `poster` frame (or fall back to a single static photo) when the user has
   reduced motion enabled — same principle already applied to the Ken Burns
   zoom (see the `useReducedMotion` handling added in `hero-photos.tsx`).
   A looping autoplay video is exactly the kind of motion that setting exists
   to suppress.

## Option B: YouTube / Vimeo embed

Use this only for a real, user-provided video URL (e.g. an existing brand
video already hosted on YouTube/Vimeo) — appropriate for a dedicated
"watch the demo" section, not as a silent autoplay hero background (embeds
add third-party script weight and tracking that's a poor fit for an
always-visible hero, and autoplay-with-sound embeds are broadly blocked by
browsers anyway).

1. Lazy-load the embed — don't inject the YouTube/Vimeo iframe on initial
   render. Show a clickable thumbnail (the video's real poster/thumbnail,
   fetched from the platform's oEmbed/thumbnail API, not a fabricated one)
   and only mount the `<iframe>` on click.
2. Use `loading="lazy"` on the iframe once mounted, and set `title` for
   accessibility.
3. Match the site's `.glass`/`.ticket`/rounded-corner treatment for the
   thumbnail container so it doesn't look like a bolted-on generic embed.

## Fallback behavior

Whichever option is used, keep a graceful fallback: if the video fails to
load (network error, unsupported format), fall back to a static frame or to
the existing `HeroPhotos` crossfade rather than leaving a blank/broken box.
A `<video>`'s `onError` handler or a simple feature-detect before rendering
it is enough — don't over-engineer this into a generic media-fallback
system.

## After integrating

Run the `visual-check` skill across viewport sizes and with
`prefers-reduced-motion` emulated, and update `README.md`'s "What's honestly
not included and why" section to remove the video caveat once real footage
is actually in place — don't leave stale documentation claiming there's no
real video after there is one.
