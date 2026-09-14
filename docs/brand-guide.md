# LeelineSports — Brand Guide

The single source of truth for how this site looks. Everything here is extracted from
the live homepage code and the `@theme` block in `src/styles/theme.css`. If a value is
not in this document, it is not part of the brand.

Read this before making any design decision. Never hard-code a colour or font family in a
component — add it to `@theme` first, then use the utility class.

---

## Brand overview

LeelineSports is a custom sportswear manufacturer in Wuhan, China, supplying private-label
brands from MOQ 100. The site exists to convince a sceptical buyer — an Amazon FBA seller,
a gym owner, a team procurement lead — that they can hand over a sketch and receive
inspected, duty-paid cartons without ever touching a shipment.

It is a B2B manufacturer's site, not a consumer brand. The audience is a working operator
who has been burned before: ghosted by a supplier, held at customs, sent a container that
did not match the sample.

**Personality.** Precise, plain-spoken and quietly confident. It cites standards (AQL 2.5,
ISO 5077, ISO 105) instead of adjectives, and puts a number next to every claim.

**Mood.** Editorial and printed rather than glossy or techy. The page should read like a
well-set product catalogue: warm paper grounds, a single ink accent, hairline rules, and
generous white space. Think letterpress studio, not SaaS dashboard.

---

## Colour tokens

Every colour lives in the `@theme static` block in `src/styles/theme.css`. Twelve tokens,
one locked palette (the denim direction). Nothing outside this list.

| Token | Hex | Utility | Use it for |
| --- | --- | --- | --- |
| `steel` | `#386694` | `bg-steel` `text-steel` `border-steel` | Denim blue. Links, hairline rules, numerals, badges, the hero ground. |
| `navy` | `#0E2038` | `bg-navy` `text-navy` | Deep navy — the secondary step between denim and midnight. |
| `berry` | `#B2475B` | `bg-berry` `text-berry` `border-berry` | Oxblood berry. **The only saturated hue.** CTAs, marks, accents, the emphasised element in any group. |
| `cream` | `#F8F7F3` | `bg-cream` `text-cream` | The page background. Also light text on dark grounds. |
| `linen` | `#EEECE6` | `bg-linen` | Raised surfaces and alternating section bands. |
| `charcoal` | `#1A1B22` | `text-charcoal` | Body copy. The default text colour. |
| `slate` | `#7A7C88` | `text-slate` | Muted copy: leads, kickers, labels, captions. |
| `denim` | `#12284B` | `bg-denim` | Dark panels. The closing CTA and the dark featured card. |
| `midnight` | `#0A182E` | `bg-midnight` | The deepest step. Footer only. |
| `paper` | `#FFFFFF` | `bg-paper` | White cards and panels sitting on linen. |
| `mist` | `#F1F2F9` | `text-mist` | Light ink on the dark featured card. |
| `ink` | `#182430` | `text-ink` | Shadow and photographic-veil base. Never used as a surface. |

**Ground rules**

- `cream` is the canvas. `linen` separates adjacent sections. `paper` lifts a single card
  off `linen`.
- Dark grounds are earned, not decorative: `steel` for the hero, `denim` for the closing
  CTA and the featured card, `midnight` for the footer.
- `ink` is a shadow/veil base only — it never becomes a background or a text colour.
- Only `berry` is allowed to carry emphasis. There is no second accent.

---

## Typography

Two self-hosted variable families, imported in `src/styles/global.css` from `@fontsource`.
No Google Fonts, no external font requests.

| Token | Stack | Utility |
| --- | --- | --- |
| `--font-heading` | `'Fraunces Variable', Georgia, serif` | `font-heading` |
| `--font-body` | `'Manrope Variable', system-ui, sans-serif` | `font-body` |

Both are variable fonts, so fractional weights and optical-size axes are available and used.
`base.css` applies `font-heading` to every `h1`–`h6` and sets the body to
`bg-cream text-charcoal font-body`.

