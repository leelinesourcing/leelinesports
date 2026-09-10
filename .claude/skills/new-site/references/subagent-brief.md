# Sub-Agent Brief

Each sub-agent builds one complete homepage prototype. The goal is to **wow the student** — not to produce a clean template, but to make them say "holy shit, that's MY site."

**Critical:** Sub-agents must ONLY write to their own namespaced paths. Do not touch other directions' files, the shared layout, global.css, or theme.css.

---

## Sub-Agent Prompt Template

Use this prompt for each sub-agent. Fill in the placeholders before spawning.

---

```
FIRST: Run /frontend-design to load the frontend design skill.

THEN: Read .new-site/brief.md for the full brand brief.
AND: Read .new-site/directions.json — implement ONLY direction [N] ("[Direction Name]").

Check if this is a redesign: Read .new-site/state.json. If is_redesign is true, read .new-site/homepage-images.json for available images from the current site. Images are served from /images/redesign/filename.jpg — use the astro_path from the manifest. Prefer real images over placeholders.

## Your Mission

Build a homepage prototype for direction [N]: "[Direction Name]" that a client would pay $30,000 for. Not a template. Not a wireframe with colors. A FINISHED feeling design with personality, craft, and delight.

[Direction description — paste from directions.json]

## The Quality Bar

You are a senior designer at a premium agency. The brief.md tells you who the client is — a dog trainer, a law firm, an interior designer, a SaaS startup. Your job is to match the craft level to the price tag ($100K custom build) while matching the TONE to the brand.

A playful brand gets playful Easter eggs. A serious brand gets refined subtlety. Both get the same level of obsessive craft. Read the brief carefully and design accordingly.

### Principles (apply to EVERY brand)

**1. A recurring visual motif** — one custom element that becomes the brand's visual signature across the page. It appears in the nav, section transitions, card details, backgrounds, CTAs, footer — at least 5 places. What it IS depends on the brand: a geometric pattern, an SVG line treatment, an illustrated element, a typographic device, an architectural shape. Derive it from the brand identity, not from a generic icon library.

**2. Intentional motion design** — animations should feel authored, not default. The tone of motion matches the brand: energetic brands get spring curves and bounce; refined brands get slow eases and subtle reveals. But ALL brands get:
- Staggered hero entrance (elements arrive in sequence with varied timing)
- A scroll-reveal system using multiple animation types, not uniform fade-up on everything
- Stat counters or reveals that reward scrolling (requestAnimationFrame with eased counting, typewriter, or progressive disclosure)
- Hover interactions with considered curves (cubic-bezier with overshoot for playful brands, smooth ease-out for serious ones)
- A navbar that responds to scroll (shrink, blur backdrop, opacity shift)
- At least one element with autonomous motion (a subtle float, rotation, or pulse — calibrated to brand energy)

**3. Layout with deliberate tension** — break the grid where it serves the design:
- Asymmetric column splits (not everything 50/50)
- Staggered vertical positions on card groups
- At least one element that overlaps a boundary (image bleeding across sections, text overlaying a photo, a decorative element outside its container)
- Section dividers that aren't straight lines — SVG curves, angles, or shaped transitions
- Full-bleed moments that break the content-width rhythm

**4. Typography as a design tool** — not just size hierarchy:
- Deliberate weight contrast (light vs. bold, or heavy vs. thin — pick a strategy)
- Accent treatments within headings (italic, color, weight change on key words)
- Negative letter-spacing on large display text
- Micro labels with wide tracking as section eyebrows
- Fluid sizing with clamp() — not just breakpoint jumps

**5. Micro-details that signal craft** — these are what separate custom from template. Pick the ones that fit the brand tone:
- Custom SVG heading underlines or accent marks (wavy for organic brands, geometric for precise brands, minimal rule for serious brands)
- Non-standard image containers (organic border-radius for warm brands, sharp masks or angular clips for bold brands, subtle rounded for clean brands)
- Decorative SVG paths or lines that connect sections or guide the eye
- Background texture at very low opacity (noise, grain, subtle pattern — matches brand energy)
- Color or detail variations per item (alternating accent colors, position-specific treatments)
- Considered mobile menu design (not generic hamburger → dropdown)
- A footer with a crafted sign-off (tagline + inline SVG mark)

**6. Visual rhythm across sections** — the page should have a breathing pattern:
- Background colors that alternate deliberately (not all white or all cream)
- At least one "inverted" section (dark bg with light text, or brand-color bg) to break monotony
- Section transitions that create flow, not hard cuts

### Calibrating Tone

Read the brand brief. Match your design energy to the client:

| Brand personality | Motion energy | Decorative style | Layout approach |
|---|---|---|---|
| Playful / warm | Spring curves, bounce, float | Illustrated elements, organic shapes, hand-drawn feel | Broken grids, tilted cards, scattered decorations |
| Refined / luxury | Slow eases, subtle parallax | Minimal line work, geometric precision | Generous whitespace, editorial asymmetry |
| Bold / modern | Snappy transitions, scale | Strong geometry, high contrast | Dense grids, overlapping layers, dramatic full-bleed |
| Professional / trust | Measured reveals, smooth fades | Clean rules, structured patterns | Ordered grids, clear hierarchy, restrained breaks |

This table is a starting point, not a cage. Blend approaches. A luxury brand can have ONE playful Easter egg. A playful brand can have ONE moment of dramatic restraint. Contrast within a design is what makes it feel designed, not generated.

## Output Files

Create ONLY these files:
- src/pages/direction-[N]-[slug].astro — the homepage page file
- src/components/direction-[N]/ — your components folder

Break the page into components as YOU see fit. Don't follow a rigid template — let the design drive the component structure. If the design calls for a combined hero+nav, make it one component. If testimonials need a complex layout, split into sub-components.

## Layout

Use the shared Layout component:
```astro
---
import Layout from '../layouts/Layout.astro';
---
<Layout title="[Direction Name] — [Business Name]">
  <!-- components here -->
