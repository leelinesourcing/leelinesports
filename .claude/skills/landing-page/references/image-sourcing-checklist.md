# Phase 5: Image Sourcing & Upload — Complete Reference

Comprehensive implementation reference covering all 5 sub-phases: R2 setup, image discovery/download, optimization, MD5-dedup upload, and verification.

```
Phase 5 ── 5a R2 Setup (one-time) ── 5b Discovery+Download ── 5c Optimize ── 5d Upload with Dedup ── 5e Verify
              │                          │                       │              │                      │
              ├─ Check config            ├─ Read section-plan    ├─ Pillow     ├─ Read config         ├─ HEAD URLs
              ├─ Install wrangler        ├─ Chrome DevTools      │  LANCZOS    ├─ Load manifest       ├─ Write ALT text
              ├─ wrangler login          ├─ Unsplash/Pexels      ├─ WebP       ├─ MD5 scan            ├─ images.json
              ├─ Create bucket           ├─ Avatar sources       │  convert    ├─ wrangler --remote   │
              ├─ Enable public URL       ├─ Screenshot fallback  └─ Size       ├─ Auth recovery       │
              ├─ .r2-upload.json         └─ Naming convention       budgets   └─ Update manifest     │
              └─ .gitignore                                                                    └─ Quality check
```

---

## Prerequisites Check

Before starting Phase 5, verify these are available:

1. **Chrome DevTools MCP** — the `mcp__chrome-devtools__*` tools must be present for reference browsing
2. **Python 3** — verify with `python --version` (needed for Pillow optimization and urllib downloads)
3. **Pillow library** — install if missing: `pip install Pillow`
4. **Wrangler CLI** — verify with `wrangler --version`. If missing, follow `references/install-wrangler.md`
5. **Project `.landing-page/section-plan.json`** — determines what images are needed
6. **Local staging folder** — create if missing: `mkdir -p _images`

---

## 5a: R2 First-Run Setup

Run this only once per project. If `.r2-upload.json` already exists, skip to 5b.

### 5a.1 Check Existing Config

```python
import json, os

if os.path.exists('.r2-upload.json'):
    with open('.r2-upload.json') as f:
        config = json.load(f)
    print(f'R2 already configured: bucket={config["bucket"]}, publicUrl={config["publicUrl"]}')
    # Skip to 5b
```

### 5a.2 Check Wrangler CLI

```bash
# Determine which command prefix works
wrangler --version
# If that fails:
npx wrangler --version
```

Store the working prefix (`wrangler` or `npx wrangler`) for all subsequent commands in this session.

### 5a.3 Authenticate with Cloudflare

```bash
# Check if already authenticated
wrangler whoami
# If not logged in:
wrangler login  # opens browser for OAuth
```

If on a headless/remote machine, use `CLOUDFLARE_API_TOKEN` in `.env` instead (see `references/install-wrangler.md`).

### 5a.4 Create or Select R2 Bucket

```bash
# List existing buckets
wrangler r2 bucket list
```

- If one bucket exists → suggest it as default
- If multiple → ask which one to use
- If none → create one:

```bash
wrangler r2 bucket create <project-name>-images
```

Suggest `<project-name>-images` based on the current directory name.

### 5a.5 Enable Public Access

```bash
wrangler r2 bucket dev-url enable <bucket-name> -y
wrangler r2 bucket dev-url get <bucket-name>
# Returns something like: https://pub-abc123.r2.dev
```

### 5a.6 Ask About Custom Domain

Ask the user: **"Do you have a domain on Cloudflare you'd like to use for images?"**

- **If yes** → Dashboard-only setup:
  1. Go to **Cloudflare Dashboard** → **R2** → select bucket → **Settings**
  2. Under **Custom Domains**, click **Connect Domain**
  3. Enter subdomain like `images.yourdomain.com`
  4. Wait for status to show Active
  5. Use `https://images.yourdomain.com` as the public URL
- **If no** → use the r2.dev URL from step 5a.5

### 5a.7 Configure Source Folder

Ask: **"Which folder should images be staged in?"** (default: `_images/`)

```bash
mkdir -p _images
```

### 5a.8 Save Config to `.r2-upload.json`

