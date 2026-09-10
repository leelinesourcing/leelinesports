---
name: image-sourcing
description: Browse websites with Chrome DevTools to discover and download images/content assets, then upload to Cloudflare R2. Also supports sourcing images from Unsplash and Pexels.
---

# Image Sourcing Skill

Use Chrome DevTools to browse websites, discover images and content assets, download them locally, and upload to Cloudflare R2. Also supports searching and downloading from Unsplash and Pexels for high-quality stock photography.

## When to Use This Skill

- "download images from [website]"
- "get avatars / logos / photos from [site]"
- "source images for [purpose]"
- "find stock photos for [topic]"
- "screenshot and save this element"
- "grab images from Unsplash / Pexels"
- Any request to gather visual assets for the project

## Prerequisites Check

Before sourcing images, verify:

1. **Chrome DevTools MCP is available** — the `mcp__chrome-devtools__*` tools must be present
2. **R2 config exists** — check for `.r2-upload.json` at project root
   - If missing, tell the user to run the `r2-image-upload-skill` first
3. **Local staging folder exists** — ensure `_images/` directory exists:
   ```bash
   mkdir -p _images
   ```

## R2 Config (Dynamic — Read from Project)

**Every project has its own R2 config.** Never hardcode bucket names or URLs.

On every use, read `.r2-upload.json` from the project root:

```python
import json, os

config_path = '.r2-upload.json'
if not os.path.exists(config_path):
    print('ERROR: No .r2-upload.json found. Run the r2-image-upload-skill first to set up R2.')
    exit(1)

with open(config_path) as f:
    r2 = json.load(f)

bucket = r2['bucket']           # e.g. "leelinegroup", "my-project-images"
public_url = r2['publicUrl']    # e.g. "https://img.leelinegroup.com", "https://pub-abc.r2.dev"
source_folder = r2['sourceFolder']  # e.g. "_images/"

print(f'R2 Config: bucket={bucket}  public={public_url}  source={source_folder}')
```

All downloaded images go into the configured `sourceFolder` (preserving subdirectory structure when relevant). If the folder doesn't exist, create it:
```bash
mkdir -p <sourceFolder>
```

---

## Part 1: Chrome DevTools — Website Image Discovery

Use this flow when the user wants images from a specific website.

### 1.1 Navigate to the Target Page

```bash
# Open the page in Chrome DevTools
mcp__chrome-devtools__navigate_page(type="url", url="<target-url>")
```

Wait for the page to fully load. Take a snapshot to understand the page structure:

```bash
mcp__chrome-devtools__take_snapshot()
```

### 1.2 Identify Image Assets

Scan the snapshot for:
- `<img>` elements — product photos, avatars, logos, illustrations
- Background images on `<div>` or `<section>` elements
- SVG icons and illustrations
- Any visual content relevant to the user's request

### 1.3 Inspect Image Quality

Before downloading, evaluate each candidate image:

1. **Check dimensions** — use `evaluate_script` to get natural width/height:
   ```javascript
   (el) => ({ w: el.naturalWidth, h: el.naturalHeight, src: el.currentSrc || el.src })
   ```
   - Minimum acceptable: 200x200 for avatars, 800px width for hero images
   - Prefer images at least 2x the display size (retina)

2. **Check loading** — ensure the image is fully loaded:
   ```javascript
   (el) => el.complete && el.naturalWidth > 0
   ```

### 1.4 Download Images

For each selected image, extract the full-res URL and download with Python:

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
filename = '<descriptive-name>.jpg'  # or .png, .webp, .svg, .avif
filepath = '_images/<subfolder>/' + filename

os.makedirs(os.path.dirname(filepath), exist_ok=True)
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, context=ssl_ctx, timeout=30) as resp:
    with open(filepath, 'wb') as f:
        f.write(resp.read())

