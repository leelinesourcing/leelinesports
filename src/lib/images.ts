/**
 * Content images are staged in the `leelinesports` R2 bucket and served from the
 * custom domain below. `astro.config.mjs` whitelists this host, so the returned
 * URL can be handed straight to Astro's <Image>, which fetches the file at build
 * time and emits optimised local variants.
 *
 * Pass the slug only — the `.webp` extension is added here.
 */
const R2_BASE = 'https://img.leelinesports.com'

export const r2 = (slug: string) => `${R2_BASE}/${slug}.webp`
