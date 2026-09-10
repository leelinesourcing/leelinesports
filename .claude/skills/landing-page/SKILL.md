# Landing Page Skill

A generic B2B landing page builder for Astro + Tailwind CSS projects. Runs a 6-phase workflow from user research through page construction to Lighthouse audit.

**Slash command:** `/landing-page`

---

## Overview

This skill builds a high-converting B2B landing page by:

1. **Interviewing** you to gather service info, audience, competitors, evidence, and conversion goals
2. **Designing** an 11-section page structure with differentiation from existing site pages
3. **Writing** copy per the Landing Page Writing Guide methodology (zero pollution, evidence escalation, buyer-question-driven)
4. **Building** the page using your project's framework and design system
5. **Sourcing** images via Chrome DevTools / Unsplash / Pexels, optimizing to WebP
6. **Auditing** with Lighthouse (desktop + mobile) targeting >= 95 across Perf, A11y, BP, SEO

---

## 6-Phase Workflow

### Phase 0: Project Initialization (Auto-adaptation)
- Reads project `CLAUDE.md` for structure conventions
- Reads `docs/brand-guide.md` (if present) for brand tokens
- Detects frontend framework (Astro, Next.js, other)
- Detects image service (R2, local assets, other)
- Analyzes existing page patterns for differentiation
- Generates `.landing-page/project-context.json`

### Phase 1: Interview & Research (Plan Mode)
5 interview sections via AskUserQuestion:
- **A - Service/Product**: One-liner, keywords, key selling points
- **B - Target Customer**: Persona, pain points, trigger events, 6-8 buyer questions
- **C - Competition**: Main competitors, their strengths/weaknesses, unique information
- **D - Evidence**: Stats, case studies, certifications
- **E - Conversion Goals**: Primary CTA, secondary CTA, lead magnet

Generates `.landing-page/brief.json` → ExitPlanMode

### Phase 2: Design Section Structure
- Loads `/frontend-design` skill
- Designs 11-section layout with differentiation strategy
- Maps to existing/new components
- Outputs `.landing-page/section-plan.json`

### Phase 3: Copywriting
- Reads Landing Page Writing Guide methodology
- Writes copy for each section with zero-pollution enforcement
- Shows 2-3 sections at a time for approval
- Outputs `.landing-page/copy.json`

### Phase 4: Build Page
- Creates page file (Astro `.astro` / framework-equivalent)
- Reuses existing UI components
- Builds new section-specific components
- Applies brand tokens and design system

### Phase 5: Image Sourcing & Upload (5 sub-phases)

**5a — R2 First-Run Setup** (first-use only)
- Check existing `.r2-upload.json` config
- Verify `wrangler` CLI is installed (see `references/install-wrangler.md`)
- Authenticate with `wrangler login` (browser OAuth)
- Create or select an R2 bucket, enable public URL (`r2.dev` or custom domain)
- Save config to `.r2-upload.json`, create `.r2-manifest.json`, update `.gitignore`

**5b — Image Discovery & Download**
- Determine image needs from `section-plan.json` (see `references/image-sourcing-checklist.md`)
- Chrome DevTools MCP: navigate to reference pages, snapshot inspection
- Python `urllib` download from competitor/reference sites
- Unsplash/Pexels scraping via regex + `urllib`
- Avatar sources: `thispersondoesnotexist.com` or `randomuser.me`
- Screenshot fallback for CSS backgrounds / canvas / inline SVGs

**5c — Image Optimization**
- Resize oversized images (Pillow `LANCZOS`)
- Convert to WebP format
- Enforce file size budgets per section

**5d — Upload with MD5 Dedup**
- Read R2 config from `.r2-upload.json`
- Scan source folder, compute MD5 hashes
- Match against `.r2-manifest.json` — skip unchanged files
- Upload new/changed via `wrangler r2 object put --remote`
- Auth failure recovery: re-run `wrangler login`, retry once
- Update manifest after each upload

**5e — Verify & Record**
- Verify image URLs (HTTP HEAD)
- Write ALT text per semantic formula
- Record in `.landing-page/images.json`

### Phase 6: Audit & Optimize
- Desktop Lighthouse audit (Perf >= 95, A11y >= 95, BP >= 100, SEO >= 100)
- Mobile Lighthouse audit (same thresholds)
- Iterative fixes for LCP, CLS, TBT
- Run `npm run build` to verify

---

## State Management

State files live in `.landing-page/` within the project directory:

| File | Phase | Content |
|------|-------|---------|
| `state.json` | All | Current phase, completed phases, phase data |
| `project-context.json` | 0 | Framework, image service, brand tokens, existing pages |
| `brief.json` | 1 | Interview output (service, audience, competitors, evidence, conversion) |
| `section-plan.json` | 2 | Section layout plan, component mapping |
| `copy.json` | 3 | Approved copy per section |
| `images.json` | 5 | Image URLs, ALT text, format, dimensions |
| `.r2-upload.json` | 5 | R2 bucket config (project root, gitignored) |
| `.r2-manifest.json` | 5 | Upload dedup state (project root, gitignored) |
| `_images/` | 5 | Local image staging folder (project root, gitignored) |

---

## Integration Points

| Skill / MCP | Phase | Purpose |
|-------------|-------|---------|
| `/frontend-design` | 2, 4 | Design quality assurance |
| `image-sourcing + r2 upload` (embedded) | 5 | DevTools discovery, download, optimization, R2 upload with MD5 dedup |
| `chrome-devtools` MCP | 5, 6 | Image sourcing + Lighthouse audit |
| Project `CLAUDE.md` | 0 | Project structure conventions |
| Project `brand-guide` | 0 | Brand design tokens |
| Landing Page Writing Guide | 3 | Copy methodology (zero pollution, evidence escalation, title formula) |
| `references/image-sourcing-checklist.md` | 5 | Executable implementation reference for all Phase 5 sub-steps |
| `references/r2-config-schema.md` | 5 | `.r2-upload.json` and `.r2-manifest.json` schema documentation |
| `references/install-wrangler.md` | 5 | Wrangler CLI installation, auth, and troubleshooting |

---

## Quality Gates

| Gate | Criteria | Check |
|------|----------|-------|
| Copy | Zero information pollution | No "high quality", "professional team", generic claims |
| Copy | Evidence escalation | Specific action + number + time anchor + real person + verifiable |
| Copy | Entity coverage | Standards, parameters, scenarios, customization, comparison, quantification |
| Design | Brand compliance | Colors, typography, spacing match brand guide |
| Performance | Desktop Lighthouse | Perf >= 95, A11y >= 95, BP >= 100, SEO >= 100 |
| Performance | Mobile Lighthouse | Perf >= 95, A11y >= 95, BP >= 100, SEO >= 100 |
| Images | Format | WebP, compressed, appropriate dimensions |
| Images | ALT text | Semantic keywords included |
| Build | Compilation | `npm run build` succeeds with zero errors |
