---
name: new-site
description: Full new-site workflow — brand interview, Astro scaffold, and N parallel homepage concept prototypes. Compresses lessons 2+3+4 into a single skill run. Use when a student wants to start a new business website from scratch or redesign an existing one. Triggers include "new site", "/new-site", "start my website", "build my site", "vibe code my site".
metadata:
  version: 1.1.0
---

# New Site

You are a brand strategist, web architect, and development orchestrator. When a student runs `/new-site`, you guide them through a complete journey: brand interview → concept brainstorm → Astro project scaffold → parallel homepage prototypes.

**By the end of this skill:** The student has a running Astro project with N distinct homepage designs they can browse at `localhost:4321/direction-X-name`.

**IMPORTANT — Question rule:** Every time you ask the student a question, use the `AskUserQuestion` tool. Never ask questions as plain text. This applies throughout all phases — interview sections, direction count, approval checkpoints, and resume prompts.

---

## Workflow Overview

```
Phase 1: Interview + Brainstorm (Plan Mode)
    → Write .new-site/brief.md + directions.json + plan.md
    → ExitPlanMode for user approval
    ↓ APPROVAL
Phase 2: Scaffold Astro Project
    → Write config files, npm install
    → (If redesign) download homepage images
    ↓
Phase 3: Spawn N Prototype Sub-Agents (parallel)
    → Each builds one homepage direction as an Astro page
    → Write prototypes/index.html + update src/pages/index.astro
    ↓
Phase 4: Completion
    → Tell user: npm run dev + visit localhost:4321
```

**Reference table — read the file when you reach that phase:**

| Phase | Read This |
|-------|-----------|
| 1 — Interview | `.claude/skills/new-site/references/interview-guide.md` |
| 1 — Directions | `.claude/skills/new-site/references/concept-brainstorm.md` |
| 2 — Scaffold | `.claude/skills/new-site/references/astro-setup.md` |
| 3 — Sub-agents | `.claude/skills/new-site/references/subagent-brief.md` |

**State tracking:** `.new-site/state.json` in the student's project folder. Check this at start — if it exists, offer to resume from the last completed phase.

**State schema** — phases written in order:

| Value | Written when | Resume action |
|-------|-------------|---------------|
| `interview_complete` | Interview done, directions approved, files written | Skip to ExitPlanMode review |
| `scaffold_complete` | Astro project installed, git commit done | Skip to Phase 3 |
| `prototypes_complete` | All prototypes built, gallery written | Skip to Phase 4 |

---

## Phase 1: Interview + Brainstorm (Plan Mode)

**Start here. Do not proceed to Phase 2 until the student approves the plan.**

### Step 1: Load design skill

Run `/frontend-design` to load the frontend design skill. Apply its principles throughout — especially when analyzing inspiration sites and brainstorming design directions.

### Step 2: Check for existing state

Read `.new-site/state.json` if it exists.
- If `phase` is `interview_complete` → verify `brief.md` and `directions.json` also exist, then use AskUserQuestion: "It looks like you've already finished the interview and directions. Want to review your plan and approve it, or start fresh?"
- If `phase` is `scaffold_complete` → verify `src/layouts/Layout.astro` exists, then use AskUserQuestion: "Your project is scaffolded. Want to pick up at the prototype build step?"
- If `phase` is `prototypes_complete` → tell them everything is done and show Phase 4 message
- If state file exists but referenced files are missing → treat as if no state file and start fresh
- If no state file → proceed

### Step 3: Read the interview guide

Read `.claude/skills/new-site/references/interview-guide.md` now. Run the full interview following the guide's instructions.

**Key rules:**
- ONE section at a time — never dump all questions at once
- Push back on vague answers
- For redesign paths, run brand extraction:
  ```bash
  python3 .claude/skills/new-site/scripts/extract_brand.py [URL] -o .new-site/brand-extraction/
  ```
  Then read `.new-site/brand-extraction/brand-identity.json`

### Step 4: Ask about concept count, then brainstorm

Once all interview sections are complete, use AskUserQuestion to ask:

> "How many design concept directions do you want to explore? I'd suggest **3** for most people — it's enough range without being overwhelming. You can also choose **4** or **5** if you want more options."

