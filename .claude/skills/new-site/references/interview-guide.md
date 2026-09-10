# Interview Guide

Your job is to learn everything needed to write a sharp brand brief and site blueprint. You're a strategist, not a form to fill out — ask what's relevant, skip what isn't, push back on vague answers.

**Tool rule:** Every question you ask must use the `AskUserQuestion` tool. Never ask questions as plain text.

**Conversation style:**
- Conversational and adaptive — ask follow-ups based on what they say, not what the script says next
- Push back on vague answers. "Modern and clean" is not a visual direction. "Everyone" is not a target customer
- If you already know something from context (they mentioned it in passing), don't ask again
- Batch related questions together (2-3 max). Use judgment — fewer questions on things that are obvious, more where there's real ambiguity
- Give recommendations, don't just list options: "Based on what you've told me, I'd suggest X because..."
- If they're stuck: "Write something honest for now, we can sharpen it later"

---

## Step 0 — New Site or Redesign?

Ask this first. This determines everything else.

**Goal:** Know whether to extract existing branding, and whether to preserve or reinvent it.

Example question: *"Are you starting fresh, or do you have an existing site you want to redesign?"*

Options to surface:
- **New site** — blank slate
- **Redesign — keep branding** — same colors/fonts/identity, just rebuild
- **Redesign — new direction** — have a site but want a fresh look

### If redesign (either type):

Ask for their current site URL, then run brand extraction:
```bash
python3 .claude/skills/new-site/scripts/extract_brand.py [URL] -o .new-site/brand-extraction/
```

Read `.new-site/brand-extraction/brand-identity.json` and show a summary:
> "I found these colors: [list hex codes with descriptions]. Fonts in use: [list]. Logo: [downloaded / not found]."

- **Keep branding:** Confirm what's right, ask about any tweaks. Lock colors and fonts — skip color/font exploration later.
- **New direction:** Frame the extraction as "what you're moving away from." Still go through visual identity below.

---

## What You Need to Learn

Work through these categories in whatever order makes sense given the conversation. You don't need to ask about everything — use judgment about what's already clear and where you genuinely need more.

### Business & Positioning

**What you need:** A clear one-liner, specific target customer, primary CTA, and what makes them different.

Example questions (use what fits, rephrase freely):
- *"What does your business do — can you give me one sentence?"*
- *"Who's your ideal customer? I need specifics — industry, role, company size, what frustrates them."*
- *"What's the ONE thing you want visitors to do on your site?"*
- *"What makes you different from competitors? If you're stuck — even 'I give more personal attention' is real if it's true."*

After you have enough: synthesize a positioning statement and show it back:
> "Here's what I'm hearing: [2-3 sentences]. Does this sound right? What would you change?"

**Quality bar:** Target customer must be specific enough that a real person matches it. Differentiator must be concrete, not "we care more."

---

### Vibe & Visual Direction

**What you need:** The emotional tone, what it should NOT feel like, and enough to start brainstorming design directions.

Example questions:
- *"What feeling should your site create in the first 3 seconds — before anyone reads a word?"*
- *"Who are you NOT? Sometimes easier to define by contrast. Not corporate? Not edgy? Not academic?"*

If they're vague, offer vivid examples to react to:
> Trust & Authority / Warm & Approachable / Bold & Creative / Clean & Minimal / Premium & Luxurious / Energetic & Dynamic

Push for reactions, not just a pick: *"When you think of a luxury brand's website versus a startup's — which direction feels more like you?"*

---

### Inspiration

**What you need:** 2-3 URLs of sites they admire (competitors or not), any screenshots or brand assets.

Example questions:
- *"Share 2-3 sites whose look and feel resonates with you — doesn't have to be your industry."*
- *"Any screenshots of specific elements you love? Hero layouts, typography, color use, etc.?"*
- *"Do you have a logo or any brand assets already? Upload anything you have."*

For each URL provided, fetch and analyze:
- Color palette (dominant, secondary, accent)
- Typography (serif vs. sans, weight play, heading scale)
- Layout density (whitespace, grid tightness, section rhythm)
- Design movement (minimalist, editorial, brutalist, organic, etc.)

Synthesize across all URLs:
> "Here's the pattern I see: [synthesis]. The common thread is [theme]. This tells me your site wants to feel [translation]."

---

### Colors & Fonts

