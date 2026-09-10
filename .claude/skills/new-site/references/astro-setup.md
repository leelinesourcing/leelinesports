# Astro Project Setup

Read the brand brief from `.new-site/brief.md` to get the actual colors, fonts, and project name before starting.

---

## Step 1: Scaffold with the Astro CLI

**IMPORTANT:** The project root may already contain `.claude/` state files, which makes the directory non-empty and causes `create-astro` to behave unpredictably. Scaffold in a temp subdirectory, then move everything up.

```bash
npx create-astro@latest .astro-scaffold --template minimal --no-install --no-git --yes --skip-houston
mv .astro-scaffold/* .astro-scaffold/.* . 2>/dev/null; rm -rf .astro-scaffold
```

**What this does:**
1. Scaffolds into a clean empty `.astro-scaffold/` subdirectory (no interactive prompts)
2. Moves all files (including dotfiles like `.gitignore`, `.vscode/`) up to the project root
3. Removes the now-empty temp directory

**Flag breakdown:**
- `--yes` — accepts all defaults non-interactively
- `--skip-houston` — suppresses the animation
- `--no-install` — we install manually in a later step after adding all dependencies
- `--no-git` — git is managed separately

---

## Step 2: Add dependencies to `package.json`

Open the generated `package.json` and add to `dependencies`:

```json
"@astrojs/react": "^5.0.0",
"@astrojs/cloudflare": "^13.0.0",
"@tailwindcss/vite": "^4.0.0",
"react": "^19.0.0",
"react-dom": "^19.0.0",
"tailwindcss": "^4.0.0"
```

And to `devDependencies`:

```json
"wrangler": "^4.0.0"
```

Update `"name"` to the business name in kebab-case. Example: `"cosilio-interior-design"`.

---

## Step 3: Overwrite `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  adapter: cloudflare({
    imageService: 'compile',
  }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

> **Key settings:**
> - `output: 'static'` — no SSR needed for marketing sites. Serves pre-built HTML from Cloudflare's edge cache.
> - `imageService: 'compile'` — build-time image optimization. Set explicitly to avoid the adapter's default (`cloudflare-binding`) which requires separate binding setup.
> - Tailwind v4 uses a Vite plugin directly — no `@astrojs/tailwind` integration needed.

---

## Step 4: Create `wrangler.jsonc`

```jsonc
{
  "name": "[project-name]",
  "compatibility_date": "2026-03-01",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": {
    "directory": "./dist/client",
    "binding": "ASSETS"
  }
}
```

> `global_fetch_strictly_public` is required for the `imageService: 'compile'` endpoint (`/_image`) to work on Cloudflare Workers.

Also create `public/.assetsignore`:
```
_worker.js
_routes.json
```

---

## Step 5: Create the styles folder — 3 files

Colors and fonts are set per-direction. The theme defaults are populated from Direction 1's palette (from `directions.json`). Each direction page overrides these via CSS custom properties. Shape, spacing, and component styles are also per-direction — these come later (after the student picks a direction).

### `src/styles/global.css` — font imports + Tailwind + theme + base

Each direction has its own font pairing. Read `directions.json` to get the union of all unique font packages, then install and import all of them. After the student picks a direction (Lesson 5), unused fonts are removed.

```bash
# Install ALL font packages needed across all directions
npm install @fontsource-variable/[dir-1-heading] @fontsource-variable/[dir-1-body] \
            @fontsource-variable/[dir-2-heading] @fontsource-variable/[dir-2-body] \
            @fontsource-variable/[dir-3-heading] @fontsource-variable/[dir-3-body]
```

> **Example** (3 directions): `npm install @fontsource-variable/dm-serif-display @fontsource-variable/jost @fontsource-variable/playfair-display @fontsource-variable/inter @fontsource-variable/fraunces @fontsource-variable/dm-sans`