```python
config = {
    "bucket": "<bucket-name>",
    "publicUrl": "https://images.yourdomain.com or https://pub-abc123.r2.dev",
    "sourceFolder": "_images/"
}
with open('.r2-upload.json', 'w') as f:
    json.dump(config, f, indent=2)
```

### 5a.9 Create Empty Manifest

```python
with open('.r2-manifest.json', 'w') as f:
    json.dump({}, f)
```

### 5a.10 Set Up `.env` Template

```bash
# Create if not exists
if [ ! -f .env ]; then
    echo '# Cloudflare credentials (wrangler reads this automatically)' > .env
    echo '# Uncomment and add your token if wrangler login expires:' >> .env
    echo '# CLOUDFLARE_API_TOKEN=your_token_here' >> .env
fi
```

### 5a.11 Update `.gitignore`

Check for and append any missing entries (do NOT overwrite existing content):

```
_images/
.env
.r2-upload.json
.r2-manifest.json
.wrangler/
```

### 5a.12 Verification Checklist

- [ ] `wrangler whoami` shows authenticated account
- [ ] `.r2-upload.json` exists with valid bucket, publicUrl, sourceFolder
- [ ] `.r2-manifest.json` exists as `{}`
- [ ] `.gitignore` contains all 5 R2-related entries
- [ ] Source folder exists (e.g., `_images/`)

---

## 5b: Image Discovery & Download

### 5b.1 Determine Image Needs from `section-plan.json`

```python
import json

with open('.landing-page/section-plan.json') as f:
    plan = json.load(f)

sections = plan.get('sections', [])
print(f'Found {len(sections)} sections requiring images')
for s in sections:
    print(f'  {s.get("id", "?")}: {s.get("name", "?")}')
```

Cross-reference with the Image Types Needed Per Section table at the end of this doc.

### 5b.2 Chrome DevTools Navigate + Snapshot

```bash
# Navigate to a reference competitor or inspiration site
# Use the chrome-devtools MCP:
mcp__chrome-devtools__navigate_page(type="url", url="<target-url>")
mcp__chrome-devtools__take_snapshot()
```

Scan the snapshot for:
- `<img>` elements — product photos, avatars, logos, illustrations
- Background images on `<div>` or `<section>` elements
- SVG icons and illustrations

### 5b.3 Inspect Image Quality

Evaluate each candidate image's quality before downloading:

```javascript
// Check natural dimensions and current source
(el) => ({ w: el.naturalWidth, h: el.naturalHeight, src: el.currentSrc || el.src })
```

```javascript
// Verify image is fully loaded
(el) => el.complete && el.naturalWidth > 0
```

Minimum acceptable:
- Avatars: 200x200px
- Hero images: 800px width
- Section images: 600px width
- Prefer images at least 2x the display size (retina)

### 5b.4 Handle Lazy-Loaded Images

```javascript
// Scroll all lazy images into view to trigger loading
document.querySelectorAll('img[loading="lazy"], img[data-src]').forEach(el => {
    el.scrollIntoView({ behavior: 'instant', block: 'center' });
});
```

Wait briefly (1-2 seconds) for images to load before extracting URLs.

### 5b.5 Python `urllib` Download with Naming Convention

```python
import urllib.request, os, ssl

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Referer': '<page-url>'
}

url = '<image-url>'
filename = '<descriptive-name>.jpg'
filepath = '_images/<subfolder>/' + filename

os.makedirs(os.path.dirname(filepath), exist_ok=True)
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, context=ssl_ctx, timeout=30) as resp:
    with open(filepath, 'wb') as f:
        f.write(resp.read())

print(f'Downloaded: {filepath} ({os.path.getsize(filepath)/1024:.1f} KB)')
```

### 5b.6 Screenshot Fallback for CSS Backgrounds

When an image can't be directly downloaded (CSS background, canvas, inline SVG):

```bash
mcp__chrome-devtools__take_screenshot(uid="<element-uid>", filePath="_images/<filename>.png")
```

### 5b.7 Unsplash: Search + Download

