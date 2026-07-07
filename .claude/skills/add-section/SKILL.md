---
name: add-section
description: Scaffold a new landing-page section for sefa.is (e.g. a new marketing block between existing sections). Use when the user asks to add a new section, block, or feature area to the home page.
---

# Add a landing-page section

Sefa's home page (`app/page.tsx`) is a flat stack of one-component-per-section
imports. Follow this exact pattern when adding a new one — don't invent a
different structure.

## Steps

1. **Name the file**: `components/<kebab-case-name>.tsx`, matching the style
   of existing sections (`beauty-rituals.tsx`, `smart-waitlist.tsx`, etc.).
2. **Decide client vs. server**: add `"use client"` at the top only if the
   section uses Framer Motion, hooks, or browser APIs. Purely static markup
   can stay a server component.
3. **Wrap reveal animations** with the shared `Reveal` component
   (`components/reveal.tsx`) for scroll-in-view fades, instead of writing new
   `motion.div` + `whileInView` boilerplate:
   ```tsx
   import { Reveal } from "@/components/reveal";
   <Reveal delay={0.1}><h2>...</h2></Reveal>
   ```
4. **Use design tokens, not raw values**: colors from `tailwind.config.ts`
   (`paper`, `beige`, `ink`, `ink-soft`, `night`, `coral`, `teal`, `gold`,
   `pearl`), font roles (`font-display`, `font-body`, `font-luxury`,
   `font-accent`), and existing utility classes from `app/globals.css`
   (`.glass`, `.ticket`, `.shimmer-text`, `.mirror-shine`, `.gold-line`)
   where they fit, rather than inventing new one-off colors or effects.
5. **Compose classNames with `cn()`** from `@/lib/utils` if the component has
   any conditional or merged classes — never manual string concatenation.
6. **Reuse `Button`** (`@/components/ui/button`) for any CTA, with the
   existing `variant`/`size` props, instead of a raw `<button>`.
7. **Export a named function component**, e.g. `export function NewSection() { ... }`
   — matches every existing section.
8. **Wire it into `app/page.tsx`**: import it and place it in the `<main>`
   stack at the appropriate position relative to the existing sections
   (`Hero → CategoryGrid → BeautyRituals → PopularSalons → StyleQuiz →
   AIFeatures → SalonOwnerFeatures → ProductShowcase → Testimonials →
   SmartWaitlist → FoundingProgram → Pricing → FAQ → CTA`), before `Footer`.
9. **Match the copy tone**: premium, warm, editorial-luxury — see
   `copy-tone-check` skill before finalizing headline/body copy.
10. **Verify visually** with the `visual-check` skill before considering the
    section done — this is a marketing site, so it isn't correct until it
    looks right.

## Don't

- Don't create a shared "Section" wrapper component or generic layout system
  — the codebase deliberately keeps each section self-contained.
- Don't add a CMS, data-fetching layer, or new state-management dependency
  for what is fundamentally static marketing content.
- Don't introduce fabricated video URLs or third-party embeds (see README
  "What's honestly not included and why") — use real, working assets only.