print(f'Downloaded: {filepath} ({os.path.getsize(filepath)/1024:.1f} KB)')
```

**Naming convention:**
- Use kebab-case, descriptive names
- Prefix with category: `avatar-`, `hero-`, `logo-`, `icon-`, `bg-`
- Example: `avatar-john.jpg`, `hero-office.jpg`, `logo-client-forbes.svg`

### 1.5 Taking Screenshots of Specific Elements

When an image can't be directly downloaded (CSS background, canvas, SVG inline), use screenshot:

```bash
mcp__chrome-devtools__take_screenshot(uid="<element-uid>", filePath="_images/<filename>.png")
```

### 1.6 Handling Lazy-Loaded Images

For sites with lazy loading, scroll images into view first:

```javascript
// Scroll all lazy images into view
document.querySelectorAll('img[loading="lazy"], img[data-src]').forEach(el => {
    el.scrollIntoView({ behavior: 'instant', block: 'center' });
});
```

Then wait briefly for them to load before extracting URLs.

---

## Part 2: Chrome DevTools — Content & Metadata Extraction

### 2.1 Extract Text Content

For gathering text content alongside images:

```javascript
// Get all text from specific section
(el) => el.innerText.trim()
```

### 2.2 Extract Structured Data

```javascript
// Get testimonials, team members, etc.
Array.from(document.querySelectorAll('.testimonial-card')).map(card => ({
    name: card.querySelector('.name')?.innerText,
    role: card.querySelector('.role')?.innerText,
    quote: card.querySelector('.quote')?.innerText,
    avatar: card.querySelector('img')?.src
}))
```

### 2.3 Grab Color Palette

```javascript
// Extract CSS custom properties or computed styles
Array.from(document.querySelectorAll('[style*="--"]')).map(el =>
    el.getAttribute('style')
)
```

---

## Part 3: Unsplash — Stock Photo Sourcing

Use Unsplash for high-quality, free-to-use photography.

### 3.1 Search Unsplash

Use the public Unsplash search to find relevant images:

```python
import urllib.request, json, ssl, os, re

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}

# Fetch the search results page HTML
query = "professional business portrait"
url = f'https://unsplash.com/s/photos/{query.replace(" ", "-")}'
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, context=ssl_ctx, timeout=20) as resp:
    html = resp.read().decode('utf-8', errors='replace')

# Extract image URLs from the page
image_urls = re.findall(r'https://images\.unsplash\.com/[^"\'\s?]+', html)
```

### 3.2 Download from Unsplash

For each discovered image URL, download with appropriate sizing:

```
# Add sizing parameters to the Unsplash CDN URL
download_url = image_url + '?w=1200&q=80&fit=crop'
```

### 3.3 Unsplash Attribution

**Required**: Note that Unsplash images are free for commercial use but the license asks for attribution where possible. Keep a record of photo URLs for attribution.

---

## Part 4: Pexels — Stock Photo Sourcing

### 4.1 Search Pexels

```python
import urllib.request, ssl, re

ssl_ctx = ssl.create_default_context()
ssl_ctx.check_hostname = False
ssl_ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
}

query = "business portrait"
url = f'https://www.pexels.com/search/{query.replace(" ", "%20")}/'
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, context=ssl_ctx, timeout=20) as resp:
    html = resp.read().decode('utf-8', errors='replace')

# Pexels images are on their CDN
image_urls = re.findall(r'https://images\.pexels\.com/photos/\d+/[^"\'\s]+\.(?:jpeg|jpg)', html)
```

### 4.2 Download from Pexels

For each image URL, add sizing:
```
download_url = image_url + '?w=1200&auto=compress'
```

---

## Part 5: Avatar-Specific Sources

For testimonial/team avatars, these specialized sources provide the most reliable results:

### 5.1 ThisPersonDoesNotExist.com (AI-Generated Faces)

```python
headers = {'User-Agent': 'Mozilla/5.0'}

for i in range(15):
    req = urllib.request.Request('https://thispersondoesnotexist.com/', headers=headers)
    with urllib.request.urlopen(req, context=ssl_ctx, timeout=15) as resp:
        data = resp.read()
    with open(f'_images/avatar_{i+1:02d}.jpg', 'wb') as f:
        f.write(data)
```

**Note**: These are 1024x1024 AI faces. Quality varies. Resize to 400x400 for web use to reduce file size.

### 5.2 RandomUser.me (Diverse Realistic Portraits)

```python
req = urllib.request.Request('https://randomuser.me/api/?results=20', headers=headers)
# Extract picture.large URLs from each user result
```

---

## Part 6: Upload to Cloudflare R2

After images are downloaded, upload them to Cloudflare R2. **All R2 parameters come from the project's `.r2-upload.json`** — never hardcode bucket names or public URLs.

### 6.0 Load Config (Do This First Every Time)

```python
import json, os

with open('.r2-upload.json') as f:
    r2 = json.load(f)

bucket = r2['bucket']
public_url = r2['publicUrl'].rstrip('/')
source_folder = r2['sourceFolder']
```

### 6.1 Check What Needs Uploading (Dedup)

```python
import json, hashlib, os, time

manifest = {}
if os.path.exists('.r2-manifest.json'):
    with open('.r2-manifest.json') as f:
        manifest = json.load(f)

new_files = []
for root, dirs, files in os.walk(source_folder):
    for f in files:
        if f.lower().endswith(('.jpg','.jpeg','.png','.webp','.gif','.svg','.avif')):
            path = os.path.join(root, f)
            rel_path = os.path.relpath(path, source_folder).replace('\\', '/')
            with open(path, 'rb') as fh:
                h = hashlib.md5(fh.read()).hexdigest()
            if rel_path not in manifest or manifest[rel_path].get('md5') != h:
                new_files.append((rel_path, path, h, f.split('.')[-1].lower()))
            else:
                print(f'  SKIP: {rel_path} (unchanged)')