```python
import urllib.request, json, ssl, os, re

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}

query = "manufacturing plant worker"  # Be specific, not generic "business"
url = f'https://unsplash.com/s/photos/{query.replace(" ", "-")}'
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, context=ssl_ctx, timeout=20) as resp:
    html = resp.read().decode('utf-8', errors='replace')

# Extract image URLs from the page
image_urls = re.findall(r'https://images\.unsplash\.com/[^"\'\s?]+', html)

# Deduplicate and add sizing
seen = set()
for img_url in image_urls:
    if img_url not in seen:
        seen.add(img_url)
        download_url = img_url + '?w=1200&q=80&fit=crop'
        print(download_url)
```

**Unsplash Attribution**: Images are free for commercial use but the license asks for attribution where possible. Keep a record of photo URLs.

### 5b.8 Pexels: Search + Download

```python
import urllib.request, ssl, re

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
}

query = "manufacturing"
url = f'https://www.pexels.com/search/{query.replace(" ", "%20")}/'
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, context=ssl_ctx, timeout=20) as resp:
    html = resp.read().decode('utf-8', errors='replace')

# Pexels images are on their CDN
image_urls = re.findall(r'https://images\.pexels\.com/photos/\d+/[^"\'\s]+\.(?:jpeg|jpg)', html)

for img_url in set(image_urls):
    download_url = img_url + '?w=1200&auto=compress'
    print(download_url)
```

### 5b.9 Avatar Sources

**ThisPersonDoesNotExist.com** (AI-generated faces, 1024x1024):

```python
headers = {'User-Agent': 'Mozilla/5.0'}
ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

for i in range(15):
    req = urllib.request.Request('https://thispersondoesnotexist.com/', headers=headers)
    with urllib.request.urlopen(req, context=ssl_ctx, timeout=15) as resp:
        data = resp.read()
    with open(f'_images/avatar_{i+1:02d}.jpg', 'wb') as f:
        f.write(data)
```

**Note**: Quality varies. Resize to 400x400 for web use (see 5c).

**RandomUser.me** (diverse realistic portraits):

```python
import json

req = urllib.request.Request('https://randomuser.me/api/?results=20', headers=headers)
with urllib.request.urlopen(req, context=ssl_ctx, timeout=15) as resp:
    data = json.loads(resp.read())

for i, user in enumerate(data['results']):
    img_url = user['picture']['large']
    req_img = urllib.request.Request(img_url, headers=headers)
    with urllib.request.urlopen(req_img, context=ssl_ctx, timeout=15) as resp:
        with open(f'_images/avatar-random-{i+1:02d}.jpg', 'wb') as f:
            f.write(resp.read())
```

### 5b.10 Naming Convention Reference

Use kebab-case, descriptive names with category prefix:

| Prefix | Example | Section |
|--------|---------|---------|
| `hero-` | `hero-manufacturing-control-panel.webp` | Hero |
| `deliver-` | `deliver-product-line-automation.webp` | What We Deliver |
| `step-` | `step-consultation-process.svg` | How It Works |
| `team-` | `team-ceo-jane-smith.jpg` | Our Team |
| `result-` | `result-before-after-efficiency.svg` | Real Results |
| `audience-` | `audience-warehouse-manager.webp` | Who This Is For |
| `compare-` | `compare-traditional-vs-modern.svg` | Why We're Different |
| `testimonial-` | `testimonial-client-avatar-01.jpg` | What Clients Say |
| `faq-` | `faq-decorative-brand.svg` | FAQ |
| `cta-` | `cta-background-facility.webp` | Final CTA |
| `logo-` | `logo-client-forbes.svg` | Client Logos |

---

## 5c: Image Optimization

Run these steps for every downloaded image before uploading.

### 5c.1 Resize Oversized Images (Pillow LANCZOS)

```python
from PIL import Image
import os

def resize_image(filepath, max_width=800, quality=85):
    """Resize image if wider than max_width, maintaining aspect ratio."""
    img = Image.open(filepath)
    if img.width > max_width:
        ratio = max_width / img.width
        new_h = int(img.height * ratio)
        img = img.resize((max_width, new_h), Image.LANCZOS)
        img.save(filepath, optimize=True, quality=quality)
        print(f'Resized: {filepath} → {max_width}x{new_h}')
    return img
```

### 5c.2 Convert to WebP

