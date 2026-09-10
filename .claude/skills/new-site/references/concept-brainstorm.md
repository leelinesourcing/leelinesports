# Concept Brainstorm Guide

After completing the interview, brainstorm N concept directions (N = what the student chose: 3, 4, or 5).

**The single most important rule:** Each direction must make genuinely different choices across multiple contrast axes. Color variations of the same layout are NOT different directions.

---

## What's Locked vs. Free

**Locked (brand constraints — same for all directions):**
- Brand positioning, voice, and CTA strategy
- Any anchor colors or fonts from the brief (if the student has brand colors/fonts they must keep)
- Colors to avoid (if specified)

**Free (each direction chooses its own):**
- Color palette — 7 tokens: primary, secondary, accent, bg, surface, text, muted
- Font pairing — heading + body fonts (must be available as `@fontsource-variable` packages)
- Everything on the contrast axes below

You are the designer. For each direction, pick the palette and fonts that best embody that concept's personality. Don't ask the student to choose — present each direction as a complete visual proposal.

## Contrast Axes

Use these to create distinct directions. Each direction should differ on at least 4-5 of these axes:

| Axis | Options |
|------|---------|
| **Layout density** | Spacious / Balanced / Dense |
| **Typography treatment** | Extreme size contrast / Subtle hierarchy / One dominant size / Uppercase labels / Expressive display weights |
| **Typography weight play** | Light + bold contrast / All medium / Heavy throughout / Thin + black pairing |
| **Visual metaphor** | Editorial (magazine-like) / Studio (professional craft) / Spatial (depth, layers) / Minimal (let content breathe) / Organic (natural forms, textures) |
| **Hero treatment** | Full-bleed image / Split screen / Typographic / Video / Illustrated |
| **Section rhythm** | Consistent grid / Alternating layouts / Asymmetric / Modular blocks |
| **Shape language** | Sharp edges / Rounded corners / Pill shapes / Mixed |
| **Elevation style** | Flat (no shadows) / Subtle shadows / Dramatic shadows / Overlapping elements |
| **Proof style** | Statistics-forward / Testimonials-forward / Portfolio/case study grid / Logo wall |
| **Whitespace use** | Generous (luxury feel) / Balanced (professional) / Tight (information-dense) |

---

## Palette & Font Selection

For each direction, you must select a complete color palette and font pairing. This is a design decision — you pick what works best, the student sees the result.