print(f'New/changed: {len(new_files)}, Unchanged: {len([...])}')
```

### 6.2 Upload to R2 (Using Config Values)

```bash
# For each new/changed file — bucket name comes from config
npx wrangler r2 object put "<bucket>/<rel-path>" --file "<local-path>" --content-type <mime-type>
```

Mime-type mapping: `.jpg/.jpeg` → `image/jpeg`, `.png` → `image/png`, `.webp` → `image/webp`, `.svg` → `image/svg+xml`, `.avif` → `image/avif`, `.gif` → `image/gif`

If `wrangler` fails, try `npx wrangler`. If auth fails, run `wrangler login` once and retry.

### 6.3 Update Manifest (Using Config `publicUrl`)

```python
manifest[rel_path] = {
    'md5': hash_val,
    'url': f'{public_url}/{rel_path}',
    'uploaded': time.strftime('%Y-%m-%dT%H:%M:%S')
}
with open('.r2-manifest.json', 'w') as f:
    json.dump(manifest, f, indent=2)
```

### 6.4 Report

Output a summary table of uploaded files with their public URLs. Use the `publicUrl` from config:

```
Uploaded 5 files to R2 bucket "<bucket>":
  _images/avatars/john.jpg  →  https://<publicUrl>/avatars/john.jpg
  _images/hero-bg.webp      →  https://<publicUrl>/hero-bg.webp
```

For Astro projects, generate importable paths:
```
import avatarJohn from '<publicUrl>/avatars/john.jpg'
```

---

## Part 7: Image Optimization (Post-Download)

Before uploading to R2, optimize images for web:

### 7.1 Resize Large Images

Images larger than needed should be resized before upload:

```python
# Use Python Pillow if available
try:
    from PIL import Image
    img = Image.open(filepath)
    if img.width > 800:
        ratio = 800 / img.width
        new_h = int(img.height * ratio)
        img = img.resize((800, new_h), Image.LANCZOS)
        img.save(filepath, optimize=True, quality=85)
except ImportError:
    print("Pillow not installed — skipping resize. Install: pip install Pillow")
```

### 7.2 Convert to Modern Formats

For photos, prefer WebP with JPEG fallback. For avatars, 400x400 JPEG is usually sufficient.

### 7.3 File Size Guidelines

| Use Case       | Max Size | Format  | Max Dimensions |
|----------------|----------|---------|----------------|
| Hero images    | 200 KB   | WebP    | 1920px wide    |
| Avatars        | 30 KB    | JPEG    | 400x400        |
| Logos          | 50 KB    | SVG/PNG | N/A            |
| Blog images    | 150 KB   | WebP    | 1200px wide    |
| Icons          | 10 KB    | SVG     | N/A            |

---

## Quick Reference: Common Image Sourcing Tasks

### "Get 15 professional testimonial avatars"
1. Navigate to Unsplash search for "business headshot" via Python
2. Fall back to `thispersondoesnotexist.com` if blocked
3. Download to `_images/testimonials/`
4. Optimize to 400x400, <30KB each
5. Upload to R2

### "Get the hero image from competitor-site.com"
1. Open with Chrome DevTools
2. Find the hero `<img>` or CSS background
3. Screenshot or extract the full-res URL
4. Download to `_images/`
5. Upload to R2

### "Source images for [topic]"
1. Check if user has a specific site in mind
2. If not, search Unsplash/Pexels for the topic
3. Present top 5-10 options (by examining images in browser)
4. Let user pick, then download selected ones
5. Upload to R2

### "Download all product images from this page"
1. Use Chrome DevTools to snapshot
2. Use evaluate_script to collect all image URLs matching product pattern
3. Download each with descriptive names
4. Upload to R2

---

## Key Behaviors

- **Read R2 config from project** — always read `.r2-upload.json` for bucket name and public URL. Never hardcode R2 values.
- **Always verify images are valid** — check file size > 2KB and magic bytes (FFD8 for JPEG, 8950 for PNG)
- **Use descriptive filenames** — never `image1.jpg`, always `avatar-ceo-john.jpg`
- **Preserve original quality** — download the highest resolution available, then resize down
- **Handle errors gracefully** — if one image fails, continue with the rest
- **Report clearly** — show progress, sizes, and R2 URLs for every image
- **Respect robots.txt** — when scraping, check the site's robots.txt first
- **Rate limit yourself** — add 0.5-1s delays between requests to avoid being blocked
- **Use Referer headers** — when downloading images, include the originating page URL