```python
def convert_to_webp(filepath, quality=80):
    """Convert image to WebP format. Saves alongside original."""
    img = Image.open(filepath)
    webp_path = os.path.splitext(filepath)[0] + '.webp'
    img.save(webp_path, 'WEBP', quality=quality, optimize=True)
    old_size = os.path.getsize(filepath)
    new_size = os.path.getsize(webp_path)
    print(f'Converted: {filepath} → {webp_path} ({old_size/1024:.0f}KB → {new_size/1024:.0f}KB)')
    return webp_path
```

### 5c.3 Enforce File Size Budgets

| Image Type | Max Size (desktop) | Max Size (mobile) | Quality | Max File Size |
|-----------|-------------------|-------------------|---------|--------------|
| Hero image | 1920x1080px | 768x432px | 80% | < 200KB |
| Section images | 1200x800px | 600x400px | 75% | < 100KB |
| Thumbnails/icons | 400x400px | 200x200px | 70% | < 30KB |
| Team photos | 600x600px | 300x300px | 80% | < 50KB |
| Backgrounds | 1920x1080px | 768x432px | 65% | < 150KB |

```python
import os

def check_file_budget(filepath, max_kb=100):
    """Check if file is within size budget. Warn if not."""
    size_kb = os.path.getsize(filepath) / 1024
    if size_kb > max_kb:
        print(f'WARNING: {filepath} is {size_kb:.0f}KB (budget: {max_kb}KB)')
        return False
    print(f'OK: {filepath} is {size_kb:.0f}KB (budget: {max_kb}KB)')
    return True
```

---

## 5d: Upload to R2 with MD5 Dedup

### 5d.1 Load Config from `.r2-upload.json`

```python
import json, os

with open('.r2-upload.json') as f:
    r2 = json.load(f)

bucket = r2['bucket']
public_url = r2['publicUrl'].rstrip('/')
source_folder = r2['sourceFolder']
print(f'R2 Config: bucket={bucket}  public={public_url}  source={source_folder}')
```

### 5d.2 Load Manifest from `.r2-manifest.json`

```python
manifest = {}
if os.path.exists('.r2-manifest.json'):
    with open('.r2-manifest.json') as f:
        manifest = json.load(f)
print(f'Manifest contains {len(manifest)} entries')
```

### 5d.3 Scan for New/Changed Files (MD5 Hash Comparison)

```python
import json, hashlib, os, time

def scan_for_uploads(source_folder, manifest):
    """Scan source folder and compare against manifest. Returns (new_files, unchanged_count)."""
    new_files = []
    unchanged = 0

    for root, dirs, files in os.walk(source_folder):
        for f in files:
            ext = f.lower().split('.')[-1]
            if ext not in ('jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'avif'):
                continue

            path = os.path.join(root, f)
            rel_path = os.path.relpath(path, source_folder).replace('\\', '/')

            # Compute MD5 hash
            with open(path, 'rb') as fh:
                file_hash = hashlib.md5(fh.read()).hexdigest()

            # Check against manifest
            if rel_path in manifest and manifest[rel_path].get('hash') == file_hash:
                unchanged += 1
                print(f'  SKIP: {rel_path} (unchanged)')
            else:
                new_files.append((rel_path, path, file_hash, ext))
                print(f'  NEW: {rel_path} (hash: {file_hash[:8]}...)')

    return new_files, unchanged
```

### 5d.4 Content-Type Mapping

```python
MIME_TYPES = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'avif': 'image/avif',
}

def get_mime_type(ext):
    return MIME_TYPES.get(ext, 'application/octet-stream')
```

### 5d.5 Upload with Wrangler + `--remote`

**CRITICAL**: Always include `--remote`. Without it, `wrangler r2 object put` silently uploads to a local emulated bucket instead of the real Cloudflare R2. This is the #1 cause of "images not showing up" bugs.

```bash
wrangler r2 object put "<bucket>/<rel-path>" --file "<local-path>" --content-type <mime-type> --remote
```

Python wrapper for the bash command:

```python
import subprocess

def upload_to_r2(bucket, rel_path, local_path, mime_type, wrangler_prefix='wrangler'):
    """Upload a single file to R2. Returns (success, url)."""
    cmd = f'{wrangler_prefix} r2 object put "{bucket}/{rel_path}" --file "{local_path}" --content-type {mime_type} --remote'
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)

    if result.returncode == 0:
        url = f'{public_url}/{rel_path}'
        print(f'  UPLOADED: {url}')
        return True, url
    else:
        print(f'  FAILED: {rel_path}')
        print(f'  Error: {result.stderr.strip()}')
        return False, None
```

