// One-shot: convert the design JPG/PNGs to WebP and stage them in _images/.
// Capped at 1600px on the long edge — the widest slot on the page is the hero
// at 1440px, so anything larger is bytes nobody downloads. Never enlarged:
// several sources are small thumbnails and upscaling adds no detail.
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const SRC = 'C:/leelinesports/home'
const OUT = '_images'

// source filename -> staged slug
const MAP = {
  'Custom Sportswear Manufacturers.jpg': 'custom-sportswear-manufacturers',
  'Client showcase1.jpg': 'client-showcase-1',
  'Client showcase2.jpg': 'client-showcase-2',
  'Client showcase3.jpg': 'client-showcase-3',
  'Client showcase4.jpg': 'client-showcase-4',
  'Client showcase5.jpg': 'client-showcase-5',
  'Client showcase6.jpg': 'client-showcase-6',
  'Client showcase7.jpg': 'client-showcase-7',
  'Client showcase8.jpg': 'client-showcase-8',
  'Golf Apparel.jpg': 'golf-apparel',
  'Cycling Apparel.jpg': 'cycling-apparel',
  'T-Shirts.jpg': 't-shirts',
  'Tennis Clothing.jpg': 'tennis-clothing',
  'Custom Socks.jpg': 'custom-socks',
  'Towel.jpg': 'towel',
  'Hunting Clothing.jpg': 'hunting-clothing',
  'Underwear.jpg': 'underwear',
  'Swimwear.jpg': 'swimwear',
  'Work Uniform.jpg': 'work-uniform',
  'Gym Clothing.jpg': 'gym-clothing',
  'Custom Hawaiian Shirts.jpg': 'custom-hawaiian-shirts',
  'Fishing Apparel.jpg': 'fishing-apparel',
  'Baseball Apparel.jpg': 'baseball-apparel',
  'Basketball Apparel.jpg': 'basketball-apparel',
  'Yoga Apparel.jpg': 'yoga-apparel',
  'Ice Hockey Wear.jpg': 'ice-hockey-wear',
  'Soccer Apparel.jpg': 'soccer-apparel',
  'The mess we handle.jpg': 'the-mess-we-handle',
  'Moisture-wicking.jpg': 'moisture-wicking',
  '4-way stretch.jpg': '4-way-stretch',
  'UV protection.jpg': 'uv-protection',
  'Compression fit.jpg': 'compression-fit',
  'Antimicrobial.jpg': 'antimicrobial',
  'Flatlock seams.jpg': 'flatlock-seams',
  'Laser-cut ventilation.jpg': 'laser-cut-ventilation',
  'Abrasion-resistant panels.jpg': 'abrasion-resistant-panels',
  'Sleeve length & sizing.png': 'sleeve-length-sizing',
  'Embroidery & screen printing.jpg': 'embroidery-screen-printing',
  'Packaging.jpg': 'packaging',
  'Labels.jpg': 'labels',
  'Cost control.jpg': 'cost-control',
  'Sustainable production.jpg': 'sustainable-production',
  'After-sales support.jpg': 'after-sales-support',
  'FBA prep & injection..jpg': 'fba-prep-injection',
  'How it works.jpg': 'how-it-works',
  'Compression wear · Amazon.jpg': 'compression-wear-amazon',
  'Team apparel · CrossFit network.jpg': 'team-apparel-crossfit-network',
  'Swim & outdoor · UPF line.jpg': 'swim-outdoor-upf-line',
}

fs.mkdirSync(OUT, { recursive: true })

const missing = fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png)$/i.test(f) && !MAP[f])
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
