// Upload staged images to R2 via wrangler, skipping anything whose MD5 already
// matches the manifest. See .claude/skills/r2-image-upload-skill/SKILL.md.
import { execFileSync } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const cfg = JSON.parse(fs.readFileSync('.r2-upload.json', 'utf8'))
const { bucket, publicUrl, sourceFolder } = cfg

let manifest = {}
try {
  manifest = JSON.parse(fs.readFileSync('.r2-manifest.json', 'utf8'))
} catch {
  console.log('manifest missing or invalid — starting from {}')
}

// Objects sit behind Cloudflare's CDN on img.leelinesports.com. Left unset, R2 hands
// them a four-hour cache, so replacing a picture under an unchanged key would stay
// invisible for hours. A short TTL keeps swap-to-live down to minutes.
//
// No space after the comma: the put below runs through a shell, which would split a
// spaced value into two arguments and make wrangler reject the command.
const CACHE_CONTROL = 'public,max-age=300'

const MIME = { '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.gif': 'image/gif', '.ico': 'image/x-icon' }

// Skip underscore-prefixed files — those are local review sheets, not content.
const files = fs.readdirSync(sourceFolder).filter((f) => !f.startsWith('_') && MIME[path.extname(f).toLowerCase()])
console.log(`${files.length} candidate files in ${sourceFolder}\n`)

let uploaded = 0, skipped = 0
const failed = []

for (const f of files.sort()) {
  const local = path.join(sourceFolder, f)
  const key = f // flat folder, so the key is just the filename
  const buf = fs.readFileSync(local)
  const hash = crypto.createHash('md5').update(buf).digest('hex')

  if (manifest[key]?.hash === hash) {
    console.log(`  skip   ${key}`)
    skipped++
    continue
  }

  try {
    execFileSync(
      'npx',
      ['wrangler', 'r2', 'object', 'put', `${bucket}/${key}`,
       '--file', local, '--content-type', MIME[path.extname(f).toLowerCase()],
       '--cache-control', CACHE_CONTROL, '--remote'],
      { stdio: 'pipe', env: process.env, shell: true }
    )
    manifest[key] = { hash, url: `${publicUrl}/${key}`, uploadedAt: new Date().toISOString() }
    // write after every success so an interrupted run keeps its progress
    fs.writeFileSync('.r2-manifest.json', JSON.stringify(manifest, null, 2))
    console.log(`  up     ${key}`)
    uploaded++
  } catch (e) {
    const msg = (e.stdout?.toString() || '') + (e.stderr?.toString() || '') || e.message
    console.log(`  FAIL   ${key} — ${msg.slice(0, 160)}`)
    failed.push(key)
  }
}

fs.writeFileSync('.r2-manifest.json', JSON.stringify(manifest, null, 2))
console.log(`\n${uploaded} uploaded, ${skipped} skipped, ${failed.length} failed`)
if (failed.length) console.log('failed:', failed.join(', '))
