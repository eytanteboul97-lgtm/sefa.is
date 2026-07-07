---
name: copy-tone-check
description: Review new or edited marketing copy for sefa.is against the site's premium, editorial-luxury tone and its EN/FR/HE language posture. Use whenever headline, body copy, CTA, or metadata text is written or changed.
---

# Copy tone check

Sefa's brand voice is **premium, warm, editorial-luxury** — the copy should
read like a high-end salon/spa brand, not a generic SaaS or booking-app
template. This skill reviews copy against that bar before it ships.

## Voice checklist

1. **Tone**: confident, warm, a little poetic — short punchy phrases mixed
   with one elegant longer sentence, not corporate SaaS-speak ("streamline
   your workflow", "unlock growth") and not overly casual/slangy. Reference
   existing copy for calibration:
   - Hero: *"Beauty, booked in a breath."* / *"Sefa brings Israel's finest
     salons, hairdressers and spas into one experience — as refined as the
     appointments themselves."*
   - Site description: *"Book Israel's finest salons, hairdressers, spas and
     barbershops in a breath. For salon owners: fill your calendar, cut
     no-shows by 40%, get paid before clients arrive."*
2. **Two audiences, kept distinct**: consumer-facing copy (booking,
   discovery, beauty) vs. salon-owner-facing copy (business value: filling
   calendars, cutting no-shows, getting paid faster). Don't blur the two
   in the same section — check which audience a section targets
   (`SalonOwnerFeatures`/`FoundingProgram`/`Pricing` are B2B; most others are
   consumer) and match tone/claims accordingly.
3. **Concrete numbers over vague superlatives**: prefer specific stats (like
   the hero's `48,000+ appointments`, `620+ salons`, `4.9★`) over generic
   claims ("thousands of happy clients"). If adding a new stat, make sure
   it's presented as a real, defensible figure — flag anything that reads as
   fabricated/unverifiable and ask the user for a real number instead.
4. **No overclaiming on functionality**: this is currently a marketing page
   with no live booking backend. Copy can describe the vision/product
   confidently, but don't add copy that implies a specific feature is live
   right now (e.g. "chat with our AI stylist below") if it isn't actually
   wired up — check `ai-features.tsx`/`style-quiz.tsx`/`smart-waitlist.tsx`
   to confirm what's presentational vs. functional before writing copy that
   promises interactivity.
5. **Language scope**: primary copy is English. `app/layout.tsx` metadata
   declares `en`/`he` alternates and mentions `fr` as an OG locale, but *no
   actual localized routes or translated content exist*. Don't write new
   copy assuming an i18n system is in place — if asked for French/Hebrew
   copy, treat it as new content to add, not a translation of an existing
   pipeline, and flag that routing/localization infrastructure would need
   to be built first.
6. **Consistency**: if a stat, claim, or product name changes in one place
   (e.g. the hero counter, the metadata description, a section's copy),
   check whether the same fact appears elsewhere and needs updating too
   (see `seo-metadata-update` skill for the metadata side).

## Output

When reviewing copy, quote the specific line, say what's off (generic
SaaS tone, unverifiable claim, audience mismatch, overclaiming a feature),
and suggest a rewrite in the established voice rather than just flagging
the problem.
