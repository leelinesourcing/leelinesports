// Stage the cycling page's images into _images/ as WebP.
//
// Unlike stage-r2-images.mjs, this one downloads as well as converts: the
// cycling page's artwork was never filed into a C:/leelinesports/ folder, so the
// sources live on the wire. Downloads are cached in _images/_src/ (underscore-
// prefixed, so upload-r2.mjs skips the directory) and reused on later runs.
//
// Two source families:
//   - leelinesports.com — our own legacy WordPress uploads. Clean product
//     mockups cut out on white, 550px. Perfect for the small mosaic tiles,
//     where the rendered box is ~270px, and too small for anything larger.
//   - the reference manufacturer pages — the only cycling photography available
//     on this network. Unsplash, Pexels, Openverse and Wikimedia are all
//     unreachable from here (bot challenges and connection resets), so the hero
//     and the bib-shorts anatomy plate come from these instead.
//
// Nothing is upscaled: several sources are 550px and enlarging them would only
// add bytes. The 1600px cap matches stage-r2-images.mjs.
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '_images'
const CACHE = path.join(OUT, '_src')

const LEGACY = 'https://www.leelinesports.com/wp-content/uploads/2024/09'
const ATTIRIFY = 'https://attirify.com/wp-content/uploads/2026/04'
const PAMOO = 'https://pamooinds.com/wp-content/uploads/2026/02'

// Remote URL -> staged slug. Slugs are kebab-case and read as the caption the
// image carries, following the golf page's convention.
const REMOTE_MAP = {
  // Hero — the only true cycling photograph available. Landscape, 2000x1333.
  [`${ATTIRIFY}/cycling-clothing-header.webp`]: 'cycling-hero',

  // Product mosaic, small tiles. Our own legacy product shots: cut out on white,
  // which is why the tile frames are paper rather than linen.
  [`${LEGACY}/Custom-Cycling-Vests.webp`]: 'cycling-vest',
  [`${LEGACY}/Custom-Cycling-Jackets.webp`]: 'cycling-jacket',
  [`${LEGACY}/Custom-Cycling-Windbreakers.webp`]: 'cycling-windbreaker',
  [`${LEGACY}/Custom-Cycling-Skinsuits.webp`]: 'cycling-skinsuit',
  [`${LEGACY}/Custom-Cycling-Socks.webp`]: 'cycling-socks',
  [`${LEGACY}/Custom-Cycling-Leg-Warmers-2.webp`]: 'cycling-leg-warmers',
  [`${LEGACY}/Custom-Cycling-Caps.webp`]: 'cycling-cap',

  // Product mosaic, large frames.
  [`${LEGACY}/Custom-Cycling-Jerseys.webp`]: 'cycling-jersey',
  [`${LEGACY}/Custom-Cycling-Bib-Shorts.webp`]: 'cycling-bib-shorts',

  // The annotated plate. Third-party, but the cleanest chamois-and-gripper shot
  // that exists here at 1000px, front-on and on a plain ground — the shape the
  // numbered callouts need to read against.
  [`${PAMOO}/custom-cycling-manufacturer-12.webp`]: 'cycling-bib-anatomy',

  // A worn detail, for the proof ledger. Not a product shot: gloves and bar tape
  // in use, which is the point — it shows the parts a buyer cannot inspect from
  // a flat lay.
  [`${ATTIRIFY}/cycling-gloves.webp`]: 'cycling-detail-gloves',
}

fs.mkdirSync(CACHE, { recursive: true })

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'

/** Download once, then reuse — re-runs should not re-hit the origin. */
async function fetchCached(url, slug) {
  const ext = path.extname(new URL(url).pathname) || '.bin'
  const target = path.join(CACHE, slug + ext)
  if (fs.existsSync(target) && fs.statSync(target).size > 2048) return target

  const res = await fetch(url, {
    headers: { 'user-agent': UA, referer: new URL(url).origin + '/' },
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  const buf = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(target, buf)
  return target
}

let done = 0
for (const [url, slug] of Object.entries(REMOTE_MAP)) {
  let src
  try {
    src = await fetchCached(url, slug)
  } catch (err) {
    console.log('FETCH FAILED:', slug, '-', err.message)
    continue
  }

  const to = path.join(OUT, `${slug}.webp`)
  try {
    const info = await sharp(src)
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(to)
    const meta = await sharp(src).metadata()
    console.log(
      `${slug}.webp`.padEnd(28),
      `${meta.width}x${meta.height}`.padEnd(11),
      `${(fs.statSync(src).size / 1024).toFixed(0)}KB -> ${(info.size / 1024).toFixed(0)}KB`
    )
    done++
  } catch (err) {
    console.log('CONVERT FAILED:', slug, '-', err.message)
  }
}

console.log(`\n${done} staged into ${OUT}/`)
