# New Site

Full new-site workflow — brand interview, Astro scaffold, and N parallel homepage concept prototypes.

Takes you from "I need a website" to browsing multiple distinct homepage designs in one session.

## Installation

1. Download this zip file
2. In Claude Code, run:
   ```
   /install-skill new-site-v1.1.0.zip
   ```
3. Follow the prompts to install Python dependencies

## Prerequisites

- **Node.js 18+** — for Astro project scaffolding
- **Python 3** — for brand extraction and image download scripts
- **Claude Code** with Opus model access (sub-agents use Opus for design quality)

## Dependencies

### Python Packages
Optional but needed for redesign workflows (brand extraction + image download):
```
requests>=2.28.0
beautifulsoup4>=4.12.0
```

Install manually if prompted:
```bash
pip3 install requests beautifulsoup4
```

### Node.js Packages
Installed automatically during the scaffold phase:
- `astro`, `@astrojs/react`, `@astrojs/cloudflare`
- `tailwindcss` v4, `@tailwindcss/vite`
- `react`, `react-dom`
- Font packages via `@fontsource-variable/*`

### System Tools
- `npx` (comes with Node.js)
- `python3` (standard on macOS/Linux)

## Usage

```
/new-site
```

Or say naturally:
- "Build my site"
- "Start my website"
- "I need a new website for my business"
- "Redesign my site"

## How It Works

See `WORKFLOW.md` for detailed usage instructions and examples.

**Summary:** Interview (brand strategy) → Concept directions (N design proposals) → Astro scaffold → Parallel prototype builds → Browse at localhost:4321

## What's Included

| File | Purpose |
|------|---------|
| `SKILL.md` | Skill definition and full workflow instructions |
| `WORKFLOW.md` | User-facing usage guide |
| `references/interview-guide.md` | Brand interview question framework |
| `references/concept-brainstorm.md` | Direction brainstorming methodology |
| `references/astro-setup.md` | Astro project scaffold specification |
| `references/subagent-brief.md` | Sub-agent prompt template for prototypes |
| `scripts/extract_brand.py` | Extract colors, fonts, logo from existing sites |
| `scripts/download_homepage_images.py` | Download homepage images for redesign workflows |
| `requirements.txt` | Python dependencies |

---
Packaged with Claude Code /export-skill
