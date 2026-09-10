# Landing Page Skill — Quick Start Guide

Run `/landing-page` in any Astro + Tailwind CSS project to build a B2B landing page from scratch.

## What to Expect

The skill runs 6 phases automatically. You'll be asked questions at key decision points.

```
Phase 0  ── Auto-detect project structure, framework, brand
              (runs silently, no input needed)
Phase 1  ── Interview — 5 short sections about your business
              (you answer questions)
         ── → Plan mode: review brief before proceeding
Phase 2  ── Design section layout with /frontend-design
              (runs semi-automatically)
Phase 3  ── Write copy, 2-3 sections at a time for approval
              (you approve/reject each batch)
Phase 4  ── Build the page file and components
              (runs automatically)
Phase 5  ── ├─ 5a R2 First-Run Setup (bucket config, one-time)
              ├─ 5b Image Discovery & Download (DevTools, Unsplash, Pexels)
              ├─ 5c Image Optimization (resize, WebP, size budgets)
              ├─ 5d Upload with MD5 Dedup (wrangler --remote)
              └─ 5e Verify & Record (URLs, ALT text, images.json)
Phase 6  ── Lighthouse audit + optimization
              (results shown, fixes applied automatically)
```

## Before You Start

Have ready:
- **Your service/product** — what you offer, in one sentence
- **Target customer** — who buys from you, what problems they have
- **Competitors** — who else does this, what they do well/poorly
- **Evidence** — stats, case studies, certifications, awards
- **Conversion goal** — what action should visitors take?

No files to prepare. The skill reads your project automatically.

## Interview Sections (Phase 1)

| Section | Questions | Time |
|---------|-----------|------|
| A — Service | What do you offer? Key features? | 2 min |
| B — Customer | Who is your ideal customer? What keeps them up at night? | 3 min |
| C — Competition | Who are your top 3 competitors? | 2 min |
| D — Evidence | What proof do you have? | 2 min |
| E — Conversion | What's the main action? | 1 min |

## What Gets Created

After the full workflow, you'll have:
- A new page at `src/pages/[slug].astro` (or framework equivalent)
- Section components under `src/components/landing/`
- Optimized WebP images in your image service (R2)
- `.r2-upload.json` — R2 bucket configuration at project root
- `.r2-manifest.json` — upload manifest with MD5 hashes at project root
- `.landing-page/images.json` — image references with URLs and ALT text
- A Lighthouse score >= 95 on desktop and mobile

## State Files

Intermediate data is saved in `.landing-page/` at your project root:
- `brief.json` — interview answers
- `section-plan.json` — section layout
- `copy.json` — approved copy
- `images.json` — image references
- `state.json` — current workflow phase

Additionally, R2-related files live at project root:
- `.r2-upload.json` — bucket config (bucket name, public URL, source folder)
- `.r2-manifest.json` — upload dedup state (MD5 hashes, URLs, timestamps)
- `_images/` — local staging folder for images before upload

You can pause and resume — state persists between sessions.

## Troubleshooting

| Issue | Likely Cause | Fix |
|-------|-------------|-----|
| Build errors | Missing dependencies | Run `npm install` |
| Image upload fails | R2 not configured | Use local assets fallback |
| Lighthouse < 95 | Large images / render-blocking | Phase 6 auto-fixes |
| Copy rejected | Doesn't match brand voice | Provide more specific feedback |
| `wrangler: command not found` | Wrangler CLI not installed | Install via `npm install -g wrangler` (see `references/install-wrangler.md`) |
| R2 auth fails | `wrangler login` expired | Run `wrangler login` to re-authenticate, or set `CLOUDFLARE_API_TOKEN` in `.env` |
| Images uploaded but not showing up | Missing `--remote` flag on `wrangler r2 object put` | Always include `--remote` — without it, wrangler uploads to a local emulated bucket |
| File uploaded but URL 404 | Public access not enabled on bucket | Run `wrangler r2 bucket dev-url enable <bucket> -y` |

## Quality Standards

The final page targets:
- **Desktop Lighthouse**: Perf >= 95, A11y >= 95, BP >= 100, SEO >= 100
- **Mobile Lighthouse**: same thresholds
- **Images**: WebP, compressed, semantic ALT text
- **Copy**: Zero generic claims, evidence-escalated, professional
