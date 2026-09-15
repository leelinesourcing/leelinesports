/**
 * Content images live in the `leelinesports` R2 bucket behind the custom domain
 * below. The URLs go straight into the markup — pages load from R2 directly, so
 * there is no build-time fetch and no local copy to keep in step.
 *
 * Pass the slug only — the `.webp` extension is added here.
 *
 * Note: replacing an object reuses its key, so the custom domain's CDN keeps
 * serving the previous picture until its cache entry expires (four hours). Purge
 * that path when a swap needs to be visible sooner.
 */
const R2_BASE = 'https://img.leelinesports.com'

export const r2 = (slug: string) => `${R2_BASE}/${slug}.webp`
