# LeelineSports

## Project overview

The marketing site for LeelineSports, a custom sportswear manufacturer in Wuhan, China that
supplies private-label brands — OEM/ODM production from MOQ 100, AQL 2.5 inspection and DDP
delivery. The audience is B2B operators (Amazon FBA sellers, gym owners, team procurement
leads) who need to trust a supplier before placing a bulk order. The site is a static Astro
build styled with Tailwind CSS v4; there is no UI framework runtime — the only interactive
behaviour (scroll reveal, stat counters, nav state, mobile menu) is vanilla JS in
`src/scripts/site.js`. Tailwind is wired in through `@tailwindcss/vite` in `astro.config.mjs`,
and the build outputs to `dist/`. Cloudflare Workers is the intended host, but no adapter or
Wrangler config is in the repo yet — the build is currently fully static.

## Documentation

**All brand, colour, typography, spacing and image-treatment decisions live in
`docs/brand-guide.md`.** Read it before making any design decision. Never hard-code a hex
value or a font name — the guide lists every token and what it is for.

Full Astro documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Development

Start the dev server in background mode:

```
astro dev --background
```

Manage it with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## File structure

- **Components:** `src/components/` — PascalCase `.astro` files (e.g. `Hero.astro`,
  `SectionHead.astro`)
- **Pages:** `src/pages/` — lowercase with hyphens (e.g. `about.astro`)
- **Styles and tokens:** `src/styles/global.css`, with all design tokens under the `@theme`
  block in `src/styles/theme.css`

## Component rules — IMPORTANT

- Before building any new UI element, check `/design-system` for an existing component.
- If a match exists: import and reuse it — never rebuild what already exists.
- If no match exists: build the component in `src/components/`, add it to the design system
  page (`src/pages/design-system.astro`) with its name and file path, THEN use it in the page
  you're building.
- The design system page must always reflect every reusable component in `src/components/` —
  keep it updated.

## Styling rules

- All colours and fonts are defined as Tailwind tokens in `src/styles/theme.css` under
  `@theme`, which `src/styles/global.css` imports.
- Always use Tailwind utility classes with those tokens — never hard-code hex values or font
  names in components.
- To add a new colour or font, add it to `@theme` first, then use the class.

## Locked design

The homepage design is finished and the user has asked that it not be touched. Restructure
and harden the code behind it freely — but the rendered page must stay visually identical.
Verify the render after a refactor rather than assuming it.

## Image handling

- Content images (photos, hero images, team photos, blog thumbnails) belong in
  `src/assets/images/` — **NOT** in `public/`. If images are found in `public/images/`, move
  them to `src/assets/images/` and update all references.
- Always use Astro's `<Image>` component (from `astro:assets`) for content images stored in
  `src/assets/`. Import the image file, then pass it to `<Image>` with explicit `width` and
  `height` props matching the intended display size. This gives automatic format conversion,
  responsive srcset, and lazy loading.
- For external images from R2 buckets: first add the R2 domain to `image.domains` or
  `image.remotePatterns` in `astro.config.mjs`, then use Astro's `<Image>` component the same
  way as local images. Never use `<img>` as a shortcut just because the config is missing —
  update the config instead.
- For third-party URLs you don't control (not R2): use a standard `<img>` tag with explicit
  `width` and `height`.
- Always include these props on every `<Image>`: `width`, `height`, `quality={80}` (prevents
  blurry default compression). For any image that changes size across breakpoints or spans a
  responsive container, always include both `widths` (array of pixel widths for srcset —
  include 1x and 2x of the display size) and `sizes` (media query string matching your CSS
  breakpoints) — do not omit them on responsive images.
- Above-the-fold images (hero, header) must use `loading="eager"`, `fetchpriority="high"`,
  and `decoding="sync"`. All other images use `loading="lazy"` (Astro default).
- `public/` is only for system files that must be served at a fixed path: `favicon.ico`,
  `logo.svg`, `robots.txt`, OG images. No content images.
- Always include descriptive `alt` text on every image.

## Performance rules

- **Fonts:** Must be self-hosted via `@fontsource` or `@fontsource-variable` packages
  imported in `src/styles/global.css`. Never add Google Fonts `<link>` tags or `preconnect`
  hints to external font services — these add 1-2 seconds to first paint via render-blocking
  cross-origin requests.
- **`will-change`:** Avoid `will-change` entirely unless you are fixing a measured animation
  performance problem. Never put it in base CSS, never apply it to a selector that matches
  many elements, and never leave it on after an animation ends.
- **Below-fold sections:** Use `content-visibility: auto` with
  `contain-intrinsic-size: auto 600px` only on heavy, self-contained sections that start below
  the fold. Do not apply it to headers, heroes, sticky elements, footer, anchor-link target
  sections, or sections whose JS needs layout measurements before they enter the viewport.
- **No render-blocking external resources:** Do not add `<link rel="stylesheet">` to external
  domains in the `<head>`. All CSS and fonts must be same-origin (bundled into the `_astro/`
  directory).

## Visual work

When building or modifying any page, component, or visual element, load the
`/frontend-design` skill first. This ensures distinctive, high-quality design — not generic
AI output.

## After every set of code changes

Run `npm run lint:fix` to auto-fix, then `npm run lint` to confirm no errors — do this before
reporting done.