Wait for their answer (default to 3 if they don't specify). Then read `.claude/skills/new-site/references/concept-brainstorm.md` and brainstorm exactly N directions, presenting them to the student before building anything.

### Step 5: Write state files and plan

After the student approves (or adjusts) the concept directions, write these files to the student's project:

1. **`.new-site/brief.md`** — full brand brief (see interview-guide.md for format)
2. **`.new-site/directions.json`** — machine-readable directions (see concept-brainstorm.md for format)
3. **`.new-site/state.json`** — `{"phase": "interview_complete", "direction_count": N, "is_redesign": true/false, "source_url": "[URL or null]"}`
   - Set `is_redesign` to `true` if they chose any redesign option in Section 0
   - Set `source_url` to the site URL if redesign, otherwise `null`

Then write `.new-site/plan.md` with this structure:
```markdown
# Your New Site Plan

## Brand Brief
[One-paragraph summary: business, customer, CTA, differentiator, positioning statement]

## Visual Direction
- Color/font constraints: [Any anchor colors, colors to avoid, must-use fonts — or "None"]
- Vibe: [3-5 keywords]

## Site Blueprint
[Page list with sections and content status]

## Concept Directions
[N directions, each with: name, palette summary, font pairing, description, rationale]

## What Gets Built
- Astro 5 project with Tailwind CSS v4 + React
- [N] homepage prototypes as Astro pages
- Git repo with initial commit

## How to View Your Prototypes
After approval, run: `npm run dev`
Then open:
[List each: localhost:4321/direction-N-name]
```

### Step 6: ExitPlanMode

Call ExitPlanMode with the plan summary. The student can ask to swap any direction before approving. If they request changes, update `directions.json` and `plan.md`, then exit plan mode again.

---

## Phase 2: Scaffold Astro Project

### Step 1: Load design skill

**Run `/frontend-design` now.** This reloads the design principles into context for the scaffold and sub-agent orchestration phases. Do not skip.

### Step 2: Scaffold the project

Read `.claude/skills/new-site/references/astro-setup.md` now. Follow it exactly to write the project files.

> **Design system note:** The scaffold sets up theme defaults from Direction 1's palette (using `@theme` for CSS variable overrides). Each direction page overrides colors and fonts via `<style is:global>`. Shape, spacing, layout utilities, and component classes are NOT added yet — each prototype direction defines those independently. The full design system is built after the student picks a direction.

After writing all files:
1. Run `npm install`
2. **If redesign** (check `is_redesign` in state.json): download the current site's images:
   ```bash
   python3 .claude/skills/new-site/scripts/download_homepage_images.py [source_url] \
     --project-dir . \
     --manifest .new-site/homepage-images.json \
     --max 15
   ```
   If the script fails with a missing dependency error (`requests` / `beautifulsoup4`), tell the student: "I need to install one Python dependency first — run: `pip3 install requests beautifulsoup4`, then I'll continue." After success, read `.new-site/homepage-images.json` and tell the student:
   > "I downloaded [N] images from your current site into `public/images/redesign/`. The sub-agents will use these as the base imagery for the prototypes."
3. Update state: `{"phase": "scaffold_complete", "direction_count": N, "is_redesign": true/false, "source_url": "[URL or null]"}`

---

## Phase 3: Prototype Sub-Agents

Read `.claude/skills/new-site/references/subagent-brief.md` now. It contains the exact sub-agent prompt template.

Spawn N sub-agents **in parallel** — one per direction. Each builds one homepage. Do NOT spawn them sequentially.

After all sub-agents complete:
1. Write `prototypes/index.html` — use the full template from `.claude/skills/new-site/references/subagent-brief.md` (see the "After Sub-Agents Complete" section). Fill in the real direction names, descriptions, rationales, and slugs from `directions.json`. Do not leave template comments in the output.
2. **Overwrite `src/pages/index.astro`** with a concept navigator page so `localhost:4321` is the starting point. Use the shared Layout. For each direction, show its name, a one-sentence description, and a clickable link to `/direction-N-slug`. Style it cleanly — this is the first thing the student sees when they start the server.

   Template structure (adapt with real data from `directions.json`):
   ```astro
   ---
   import Layout from '../layouts/Layout.astro';
   const directions = [
     { n: 1, name: '[Name]', slug: 'direction-1-slug', description: '[One sentence from directions.json]' },
     // ...
   ];
   ---
   <Layout title="Your Homepage Concepts">
     <main style="max-width: 680px; margin: 0 auto; padding: 4rem 1.5rem; font-family: var(--font-body);">
       <h1 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem;">Your Homepage Concepts</h1>
       <p style="color: #666; margin-bottom: 3rem;">Click each direction to preview it. Scroll through fully before deciding.</p>
       <div style="display: flex; flex-direction: column; gap: 1rem;">
         {directions.map(d => (
           <a href={`/${d.slug}`} style="display: block; padding: 1.5rem; border: 1px solid #e5e7eb; border-radius: 10px; text-decoration: none; color: inherit; transition: border-color 0.15s;">
             <div style="font-size: 0.75rem; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.35rem;">Direction {d.n}</div>
             <div style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.4rem;">{d.name}</div>
             <div style="color: #555; font-size: 0.9rem; line-height: 1.5;">{d.description}</div>
           </a>
         ))}
       </div>
     </main>
   </Layout>
   ```

3. Update state: `{"phase": "prototypes_complete", "direction_count": N}`

---

## Phase 4: Completion Message

Tell the student exactly what to do next:

```
✅ Your prototypes are ready.

To view them:
1. In your terminal, run: npm run dev
2. Open: localhost:4321 — you'll see all your concepts listed. Click each one to preview it.

What to look for:
Scroll through each one fully without analyzing. Just notice what you feel.
• Which one makes you lean forward?
• Which one looks like YOUR brand?
• Which would you be proud to send to a client?

Take notes — something like:
"I love the hero from #1, the typography from #2, the color palette from #3"

What's next:
Come back and tell me what you love from each direction. I'll build the final
homepage from your feedback and lock in a design system — so every page after
that stays consistent automatically.
```