**Skip if already locked from redesign extraction ("keep branding" path).**

You're the designer — you'll pick the palette and fonts for each concept direction during brainstorm. Here you only need to know if the student has constraints.

**What you need:** Any hard requirements or dealbreakers. That's it.

Ask briefly:
- *"Do you have existing brand colors you need to keep? If so, what are the hex codes?"*
- *"Any colors you want to avoid?"*
- *"Do you have a brand font you must use? If not, I'll pick fonts that match each concept."*

If they have specific hex codes or fonts → record as **anchor colors/fonts** that all directions must respect.
If they have nothing → move on. You'll choose what works best for each concept during brainstorm.

Do NOT suggest palettes or font pairings here. That happens per-concept in the brainstorm phase.

---

### Site Structure

**What you need:** Which pages launch on day one, which wait for v2, and what goes on the homepage.

On pages — example questions:
- *"What pages do you need at launch? Homepage is a given."* (Common: About, Services, Portfolio, Contact, Pricing, Blog, FAQ)
- If they list 6+: *"Which of these are truly launch-critical? Which can come 3 months later when you have more content?"*

On the homepage specifically — this is what gets built, so understand it well:
- *"What must a visitor see above the fold, before they scroll?"*
- *"What proof do you have RIGHT NOW — not what you're planning to get?"* (Testimonials, logos, case studies, stats, press)
- *"What's your primary CTA and secondary CTA?"*

**Critical rule:** Build around what they HAVE, not what they wish they had. 2 testimonials → plan 2. Don't create empty sections.

---

### Content

**What you need:** What's ready, what needs writing, what might be out of scope.

Ask only if relevant — skip for simple brochure sites:
- *"Do you have a blog or plan to publish content? How often?"*
- *"Any existing content to migrate — posts, downloads, resources?"*
- *"Any lead magnets? Something visitors get in exchange for their email?"*

---

## When You Have Enough

You have enough when you can answer all of these:
- [ ] What does this business do? (one sentence)
- [ ] Who is the specific target customer?
- [ ] What's the primary CTA?
- [ ] What makes them different?
- [ ] What emotional vibe/tone should the site have?
- [ ] Any required brand colors or colors to avoid?
- [ ] Any required brand fonts?
- [ ] What pages launch on day one?
- [ ] What homepage sections exist + what content is ready?

You do NOT need to ask about everything explicitly if context already makes it clear. Use judgment.

---

## Brief Output Format

Write `.new-site/brief.md` with this structure:

```markdown
# Brand Brief

## Positioning
- **Business:** [one-liner]
- **Ideal Customer:** [specific description]
- **Primary CTA:** [the one action]
- **Differentiator:** [what makes them different]
- **Positioning Statement:** [2-3 sentence synthesis]

## Brand Voice & Tone
- **Personality:** [2-3 adjectives]
- **Tone:** [how they communicate]
- **We are:** [list]
- **We are NOT:** [list]

## Visual Identity

### Color Constraints
[Only if the student has specific requirements. Otherwise: "None — designer's choice per concept."]
- **Anchor colors:** [hex codes they must keep, if any]
- **Avoid:** [colors or tones to avoid, if any]

### Font Constraints
[Only if the student has a brand font. Otherwise: "None — designer's choice per concept."]
- **Must-use font:** [font name, if any]

> Final palette and fonts are selected per concept direction during brainstorm.

### Visual Style
- **Keywords:** [3-5 words]
- **Inspiration patterns:** [synthesis from analyzed URLs]
- **Do:** [specific guidance]
- **Don't:** [specific anti-patterns]

# Site Blueprint

## Pages (v1 — Launch)
[For each page:]
### [Page Name]
- **Purpose:** [one sentence]
- **Sections:** [ordered list with brief descriptions]
- **Content status:** [Ready / Needs writing / Placeholder OK]

## Pages (v2 — Later)
[List deferred pages with brief notes]

## Homepage Section Breakdown
| Section | Content Needed | CTA | Content Status |
|---------|---------------|-----|----------------|
[One row per section]

## Content Inventory
- **Ready to use:** [list]
- **Needs creating:** [list]
- **Assets on hand:** [logo, headshot, client logos, photos, etc.]

## CTA Strategy
- **Primary CTA:** [text + destination]
- **Secondary CTA:** [text + destination]
- **CTA placement:** [where across the site]
```