### 5d.6 Auth Failure Recovery

```python
def upload_with_auth_recovery(bucket, rel_path, local_path, mime_type, wrangler_prefix='wrangler'):
    """Upload with one retry on auth failure."""
    success, url = upload_to_r2(bucket, rel_path, local_path, mime_type, wrangler_prefix)
    if not success:
        print('  Auth may have expired. Re-authenticating...')
        subprocess.run(f'{wrangler_prefix} login', shell=True)
        success, url = upload_to_r2(bucket, rel_path, local_path, mime_type, wrangler_prefix)
    return success, url
```

### 5d.7 Update Manifest JSON

```python
def update_manifest(manifest, rel_path, file_hash, url):
    """Add/update a manifest entry after successful upload."""
    manifest[rel_path] = {
        'hash': file_hash,
        'url': url,
        'uploadedAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    }

def save_manifest(manifest):
    """Write manifest to disk."""
    with open('.r2-manifest.json', 'w') as f:
        json.dump(manifest, f, indent=2)
    print(f'Manifest saved: {len(manifest)} entries')
```

### 5d.8 Full Upload Flow

```python
def run_upload_flow(wrangler_prefix='wrangler'):
    # 1. Load config
    with open('.r2-upload.json') as f:
        r2 = json.load(f)
    bucket = r2['bucket']
    public_url_base = r2['publicUrl'].rstrip('/')
    source_folder = r2['sourceFolder']

    # 2. Load manifest
    manifest = {}
    if os.path.exists('.r2-manifest.json'):
        with open('.r2-manifest.json') as f:
            manifest = json.load(f)

    # 3. Scan for new/changed files
    new_files, unchanged = scan_for_uploads(source_folder, manifest)

    if not new_files:
        print(f'All {unchanged} files already synced. Nothing to upload.')
        return

    # 4. Upload each file
    uploaded = 0
    failed = 0
    for rel_path, local_path, file_hash, ext in new_files:
        mime = get_mime_type(ext)
        success, url = upload_with_auth_recovery(bucket, rel_path, local_path, mime, wrangler_prefix)
        if success:
            update_manifest(manifest, rel_path, file_hash, url)
            uploaded += 1
        else:
            failed += 1
        # Save manifest after each file (partial progress)
        save_manifest(manifest)

    # 5. Report
    print(f'\nUpload complete: {uploaded} uploaded, {unchanged} skipped, {failed} failed')
```

**Platform-aware hashing**: On macOS, use `md5 -q "<filepath>"` instead of Python `hashlib.md5` if doing hash checks via shell.

---

## 5e: Verify & Record

### 5e.1 Verify Image URLs (HTTP HEAD)

```python
import urllib.request

def verify_url(url):
    """Check that an image URL returns HTTP 200."""
    try:
        req = urllib.request.Request(url, method='HEAD')
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status == 200
    except Exception as e:
        return False
```

### 5e.2 Write ALT Text (Semantic Formula)

Every image MUST have ALT text following this structure:

```
[Subject] + [Action/Context] + [Industry keyword] + [Brand keyword if relevant]
```

| Image | ALT Text |
|-------|----------|
| Factory worker at control panel | "Manufacturing operator monitoring production line at automotive parts plant" |
| Team in meeting | "Engineering team reviewing quality control data at precision components manufacturer" |
| Hero product shot | "Industrial sensor array monitoring equipment vibration in real-time at manufacturing facility" |
| Client logo | "Logo of Maplewood Manufacturing, midwest precision parts producer" |

**ALT Text Don'ts**:
- Don't start with "Image of" or "Picture of" (screen readers already announce it)
- Don't use generic descriptions ("business team working")
- Don't stuff keywords unnaturally
- Don't leave empty ALT text on meaningful images (decorative only: `alt=""`)

### 5e.3 Record in `.landing-page/images.json`

