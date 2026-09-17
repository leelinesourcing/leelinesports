// One-shot: convert the design JPG/PNGs to WebP and stage them in _images/.
// Capped at 1600px on the long edge — the widest slot on the page is the hero
// at 1440px, so anything larger is bytes nobody downloads. Never enlarged:
// several sources are small thumbnails and upscaling adds no detail.
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const OUT = '_images'

// Source path (relative to the root) -> staged slug. Sources are re-downloaded and
// re-filed by hand, so both the folder and the extension drift — keep the key on
// the current path or the entry silently reports MISSING SOURCE.
//
// Slugs shared with another page must appear in only one map, and the entry has to
// point at the file the *page that owns it* was built from. certificate-*, mark-*
// and reviewer-1 belong to the homepage and are deliberately absent from GOLF_MAP
// below, even though the golf page renders them too.
const HOME_MAP = {
  // hero/
  'hero/Custom Sportswear Manufacturers.jpg': 'custom-sportswear-manufacturers',

  // What we make/
  'What we make/Golf Apparel.webp': 'golf-apparel',
  'What we make/Cycling Apparel.jpg': 'cycling-apparel',
  'What we make/T-Shirts.jpg': 't-shirts',
  'What we make/Tennis Clothing.jpg': 'tennis-clothing',
  'What we make/Custom Socks.avif': 'custom-socks',
  'What we make/Towel.jpg': 'towel',
  'What we make/Hunting Clothing.jpg': 'hunting-clothing',
  'What we make/Underwear.jpg': 'underwear',
  'What we make/Swimwear.jpg': 'swimwear',
  'What we make/Work Uniform.jpg': 'work-uniform',
  'What we make/Gym Clothing.webp': 'gym-clothing',
  'What we make/Custom Hawaiian Shirts.jpg': 'custom-hawaiian-shirts',
  'What we make/Fishing Apparel.webp': 'fishing-apparel',
  'What we make/Baseball Apparel.avif': 'baseball-apparel',
  'What we make/Basketball Apparel.jpg': 'basketball-apparel',
  'What we make/Yoga Apparel.webp': 'yoga-apparel',
  'What we make/Ice Hockey Wear.jpg': 'ice-hockey-wear',
  'What we make/Soccer Apparel.jpg': 'soccer-apparel',

  // What we customise/
  'What we customise/Moisture-wicking.jpg': 'moisture-wicking',
  'What we customise/4-way stretch.jpg': '4-way-stretch',
  'What we customise/UV protection.jpg': 'uv-protection',
  'What we customise/Compression fit.jpg': 'compression-fit',
  'What we customise/Antimicrobial.jpg': 'antimicrobial',
  'What we customise/Flatlock seams.jpg': 'flatlock-seams',
  'What we customise/Laser-cut ventilation.jpg': 'laser-cut-ventilation',
  'What we customise/Abrasion-resistant panels.jpg': 'abrasion-resistant-panels',
  'What we customise/Sleeve length & sizing.jpg': 'sleeve-length-sizing',
  'What we customise/Embroidery & screen printing.jpg': 'embroidery-screen-printing',
  'What we customise/Packaging.jpg': 'packaging',
  'What we customise/Labels.png': 'labels',

  // Client showcase/
  'Client showcase/Client showcase1.avif': 'client-showcase-1',
  'Client showcase/Client showcase2.webp': 'client-showcase-2',
  'Client showcase/Client showcase3.webp': 'client-showcase-3',
  'Client showcase/Client showcase4.jpg': 'client-showcase-4',
  'Client showcase/Client showcase5.webp': 'client-showcase-5',
  'Client showcase/Client showcase6.avif': 'client-showcase-6',
  'Client showcase/Client showcase7.jpg': 'client-showcase-7',
  'Client showcase/Client showcase8.webp': 'client-showcase-8',

  // Other/ (the three portrait files here are testimonial avatars, which live in
  // src/assets/images/ rather than R2 — see Testimonials.astro)
  'Other/The mess we handle.webp': 'the-mess-we-handle',
  'Other/Cost control.jpg': 'cost-control',
  'Other/Sustainable production.jpg': 'sustainable-production',
  'Other/After-sales support.jpg': 'after-sales-support',
  'Other/FBA prep & injection..jpg': 'fba-prep-injection',
  'Other/How it works.jpg': 'how-it-works',
  'Other/Compression wear · Amazon.jpg': 'compression-wear-amazon',
  'Other/Team apparel · CrossFit network.jpg': 'team-apparel-crossfit-network',
  'Other/Swim & outdoor · UPF line.jpg': 'swim-outdoor-upf-line',

  // Certifications/ — certificate scans (linked full-size from the thumbnail)
  // and the four standards marks beside them.
  'Certifications/certificate-1.webp': 'certificate-1',
  'Certifications/certificate-2.webp': 'certificate-2',
  'Certifications/certificate-3.webp': 'certificate-3',
  'Certifications/mark-gots.webp': 'mark-gots',
  'Certifications/mark-ISO.webp': 'mark-iso',
  'Certifications/mark-ISO-alt.webp': 'mark-iso-alt',
  'Certifications/mark-bsci.webp': 'mark-bsci',

  // Brand/ — the footer wordmark and the testimonial avatars.
  'Brand/logo.png': 'registered-mark',
  'Brand/reviewer-1.webp': 'reviewer-1',
  'Brand/reviewer-2.webp': 'reviewer-2',
  'Brand/reviewer-3.webp': 'reviewer-3',
}