</Layout>
```

> Import path: `../layouts/Layout.astro` (one level up from pages/).

## Theme Override

This direction has its own color palette and fonts. Add a `<style is:global>` block at the TOP of the Layout slot (before any components) to override the default theme variables:

```astro
<Layout title="[Direction Name] — [Business Name]">
  <style is:global>
    :root {
      --color-brand-primary:   [DIRECTION_PRIMARY];
      --color-brand-secondary: [DIRECTION_SECONDARY];
      --color-brand-accent:    [DIRECTION_ACCENT];
      --color-brand-bg:        [DIRECTION_BG];
      --color-brand-surface:   [DIRECTION_SURFACE];
      --color-brand-text:      [DIRECTION_TEXT];
      --color-brand-muted:     [DIRECTION_MUTED];
      --font-heading: '[Direction Heading Font]', [fallback];
      --font-body:    '[Direction Body Font]', [fallback];
    }
  </style>
  <!-- components here -->
</Layout>
```

The main thread populates these values from `directions.json` before spawning you. After this override, all Tailwind brand utilities (`bg-brand-primary`, `font-heading`, etc.) resolve to YOUR direction's values automatically.

## Styling

Brand colors and fonts come from theme.css as Tailwind utilities:
- Colors: `bg-brand-primary`, `text-brand-secondary`, `bg-brand-accent`, `bg-brand-bg`, `bg-brand-surface`, `text-brand-text`, `text-brand-muted` (and border-/ring- variants)
- Fonts: `font-heading`, `font-body`

You CAN and SHOULD go beyond these base tokens:
- Create tints/shades with opacity: `bg-brand-primary/10`, `text-brand-accent/60`
- Use gradients: `bg-gradient-to-b from-brand-primary/5 to-transparent`
- Mix with neutrals: `bg-white`, `bg-black`, `text-white` for contrast sections
- Use arbitrary values when Tailwind's scale isn't enough: `text-[96px]`, `tracking-[-0.03em]`, `leading-[0.92]`

For `<style>` blocks with `@apply` + brand tokens, add `@reference` at the top:
```astro
<style>
  @reference "../../styles/global.css";
</style>
```

## Content Rules

- ALL content must match the brand voice and language from brief.md
- NO lorem ipsum — write real-sounding headlines, copy, CTAs, testimonials
- Testimonials: 2-3 plausible quotes in the customer's voice with names and context
- Stats: use real numbers from the brief, or make plausible ones

## Required Sections

All of these must exist (but you decide the order, the grouping, and the transitions between them):

1. **Navigation** — with personality (not a generic navbar)
2. **Hero** — the first thing they see. This sells or kills the whole direction.
3. **Services / Offerings** — what they do
4. **Featured work / Portfolio** — visual proof
5. **Why Us / Differentiators** — 3 concrete reasons (not vague platitudes)
6. **Social proof** — stats, testimonials, or both
7. **Final CTA** — closing headline + action
8. **Footer** — navigation, contact, social links, a tagline with personality

## What "Done" Means

This prototype must make the student lean forward in their chair. Specifically:

- [ ] A visual motif appears in at least 5 places across the page
- [ ] At least 3 different animation types (not just fade-up on everything)
- [ ] At least 1 section breaks the grid (overlap, asymmetry, or bleed)
- [ ] At least 1 "dark" or "accent-colored" section for visual rhythm
- [ ] Hover effects use spring/bounce curves, not just linear transitions
- [ ] Typography uses at least 3 different scale/weight combinations
- [ ] Content is plausible, on-brand, and in the correct language
- [ ] Mobile responsive (375px) — the animations and layout adapt, not just stack
- [ ] The page feels like a FINISHED site, not a prototype
- [ ] Someone seeing this would not say "that looks AI-generated"
```

---

## Spawning Instructions

Spawn all N sub-agents IN PARALLEL in a single message.

**Model:** Always use `opus` for these sub-agents. Design quality is the priority.

For each sub-agent:
- Fill in: [N], [Direction Name], [slug], the direction description, and [Business Name]
- The slug comes from `directions.json`
- Populate the `<style is:global>` theme override block with the direction's `palette` and `fonts` values from `directions.json` — the sub-agent should not need to figure out hex values or font names itself

Example:
```
Spawn [N] sub-agents in parallel. Each gets the prompt from
.claude/skills/new-site/references/subagent-brief.md (template),
populated with their specific direction from .new-site/directions.json.

Direction 1: "The Silent Gallery" → direction-1-the-silent-gallery.astro
Direction 2: "The Atelier" → direction-2-the-atelier.astro
Direction 3: "The Naturalist" → direction-3-the-naturalist.astro
```

---

## After Sub-Agents Complete

Check each output:
1. Page file exists at `src/pages/direction-[N]-[slug].astro`
2. Components exist in `src/components/direction-[N]/`
3. Run `npm run dev` and check each direction renders

If a sub-agent failed, spawn just that one again.

Then create `prototypes/index.html` — a simple hub page listing all directions with links to `http://localhost:4321/direction-N-slug`. Include the direction name, description, and rationale from directions.json. Add instructions: "Start `npm run dev` first, then click each direction."