### Size scale

Sizes are fluid — the homepage expresses them as `clamp()`, not fixed breakpoints.

| Style | Class | Family | Size | Weight | Line height | Tracking |
| --- | --- | --- | --- | --- | --- | --- |
| Display H1 | `.cw-h1` | Fraunces | `clamp(3rem, 9vw, 6.9rem)` | 620 | 0.94 | −0.035em |
| Hero H1 (override) | `.cw-h1` inside `Hero.astro` | Fraunces | `clamp(2.4rem, 5.4vw, 4.6rem)` | 620 | 1.02 | −0.035em |
| Section title H2 | `.cw-h2` | Fraunces | `clamp(2.1rem, 4.5vw, 3.6rem)` | 520 | 1.02 | −0.025em |
| Sub-heading H3 | `.cw-h3` | Fraunces | `clamp(1.35rem, 2.6vw, 1.85rem)` | 560 | 1.12 | −0.015em |
| Kicker / eyebrow | `.cw-eyebrow` | Fraunces *italic* | 1.05rem | 420 | — | 0.01em |
| Lead paragraph | `.cw-lede` | Manrope | 1.10rem | 400 | 1.66 | — |
| Body | — | Manrope | 1.03rem | 400 | 1.6 | — |
| Stat numeral | `.cw-stat-num` | Fraunces | `clamp(2.1rem, 4vw, 3.1rem)` | 560 | 1 | −0.03em |
| Button | `.cw-btn` | Manrope | 1.00rem (0.94rem `--sm`) | 700 | 1 | −0.01em |
| Badge | `.cw-badge` | Manrope | 0.82–0.86rem | 700 | — | 0.04em when uppercase |
| Label / caption | — | Manrope | 0.85–0.94rem | 600 | — | 0.01em |

**Nothing renders below 0.82rem (13px).** The small end of the scale is deliberately
compressed: badges, tags, kickers, captions and comparison-table labels all sit in the
0.82–1.05rem band so they stay legible next to 1.03rem body copy. Anything above 1.15rem is
a heading or a display numeral and is set in Fraunces.

Optical sizing is set explicitly via `font-variation-settings: 'opsz' …` — 144 on the
display H1 and the hero watermark, 120 on section titles, 80 on H2, 72 on numerals, 48 on
H3 and sub-headings. `'SOFT'` is raised to 60–100 on the largest display type only.

### Heading vs body rules

- **Fraunces carries voice.** Headlines, section titles, italic kickers, pull quotes,
  numerals and statistics, the wordmark, and sub-headings. If it is a claim or a number
  meant to land, set it in Fraunces.
- **Manrope carries information.** Body copy, leads, nav links, buttons, badges, tags,
  labels, captions and any string that is read in bulk.
- Never set body copy in Fraunces. Never set a headline in Manrope.
- Heading weights are fractional (420/430/520/560/600/620) and only work because both
  families are variable fonts. Do not round them.
- Negative tracking is reserved for Fraunces display sizes. Body copy keeps default or
  slightly positive tracking.

---

## Spacing and layout

**Container.** `.cw-wrap` — `max-width: 1240px`, centred, with
`padding: 0 clamp(1.25rem, 4vw, 2rem)`. The nav, hero and proof band use a slightly wider
1280px band; the FAQ uses an 88rem inner column. Nothing is full-bleed except the hero.

**Section rhythm.** Every section is a vertical band with generous, roughly symmetric
padding. The standard is `padding: 7rem 0 6rem`, with these observed variants:
`7rem 0 6.5rem`, `6.5rem 0 6rem`, `6.5rem 0 7rem`, `6rem 0 6rem`, `5.5rem 0 2.5rem`.
Mobile reduces this (commonly `4rem`/`4.5rem` blocks) before the `760px`+ breakpoints.