```css
/* Self-hosted variable fonts — all direction fonts loaded for prototyping.
   After picking a direction, Lesson 5 removes unused font imports. */
@import '@fontsource-variable/[dir-1-heading]';
@import '@fontsource-variable/[dir-1-body]';
@import '@fontsource-variable/[dir-2-heading]';
@import '@fontsource-variable/[dir-2-body]';
@import '@fontsource-variable/[dir-3-heading]';
@import '@fontsource-variable/[dir-3-body]';

@import "tailwindcss";
@import "./theme.css";
@import "./base.css";
```

> **IMPORTANT:** Font `@import` statements MUST come before the Tailwind import. Do NOT use Google Fonts `<link>` tags — they add 1-2 seconds to first paint via render-blocking cross-origin requests.
> **Note:** Deduplicate — if two directions share a font package, import it only once.

### `src/styles/theme.css` — brand identity token defaults

Read `directions.json` and populate defaults from **Direction 1's** palette and fonts.

Using `@theme` (not `@theme static`) so each direction page can override these values via CSS custom properties. `@theme` emits `:root` CSS custom properties AND generates Tailwind utility classes that reference them — enabling per-page overrides.

```css
/*
  Token → Utility mapping:
  --color-brand-*  → bg-brand-*, text-brand-*, border-brand-*, ring-brand-*
  --font-*         → font-heading, font-body

  NOTE: Using @theme (not @theme static) so direction pages can override
  via <style is:global> on :root. Defaults from Direction 1.
  After picking a direction, Lesson 5 switches to @theme static.
*/
@theme {
  /* ── Colors (defaults from Direction 1) ────── */
  --color-brand-primary:   [DIR_1_PRIMARY];
  --color-brand-secondary: [DIR_1_SECONDARY];
  --color-brand-accent:    [DIR_1_ACCENT];
  --color-brand-bg:        [DIR_1_BG];
  --color-brand-surface:   [DIR_1_SURFACE];
  --color-brand-text:      [DIR_1_TEXT];
  --color-brand-muted:     [DIR_1_MUTED];

  /* ── Typography (defaults from Direction 1) ── */
  --font-heading: '[Dir 1 Heading Font]', Georgia, serif;
  --font-body:    '[Dir 1 Body Font]', system-ui, sans-serif;
}
```

> **Color hints:** `surface` should be slightly off-bg. `muted` should be mid-tone for secondary text. Derive from the direction's palette.

> **Not here yet:** Radius, shadows, spacing, layout utilities, and component classes (`btn-primary`, `card-surface`, `section-container`) are added after the student picks a direction. Each prototype direction makes these choices independently.

### `src/styles/base.css` — element defaults

```css
@layer base {
  body {
    @apply bg-brand-bg text-brand-text font-body;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-heading;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }
}
```

---

## Step 6: Create `src/layouts/Layout.astro`

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = '' } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

> **No Google Fonts `<link>` tags.** Fonts are self-hosted via `@fontsource-variable` packages and imported in `global.css`. This eliminates the render-blocking cross-origin font loading chain.

---

## Step 7: Run `npm install` and verify

```bash
npm install
npm run dev
```

Should start at `localhost:4321`. Common errors:
1. **Tailwind v4 config error** — ensure `@tailwindcss/vite` is the Vite plugin, not `@astrojs/tailwind`
2. **Missing adapter** — check `@astrojs/cloudflare` is in dependencies
3. **React peer dependency** — react and react-dom versions must match `@astrojs/react`
4. **Fontsource package not found** — double-check the package name. Search npm for `@fontsource-variable/[font-name]`. Some fonts use hyphens (e.g. `dm-sans`), some don't.

Stop the dev server (`Ctrl+C`) before spawning sub-agents.

---

## Astro `<style>` Block Gotcha

If a component uses a `<style>` block and needs `@apply` with brand tokens (colors, fonts), it must include `@reference` pointing to global.css:

```astro
<style>
  @reference "../../styles/global.css";

  .my-element {
    @apply font-heading text-brand-primary;
  }
</style>
```

The relative path depends on where the component lives. Prefer Tailwind utility classes in markup over `<style>` blocks when possible — it avoids this entirely.