// Golf page. Flat folder, no subfolders. Every slug here is golf-only — the
// certificate scans, standards marks and reviewer-1 avatar the golf page also
// renders are owned by HOME_MAP and must not be re-staged from this folder, or
// the homepage would change with it.
//
// Slugs are the kebab-case of the source filename, so an R2 address reads as the
// title the image is filed under: `Custom Golf Pants.jpg` -> `custom-golf-pants`.
// Ampersands become `and`, accents and apostrophes are dropped (`Piqué` ->
// `pique`, `Women’s` -> `womens`). The one exception is reviewer-1: Daniel
// Kessler's avatar is shared with the homepage, so it keeps HOME_MAP's name even
// though the golf folder files it as `Daniel Kessler.jpg`.
const GOLF_MAP = {
  // Hero — the background photograph behind the golf hero copy. Landscape, so it
  // is the one file here that is wider than it is tall.
  //
  // Cropped, not resized: the source carries a "Grok" generation watermark in its
  // bottom-right corner, and `object-fit: cover` keeps that corner visible at
  // hero widths. The mark ends at y≈1047 of 1056, so the bottom 64px come off.
  // If a clean file is ever supplied, drop the crop and keep the slug.
  //
  // Graded for a sunny read: brighter and more neutral than the source, which is
  // a warm, brown-cast frame with half its pixels near black and the top decile
  // near white.
  //
  // Warmth was tried and rejected — pushing red over blue a little made the whole
  // hero read yellow, not sunny. The fix is exposure plus a slight blue lift
  // (red pulled, blue raised) so the cast lands near neutral, and enough slope
  // that the light reads crisp rather than flat. An earlier attempt went the
  // other way and flattened the tone towards the legacy site's greener hero,
  // which only drained the life out of it.
  'Golf Apparel Manufacturer.jpg': {
    slug: 'golf-apparel-manufacturer',
    crop: { left: 0, top: 0, width: 1872, height: 992 },
    grade: {
      slope: 1.3,
      offset: 12,
      recomb: [[0.94, 0, 0], [0, 1, 0], [0, 0, 1.14]],
      saturation: 1.1,
    },
  },

  // What we make — nine categories, filenames match the card titles exactly.
  'Custom Golf Jackets.avif': 'custom-golf-jackets',
  'Custom Golf Vests.jpg': 'custom-golf-vests',
  'Custom Golf Outerwear.webp': 'custom-golf-outerwear',
  'Custom Golf Shorts.webp': 'custom-golf-shorts',
  'Custom Golf Pants.jpg': 'custom-golf-pants',
  'Custom Golf Skirts.webp': 'custom-golf-skirts',
  'Custom Golf Polo Shirts.webp': 'custom-golf-polo-shirts',
  'Custom Golf Visors.webp': 'custom-golf-visors',
  'Custom Golf Socks.jpg': 'custom-golf-socks',

  // Customisation 01 — fabrics. One word per fabric, straight off the filename.
  'Piqué.jpg': 'pique',
  'Interlock.jpg': 'interlock',
  'Softshell.jpg': 'softshell',
  'Stretch woven.webp': 'stretch-woven',
  'Waffle knit.jpg': 'waffle-knit',
  'Single jersey.jpg': 'single-jersey',

  // Customisation 02 — collars.
  'Zipper collar.webp': 'zipper-collar',
  'Contrast colour collar.webp': 'contrast-colour-collar',
  'Mandarin collar.avif': 'mandarin-collar',
  'Rib knit collar.webp': 'rib-knit-collar',
  'Self-fabric collar.webp': 'self-fabric-collar',
  'Striped collar.avif': 'striped-collar',

  // Customisation 03 and 04 — the Colour and Decoration cards.
  'Colour.jpg': 'colour',
  'Decoration.jpg': 'decoration',

  // Core customers — filenames match the profile names.
  'Golf clubs & pro shops.avif': 'golf-clubs-and-pro-shops',
  'Corporate outings & event planners.jpg': 'corporate-outings-and-event-planners',
  'Women’s & sustainable lines.webp': 'womens-and-sustainable-lines',
  'Golf academies & coaches.webp': 'golf-academies-and-coaches',
  'DTC & independent brands.webp': 'dtc-and-independent-brands',
  'Tournament organisers.webp': 'tournament-organisers',

  // Services — filenames match the service titles.
  'OEM & ODM production.webp': 'oem-and-odm-production',
  'Manufacturing & quality control.webp': 'manufacturing-and-quality-control',
  'Logistics & FBA prep.jpg': 'logistics-and-fba-prep',

  // Reviews — Sarah Thompson's avatar. Daniel Kessler's is reviewer-1, owned by
  // HOME_MAP (the same testimonial is published on the homepage).
  'Sarah Thompson.webp': 'sarah-thompson',
}

