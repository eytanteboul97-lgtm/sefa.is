---
name: netlify-deploy-check
description: Validate and troubleshoot the Netlify deployment config for sefa.is (netlify.toml, base/publish paths, build command). Use when the user asks about deploying to Netlify, a Netlify build failing, or moving the project within its repo.
---

# Netlify deployment check

This is a Next.js 14 App Router project deployed to Netlify via
`@netlify/plugin-nextjs`. This skill is about validating the *configuration
in this repo* — it cannot access the user's actual Netlify account/dashboard,
build logs, or live site status. Always say so explicitly rather than
guessing whether a site is live or a deploy succeeded.

## Baseline config (current, at repo root)

```toml
[build]
  command = "npm run build"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## Checks to run

1. **Is the project at the repo root?** If `package.json` is at the root
   (current state), `netlify.toml` needs no `base`/`publish` overrides — the
   plugin handles `.next` output automatically. If the Next.js app has been
   moved into a subfolder, `netlify.toml` MUST be updated:
   ```toml
   [build]
     base = "path/to/folder"
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```
   `publish` stays **relative to `base`** — never repeat the `base` path
   inside `publish` (a common mistake, e.g. `publish = "path/to/folder/.next"`
   when `base` is already set — this double-nests and breaks the build).
2. **Build command matches `package.json`**: confirm `npm run build` maps to
   `next build` in `package.json` scripts — don't let these drift apart.
3. **Node version**: if the build fails on Node version mismatches, check for
   a `.nvmrc` or `NODE_VERSION` env var; none exists by default in this repo,
   so Netlify uses its own default — only add one if a real version conflict
   is diagnosed.
4. **Image remote patterns**: if build/runtime errors mention blocked remote
   images, check `next.config.mjs`'s `images.remotePatterns` — currently only
   `images.unsplash.com` is allowed. Any new external image host needs to be
   added there before Next.js will render it.
5. **Environment variables**: this project currently has no required env vars
   (no `.env.example`, no backend). If someone asks to add one, confirm it's
   actually needed (there's no server/API layer yet) before wiring it into
   Netlify's dashboard env settings — don't invent env vars speculatively.

## What this skill cannot do

- Cannot check whether a Netlify site is actually connected to this GitHub
  repo, or whether the last deploy succeeded — that requires the Netlify
  dashboard/API, which isn't accessible here.
- Cannot trigger a real deploy — only `npm run build` locally to catch
  build-time errors before they'd surface on Netlify.

## Local pre-deploy check

Before advising someone to push, run `npm run build` locally and treat a
clean build as the strongest available signal that the Netlify build will
also succeed — but state clearly that it's not a guarantee (Netlify's Node
version/environment can differ).