**Spacing scale.** Built from 0.25rem steps, but weighted toward these recurring values:

| Step | Used for |
| --- | --- |
| 0.25 / 0.3 / 0.35rem | Badge padding, tight label gaps |
| 0.5 / 0.6 / 0.65rem | Icon gaps, inline spacing |
| 0.9 / 1.1 / 1.15rem | Spacing under kickers and titles |
| 1.35 / 1.4 / 1.5rem | Card internal padding |
| 1.6 / 1.7 / 1.75rem | Card padding, list gutters |
| 2 / 2.2 / 2.4rem | Gaps between cards, heading-to-body |
| 2.8 / 3rem | Grid gutters inside a section |
| 4 / 4.5rem | Mobile section padding |
| 6 / 6.5 / 7rem | Desktop section padding |

**Measure.** Section headings cap at 40–46rem. Leads cap at 58ch (`.cw-lede`) and
46ch (hero subheading). Never let a lead run the full container width.

**Breakpoints.** Mobile-first `min-width` queries at 560, 620, 700, 720, 760, 880, 900,
920, 940, 960, 1000 and 1024px. The two that carry the most weight are **720px** (two-column
grids begin) and **880px** (desktop nav appears, mobile menu collapses). Two `max-width`
queries exist: 719px (hero dial hidden) and 879px (nav actions hidden).

**Radii.** `999px` for pills, buttons and badges; `50%` for avatars; `10px`–`22px` for
cards and images, most often `13px`, `14px`, `16px`, `20px`. The signature move is an
asymmetric "notched" corner — three corners at 20–28px and one at 6–8px, e.g.
`border-radius: 20px 20px 20px 6px` on the process plate and `28px 28px 8px 28px` on the
pain image.

**Overlay.** A fixed full-viewport SVG fractal-noise grain sits above every page at
`opacity: 0.045` with `mix-blend-mode: multiply`. It is the single most recognisable
texture of the brand.

**Motion.** One easing curve: `--ease: cubic-bezier(0.22, 1, 0.36, 1)`. Reveals run 0.9s;
hover transitions 0.3–0.9s. Button hover lifts `translateY(-2px) scale(1.02)` on a springy
`cubic-bezier(0.34, 1.56, 0.64, 1)`. Everything collapses under
`prefers-reduced-motion: reduce`.

---

## Visual tone

- **Printed, not rendered.** The grain overlay, registration crosshairs, contour rings and
  italic Fraunces kickers make the page feel screen-printed. Never sand it down to flat
  white and system type.
- **Warm and calm.** The ground is cream and linen, not white. Colour arrives in one
  saturated hue — berry — and is spent sparingly on a single element per group.
- **Evidence over adjectives.** Numbers, tolerances and certificate codes get the biggest
  type on the page. When copy and proof compete, proof wins the space.
- **Hairline precision.** Separation comes from 1px rules at 14–16% opacity, not from heavy
  borders or filled blocks. Shadows are large, soft, low-opacity and tinted.
- **Unhurried.** Generous section padding and a narrow text measure. The page is confident
  enough not to crowd.

---

## Do's and don'ts

**Do**

- Read this guide before any design decision, and `/design-system` before building any new
  UI element.
- Pull every colour and font from `@theme`. If a value is missing, add it to `@theme`
  first, then use the class.
- Give Fraunces anything with voice or a number; give Manrope anything read in bulk.
- Alternate `cream` and `linen` bands to separate sections.
- Keep one accent. Berry marks the single most important element in a group — the CTA, the
  highlighted row, the suffix on a numeral. One per group.
- Set every heading, lead and caption with the tokens above, including the fractional
  weights and the negative tracking.
- Treat the homepage as finished. Its design is locked.

**Don't**

- Don't change the rendered homepage. Restructure the code freely, but the page must stay
  visually identical — this is a standing instruction, not a one-off.
- Don't add a second accent colour, a new gradient, or a new font family. The palette is
  twelve tokens and it is closed.