const SOURCES = [
  { root: 'C:/leelinesports/home', map: HOME_MAP },
  { root: 'C:/leelinesports/Golf Apparel Manufacturer', map: GOLF_MAP },
]

fs.mkdirSync(OUT, { recursive: true })

// Optional substring filter, so one page's set can be re-staged without
// rewriting every other page's files: `node scripts/stage-r2-images.mjs golf`
const filter = process.argv[2]
const selected = filter
  ? SOURCES.filter((s) => s.root.toLowerCase().includes(filter.toLowerCase()))
  : SOURCES
if (!selected.length) {
  console.log(`no source root matches "${filter}"`)
  process.exit(1)
}

let done = 0
for (const { root, map } of selected) {
  // Recursive so files filed into subfolders still surface when unmapped; paths are
  // normalised to forward slashes to match the map keys on every platform.
  const missing = fs
    .readdirSync(root, { recursive: true })
    .map((f) => f.replaceAll('\\', '/'))
    .filter((f) => /\.(jpe?g|png|avif|webp)$/i.test(f) && !map[f])
  if (missing.length) console.log(`UNMAPPED in ${root}, skipping:`, missing.join(', '))

  for (const [src, entry] of Object.entries(map)) {
    // An entry is either the slug alone, or { slug, crop, grade } when the source
    // needs trimming and/or a colour grade. sharp runs extract first, then the
    // resize, then the grade, so the grade numbers are measured against the
    // staged dimensions rather than the raw file.
    const slug = typeof entry === 'string' ? entry : entry.slug
    const crop = typeof entry === 'string' ? null : entry.crop
    const grade = typeof entry === 'string' ? null : entry.grade

    const from = path.join(root, src)
    if (!fs.existsSync(from)) { console.log('MISSING SOURCE:', src); continue }
    const to = path.join(OUT, `${slug}.webp`)
    let pipe = sharp(from)
    if (crop) pipe = pipe.extract(crop)
    pipe = pipe.resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    if (grade) {
      pipe = pipe.linear(grade.slope, grade.offset)
      if (grade.recomb) pipe = pipe.recomb(grade.recomb)
      if (grade.saturation) pipe = pipe.modulate({ saturation: grade.saturation })
    }
    const info = await pipe
      .webp({ quality: 80, effort: 6 })
      .toFile(to)
    const meta = crop
      ? { width: crop.width, height: crop.height }
      : await sharp(from).metadata()
    console.log(
      `${slug}.webp`.padEnd(36),
      `${meta.width}x${meta.height}`.padEnd(11),
      `${(fs.statSync(from).size / 1024).toFixed(0)}KB -> ${(info.size / 1024).toFixed(0)}KB`
    )
    done++
  }
}
console.log(`\n${done} converted to ${OUT}/`)
