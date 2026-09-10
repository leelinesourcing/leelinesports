# How to Use: New Site

## Quick Start

1. **Open Claude Code** in an empty directory (or your existing project folder)
2. **Say** `/new-site` or "build my site" or "start my website"
3. **Answer the interview questions** — Claude asks about your business, customers, vibe, and site structure
4. **Review your concept directions** — Claude brainstorms N distinct homepage designs (you pick how many)
5. **Approve the plan** — Claude scaffolds an Astro project and builds all prototypes in parallel
6. **Browse your prototypes** — Run `npm run dev` and visit `localhost:4321`

## Example Workflows

### New Site from Scratch
```
/new-site
```
Claude will ask if you're starting fresh or redesigning. Pick "New site" and answer the interview questions about your business.

### Redesign an Existing Site
```
/new-site
```
Pick "Redesign" when asked. Provide your current site URL — Claude extracts your existing brand colors, fonts, and logo automatically, then asks whether you want to keep or reinvent your branding.

### Resume a Previous Session
If you started `/new-site` before and stopped partway, just run it again. Claude detects your progress and offers to pick up where you left off.

## What Gets Built

- **Astro 5** project with Tailwind CSS v4 + React
- **Cloudflare Workers** deployment config (static output)
- **N homepage prototypes** (3 by default) as separate Astro pages
- Each prototype has its own color palette, font pairing, and layout approach
- A concept navigator at `localhost:4321` linking to all directions

## The 4 Phases

| Phase | What Happens | Your Role |
|-------|-------------|-----------|
| 1. Interview | Brand strategy questions | Answer honestly, push back on suggestions |
| 2. Brainstorm | N concept directions presented | Approve, swap, or adjust directions |
| 3. Scaffold | Astro project created, npm installed | Wait (automatic) |
| 4. Prototypes | N sub-agents build homepages in parallel | Wait, then browse results |

## After Viewing Prototypes

Scroll through each direction fully. Take notes on what you love:
- "I love the hero from #1, the typography from #2, the color palette from #3"

Then tell Claude — it will build the final homepage from your feedback and lock in a design system.

## Tips

- **Be specific** in the interview — "everyone" is not a target customer, "modern and clean" is not a visual direction
- **Share inspiration URLs** — Claude analyzes them for patterns (colors, typography, layout density)
- **Start with 3 directions** — it's enough range without being overwhelming
- **Don't analyze while browsing** — just notice what you *feel* about each direction

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `npm run dev` fails | Check Node.js 18+ is installed: `node --version` |
| Python script errors | Install dependencies: `pip3 install requests beautifulsoup4` |
| Fonts not loading | Run `npm install` again — fontsource packages may need reinstalling |
| Sub-agent failed | Claude will detect and re-run just that direction |
| Want to start over | Delete the `.new-site/` folder and run `/new-site` again |
