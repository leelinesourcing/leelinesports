import fs from 'node:fs'

/**
 * Content images are staged in the `leelinesports` R2 bucket and served from the
 * custom domain below. `astro.config.mjs` whitelists this host, so the returned
 * URL can be handed straight to Astro's <Image>, which fetches the file at build
 * time and emits optimised local variants.
 *
 * Pass the slug only — the `.webp` extension is added here.
 */
const R2_BASE = 'https://img.leelinesports.com'

/**
 * Replacing an image reuses its key, but the custom domain sits behind a CDN that
 * holds objects for four hours — so a rebuild straight after an upload silently
 * bakes in the previous picture. Versioning the URL with the manifest's content
 * hash makes a changed object look new to the edge. The query is a build-time
 * detail only: <Image> downloads from here and ships a local file, so it never
 * reaches the page. Without the manifest (it is gitignored) URLs stay unversioned
 * and builds still work, just subject to the stale cache again.
 */
const hashes: Record<string, { hash?: string }> = (() => {
  try {
    // Resolved from the build's working directory rather than import.meta.url:
    // Astro bundles this module, so import.meta.url points into the bundle, not
    // at src/. `astro build` always runs from the project root.
    const manifest = fs.readFileSync(new URL('.r2-manifest.json', `file://${process.cwd()}/`), 'utf8')
    return JSON.parse(manifest)
  } catch {
    return {}
  }
})()

export const r2 = (slug: string) => {
  const key = `${slug}.webp`
  const version = hashes[key]?.hash
  return `${R2_BASE}/${key}${version ? `?v=${version.slice(0, 12)}` : ''}`
}