- Don't set body copy in Fraunces or headlines in Manrope.
- Don't use pure black or pure grey. Body text is `charcoal`, muted text is `slate`,
  shadows are `ink`.
- Don't use hard shadows (`0 4px 8px #000`), thick borders, or a border **and** a shadow
  **and** a radius on the same small element. Hairlines and soft tinted shadows only.
  **One deliberate exception:** the raised plate on the Why-us comparison table, which
  stacks a berry hairline, a 3px thickness edge and a soft cast shadow to lift the
  LeelineSports column off the table into the middle of it. Nothing else does this.
- Don't rebuild a component that already exists in `src/components/`.
- Don't write a heading without first checking whether `SectionHead` already does it.

---

## Image treatment

Photography is treated as a single graded library, not as individual pictures. Every image
on the site obeys the same four rules: a consistent colour grade, a fixed frame, a slow
scale on hover, and a tinted soft shadow.

**Frame and radius**

- Case-study figures and service figures: `border-radius: 13px`.
- Vertical tile images: `border-radius: 14px`.
- Certificates: `width: 184px`, `border-radius: 10px`, on a `paper` ground with a 1px
  `steel`-at-16% border.
- The process plate uses the notched corner: `20px 20px 20px 6px`.
- The pain image uses the wider notch: `28px 28px 8px 28px`.
- Avatars are 44×44px circles with a 1px ring — `steel` at 20% on light grounds, `cream`
  at 30% on dark ones.
- Every frame sits on a `linen` or `cream` background so nothing flashes white while the
  image decodes.

**Aspect ratios**

`16 / 9` (case studies) · `16 / 11` (process plate) · `3 / 2` (service figures) ·
`1 / 1` (vertical tiles) · `1 / 1.02` (pain image) · `4 / 5` (certificate scans, showcase
cards). The hero image is absolutely positioned and simply covers the viewport.

**Object fit and position**

`object-fit: cover` everywhere, without exception — images are cropped to the frame, never
letterboxed. The hero uses `object-position: 74% 40%` to hold the subject right of frame;
certificates use `object-position: center`.

**Colour grade**

One grade per set, so a grid reads as one library:

- Standard: `filter: saturate(0.88) contrast(1.03–1.04)`
- Hero: `filter: saturate(0.9) contrast(1.03)`
- The pain image is deliberately pulled into the brand blue:
  `filter: grayscale(0.55) sepia(0.14) saturate(0.7) hue-rotate(200deg) contrast(1.05) brightness(0.92)`

No image ships ungraded, and no image is brighter or more saturated than its neighbours.

**Hover**

The frame stays fixed and the image scales inside it. `scale(1.05)` to `scale(1.06)` over
`0.9s cubic-bezier(0.22, 1, 0.36, 1)`, and the grade lifts to `saturate(1)` as it moves.
Certificates are the exception — a gentler `scale(1.04)` over 0.8s, with no grade change.

**Overlays and veils**

Only the hero carries a veil: a `196deg` gradient from `steel` at 92% through `steel` at
70% / 26% to `ink` at 55%, so cream headline text always clears contrast over the photo.
No other image gets an overlay, a scrim or a duotone.

**Shadows**

Large, soft and negative-spread, always tinted — never black:

- Image frames: `0 34px 70px -38px color-mix(in srgb, var(--color-ink) 28%, transparent)`
- Floating cards: `0 34px 80px -44px color-mix(in srgb, var(--color-ink) 55%, transparent)`
- Cards that need separation use a 1px `steel`-at-16% border instead of a shadow.

**Never**

- No drop shadows with zero spread, and no pure-black shadows.
- No radius, border **and** shadow stacked on the same small image.
- No ungraded or over-saturated photography.
- No overlays, text-on-image treatments or duotones outside the hero veil.
- No full-colour stock imagery dropped in beside graded photography.
