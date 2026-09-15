// One-shot: convert the design JPG/PNGs to WebP and stage them in _images/.
// Capped at 1600px on the long edge — the widest slot on the page is the hero
// at 1440px, so anything larger is bytes nobody downloads. Never enlarged:
// several sources are small thumbnails and upscaling adds no detail.
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const SRC = 'C:/leelinesports/home'
const OUT = '_images'

// Source path (relative to SRC) -> staged slug. Sources are re-downloaded and
// re-filed by hand, so both the folder and the extension drift — keep the key on
// the current path or the entry silently reports MISSING SOURCE.
const MAP = {
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
}

fs.mkdirSync(OUT, { recursive: true })

// Recursive so files filed into subfolders still surface when unmapped; paths are
// normalised to forward slashes to match the MAP keys on every platform.
const missing = fs
  .readdirSync(SRC, { recursive: true })
  .map((f) => f.replaceAll('\\', '/'))
  .filter((f) => /\.(jpe?g|png|avif|webp)$/i.test(f) && !MAP[f])
if (missing.length) console.log('UNMAPPED, skipping:', missing.join(', '))

let done = 0
for (const [src, slug] of Object.entries(MAP)) {
  const from = path.join(SRC, src)
  if (!fs.existsSync(from)) { console.log('MISSING SOURCE:', src); continue }
  const to = path.join(OUT, `${slug}.webp`)
  const info = await sharp(from)
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(to)
  const meta = await sharp(from).metadata()
  console.log(
    `${slug}.webp`.padEnd(36),
    `${meta.width}x${meta.height}`.padEnd(11),
    `${(fs.statSync(from).size / 1024).toFixed(0)}KB -> ${(info.size / 1024).toFixed(0)}KB`
  )
  done++
}
console.log(`\n${done} converted to ${OUT}/`)
