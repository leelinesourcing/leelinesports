/**
 * Content images live in the `leelinesports` R2 bucket behind the custom domain
 * below. The URLs go straight into the markup — pages load from R2 directly, so
 * there is no build-time fetch and no local copy to keep in step.
 *
 * Pass the slug only — the `.webp` extension is added here.
 *
 * ── Why every URL carries `?v=` ──────────────────────────────────────────────
 * Replacing an object reuses its key, and an object overwritten in place is not
 * reliably served afterwards: after the 2026-09-18 image swap, `curl` against
 * the custom domain still returned the *previous* bytes for eight keys while
 * `cf-cache-status` reported DYNAMIC, and `wrangler r2 object put` had reported
 * success. Purging needs a token scope this project does not have.
 *
 * A query string is part of the cache key, so bumping IMAGE_VERSION changes
 * every image URL at once and guarantees a miss. **Bump it whenever images are
 * replaced in place** — that is the whole mechanism, and the numbers are meant
 * to go up over time rather than be tidied.
 */
const R2_BASE = 'https://img.leelinesports.com'

const IMAGE_VERSION = 3

export const r2 = (slug: string) => `${R2_BASE}/${slug}.webp?v=${IMAGE_VERSION}`