**Process (internal — don't show this to the student):**
1. Consider 2-3 palette options for each direction
2. Pick the one that most naturally fits the direction's design personality
3. Do the same for font pairings
4. Respect any constraints from the brief (anchor colors, must-use fonts, colors to avoid)

**Color palette — 7 tokens per direction:**
- `primary` — main brand/CTA color
- `secondary` — supporting color
- `accent` — highlight/detail color
- `bg` — page background
- `surface` — card/section backgrounds (slightly off-bg)
- `text` — primary text color
- `muted` — secondary text, captions

**Font pairing — 2 fonts per direction:**
- Heading font — for h1-h6, display text
- Body font — for paragraphs, UI text
- Both must exist as `@fontsource-variable/[package-name]` npm packages (most Google Fonts do)
- Package names are lowercase with hyphens: `dm-sans`, `playfair-display`, `fraunces`

**Quality rules:**
- Palettes across directions must be **noticeably different** — not the same hues shifted slightly
- Each palette should feel NATIVE to its direction's personality (a warm organic direction gets warm earthy tones, a bold modern direction gets high-contrast)
- Font pairings should reinforce the direction's visual metaphor (editorial = serif headings, modern = geometric sans, etc.)
- If the brief has anchor colors, weave them into every direction's palette — but the supporting colors can differ

---

## Direction Format

After brainstorming, present the directions to the student BEFORE building. Format:

```
## Direction 1: [Name]

**Palette:** [Primary name #hex] · [Secondary name #hex] · [Accent name #hex] on [Background #hex]
**Fonts:** [Heading font] + [Body font]
**Visual approach:** [2-3 sentences describing the design. Mention: layout style, hero treatment, spacing feel, shape language, typography treatment, color mood, overall feeling]

**Why it fits your brand:** [1-2 sentences connecting the direction to their specific brief]
```

Each direction is a complete visual proposal — palette, fonts, and layout together. The student picks the whole package.

Example directions (for an eco interior design studio — warm, editorial, premium):

```
## Direction 1: The Silent Gallery

Palette: Walnut #8B6F47 · Charcoal #3D3D3D · Warm Gold #C4956A on Cream #FAF7F2
Fonts: DM Serif Display + Jost

Generous whitespace with a full-bleed photography hero. The serif headings
create editorial authority, while Jost at a light weight keeps the body airy.
Cream and linen backgrounds with warm walnut CTAs — no visual noise, just the
work speaking for itself.

Why it fits: Your portfolio is your proof. This direction centers it completely,
giving every project photo room to breathe while the warm earth tones reinforce
the natural, considered aesthetic.

## Direction 2: The Atelier

Palette: Deep Forest #2D3B2D · Slate #4A4A4A · Copper #B87333 on Parchment #F5F0E8
Fonts: Playfair Display + Inter

Asymmetric grid with overlapping elements — a project photo bleeds off the
edge while text layers over it. Heavier serif headings contrast with clean
geometric body text. Deep forest sections alternate with warm parchment,
creating rhythm and visual interest. Pill-shaped CTAs in copper add warmth.

Why it fits: The "atelier" framing signals that this is a studio with a point
of view, not just a service. The overlapping layout and copper accents add
the sophistication that premium positioning demands.

## Direction 3: The Naturalist

Palette: Olive #6B7F3B · Warm Clay #A0785A · Amber #D4A84B on Linen #F8F4EF
Fonts: Fraunces + DM Sans

Organic section shapes (subtle SVG waves at section breaks), warm olive and
amber accents on a soft linen base. Rounded corners everywhere — cards, images,
buttons. The variable optical-size heading font shifts from display to text
weight naturally. Stats section uses large numbers as visual anchors.

Why it fits: This direction foregrounds the eco-conscious identity — every
visual choice feels rooted in nature. Warmer and more approachable than
Direction 1, while still premium.
```

---

## Pitfalls to Avoid

**Too similar:**
- "Direction 1 is minimal, Direction 2 is also minimal but with a different font" — no
- Three directions that all use the same hero treatment — no
- Color is the only meaningful difference — no

**Too generic:**
- "Bold and modern" — this describes 90% of AI-generated websites
- "Clean and professional" — meaningless
- "Minimalist" without specifics — what kind of minimalism?

**Not grounded in the brief:**
- A dark, brooding direction for a children's brand — no
- A corporate blue direction for a wellness company — no
- Each direction must be genuinely believable for THIS brand

**Palette/font problems:**
- Same palette with minor shade variations across directions — each direction needs a distinctly different color mood
- Font package doesn't exist — always verify the `@fontsource-variable/[name]` package exists before including it
- Ignoring anchor constraints — if the brief has must-use colors or fonts, every direction must respect them

---

## directions.json Format

After the student approves (or adjusts) the directions, write this file:

```json
{
  "directions": [
    {
      "id": 1,
      "slug": "the-silent-gallery",
      "name": "The Silent Gallery",
      "description": "Generous whitespace with a full-bleed photography hero. Serif headings create editorial authority, while light-weight body text keeps things airy. Cream and linen backgrounds with warm walnut CTAs.",
      "rationale": "Your portfolio is your proof. This direction centers it completely.",
      "palette": {
        "primary": "#8B6F47",
        "secondary": "#3D3D3D",
        "accent": "#C4956A",
        "bg": "#FAF7F2",
        "surface": "#F0EBE3",
        "text": "#2C2C2C",
        "muted": "#8A8A8A"
      },
      "fonts": {
        "heading": { "family": "DM Serif Display", "package": "dm-serif-display", "fallback": "Georgia, serif" },
        "body": { "family": "Jost", "package": "jost", "fallback": "system-ui, sans-serif" }
      },
      "contrast_axes": {
        "density": "spacious",
        "typography": "transitional-serif + humanist-sans",
        "hero": "full-bleed-image",
        "visual_metaphor": "editorial"
      }
    },
    {
      "id": 2,
      "slug": "the-atelier",
      "name": "The Atelier",
      "description": "Asymmetric grid with overlapping elements. Heavier serif headings contrast with clean geometric body text. Deep forest sections alternate with warm parchment.",
      "rationale": "The atelier framing signals a studio with a point of view, not just a service.",
      "palette": {
        "primary": "#2D3B2D",
        "secondary": "#4A4A4A",
        "accent": "#B87333",
        "bg": "#F5F0E8",
        "surface": "#EBE5DA",
        "text": "#1A1A1A",
        "muted": "#7A7A7A"
      },
      "fonts": {
        "heading": { "family": "Playfair Display", "package": "playfair-display", "fallback": "Georgia, serif" },
        "body": { "family": "Inter", "package": "inter", "fallback": "system-ui, sans-serif" }
      },
      "contrast_axes": {
        "density": "balanced",
        "typography": "display-serif + geometric-sans",
        "hero": "split-screen",
        "visual_metaphor": "studio"
      }
    }
  ],
  "total": 2
}
```

The `slug` field is used for file naming: `direction-1-the-silent-gallery.astro`.

---

## Direction Naming Convention

Direction names should:
- Be evocative and memorable ("The Atelier", "The Naturalist", "Warm Authority")
- Never be generic ("Direction A", "Option 1", "Minimal")
- Reflect the design metaphor, not just the visual style
- Be 2-4 words max

Good: The Silent Gallery, Warm Authority, The Atelier, Field Notes, Studio Light, Bold Craft
Bad: Minimalist, Modern, Clean Professional, Option 1, Dark Theme