```python
import json, os

def record_image(section_id, filename, url, alt_text, width, height, file_size_kb):
    """Add an image entry to .landing-page/images.json."""
    records_path = '.landing-page/images.json'

    records = {}
    if os.path.exists(records_path):
        with open(records_path) as f:
            records = json.load(f)

    records[filename] = {
        'section': section_id,
        'url': url,
        'alt': alt_text,
        'width': width,
        'height': height,
        'fileSizeKB': file_size_kb,
        'format': 'webp' if filename.endswith('.webp') else filename.split('.')[-1]
    }

    os.makedirs('.landing-page', exist_ok=True)
    with open(records_path, 'w') as f:
        json.dump(records, f, indent=2)
    print(f'Recorded: {filename} in .landing-page/images.json')
```

### 5e.4 Quality Checklist

- [ ] All images are WebP format
- [ ] File sizes within budget
- [ ] ALT text follows semantic structure
- [ ] Images are responsive (at least 2 sizes: desktop + mobile)
- [ ] Loading strategy correct (Hero: eager, rest: lazy)
- [ ] Width and height explicitly set (prevents CLS)
- [ ] Images look sharp on 2x displays (use `@2x` or srcset)
- [ ] No stock-photo clichés (handshakes, fake smiling at laptops)
- [ ] Color tone matches brand palette (warm/cool)
- [ ] Images actually relevant to the business (not generic filler)
- [ ] All URLs verified (HTTP 200)
- [ ] `.landing-page/images.json` populated for all images

---

## Image Types Needed Per Section

| Section | Image Type | Quantity | Priority |
|---------|-----------|----------|----------|
| Hero | Main product/service scene or branded illustration | 1 | Required |
| What We Deliver | Product shots, service-in-action, or abstract visuals | 3-4 | High |
| How It Works | Process icons or step illustrations | 3-4 | High |
| Our Team | Professional headshots | 2-4 | If section included |
| Real Results | Before/after visuals or data visualizations | 1-2 | Medium |
| Who This Is For | Customer-scene photos | 2-3 | Medium |
| Why We're Different | Comparison visual or unique capability graphic | 1 | Medium |
| What Clients Say | Client photos or company logos | 2-3 + logos | High |
| FAQ | Decorative or brand illustration | 1 | Low |
| Final CTA | Background visual or brand graphic | 1 | Low |

---

## Quick Reference: Common Tasks

### "Get 15 professional testimonial avatars"
1. Download from `thispersondoesnotexist.com` or `randomuser.me` (5b.9)
2. Resize to 400x400, <30KB each (5c.1)
3. Upload to R2 (5d)
4. Record with descriptive filenames (5e)

### "Get the hero image from competitor-site.com"
1. Open with Chrome DevTools (5b.2)
2. Find the hero `<img>` or CSS background (5b.3)
3. Screenshot or extract full-res URL (5b.5 / 5b.6)
4. Download to `_images/hero-` (5b.10)
5. Upload to R2 (5d)

### "Source images for [topic]"
1. Search Unsplash/Pexels (5b.7 / 5b.8)
2. Present top 5-10 options
3. Let user pick, then download selected ones
4. Optimize and upload (5c → 5d)

### "Download all product images from this page"
1. Chrome DevTools snapshot (5b.2)
2. Collect all image URLs matching product pattern
3. Download with descriptive names (5b.5)
4. Upload to R2 (5d)

---

## Key Behaviors

- **Read R2 config from project** — always read `.r2-upload.json`. Never hardcode bucket names or URLs.
- **Always use `--remote`** — `wrangler r2 object put` without `--remote` silently uploads locally
- **Never re-upload unchanged files** — MD5 hash is the source of truth for dedup
- **Preserve folder structure** — `_images/blog/hero.webp` → `<bucket>/blog/hero.webp`
- **Quote all file paths** — filenames may contain spaces or special characters
- **Always verify images are valid** — check file size > 2KB
- **Use descriptive filenames** — never `image1.jpg`, always `avatar-ceo-jane-smith.jpg`
- **Handle errors gracefully** — if one upload fails, continue with remaining files (5d.6)
- **Save manifest after each upload** — partial runs preserve progress
- **Report clearly** — show progress, sizes, and R2 URLs for every image
- **Add rate limiting** — 0.5-1s delays between HTTP requests to avoid being blocked
- **Use Referer headers** — when downloading images, include the originating page URL
- **Protect `.gitignore`** — only append missing entries, never overwrite existing content
