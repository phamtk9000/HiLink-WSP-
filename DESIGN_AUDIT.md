# HiLink — Design audit (ui-ux-design-principles skill)

Run against the checklist in the `ui-ux-design-principles` skill (distilled
from Figma's resource library: color combinations, best web fonts, landing
page examples, UX fundamentals). ✅ = already compliant · 🔧 = fixed in this
pass · 💡 = recommended next.

## Color (skill §3)
- ✅ Palette is a textbook **"Golden taupe / Old photograph"** premium harmony:
  cream `#F8F6F1` ground (60%), olive/charcoal supporting bands (30%), gold
  `#A88F5C` as the single interactive accent (10%). Harmony type: warm
  monochromatic neutrals + one accent — correct for a luxury hospitality brand.
- 🔧 `--text-3` darkened `#707070 → #666666` so muted body/label text meets
  WCAG AA 4.5:1 on the cream background.
- 💡 Gold used as *small* text (eyebrows) sits ~2.6:1 on cream — acceptable as
  decorative labels, but if any gold text carries essential meaning at <18px,
  introduce a darker `--gold-ink` (~`#8A7344`) for those cases.

## Typography (skill §4)
- ✅ Two-family pairing exactly per guidance: **Playfair Display** (serif
  display, "luxurious, ideal for large text") + **Inter / Be Vietnam Pro**
  (screen-optimized UI sans with full Vietnamese coverage). Uppercase
  letter-spaced eyebrows used consistently.
- 🔧 Added `text-wrap: balance` to headings and `text-wrap: pretty` to
  paragraphs — no orphan words in multi-line display type.
- ✅ Body sizes 13.5–18px, line-height 1.5–1.8, measures capped (`maxWidth`)
  across sections.

## Landing pages (skill §2)
- ✅ Homepage hero: single value proposition headline, ONE primary gold CTA
  (Search) above the fold, secondary text-link CTA beneath — correct
  hierarchy. Enquiry forms carry adjacent context (phone, email = trust).
- ✅ Solution/unit pages: intent-matched heroes, "Enquire" primary + "All
  solutions" secondary, one accent style for all interactive elements.
- 💡 Add a testimonial or client-logo strip adjacent to the homepage enquiry
  banner (trust signal next to the ask — highest-leverage remaining item).

## UX foundations (skill §1)
- 🔧 **Accessibility**: global `:focus-visible` gold outlines added; the
  focus-mode navbar now also reveals its collapsed items on keyboard focus
  (previously hover-only). Brand `::selection` color added for consistency.
- ✅ `prefers-reduced-motion` respected for marquee/rows; touch reveal for
  hover-dependent effects (directory rows) already in place.
- ✅ User control: filters clearable, forms show "send another", back links
  and breadcrumbs throughout.
- 💡 Add a "skip to content" link before the nav for screen-reader users.

## Navbar behavior note (issue #1 this round)
Verified against spec: on a section page only the active section's name shows;
hovering (or now keyboard-focusing) the bar reveals the full previous menu —
all items and their mega panels — exactly as before. This is the intended
"focus mode + full reveal on hover" behavior.
