# How to Use: R2 Image Upload

Upload images to Cloudflare R2 from a local folder with automatic deduplication and public URL generation.

## Quick Start

Just say one of these in Claude Code:

- "Upload images to R2"
- "Sync my images"
- "What images need uploading?"

Claude will walk you through setup on first use (creates a config file, no API keys needed — just a browser login).

---

## First Run (2 minutes)

On the very first run, Claude will:

1. Check that `wrangler` CLI is installed (install guide included if not)
2. Log you into Cloudflare via browser (`wrangler login`)
3. List or create your R2 bucket
4. Enable public access on the bucket
5. Ask if you have a custom domain (e.g. `images.yourdomain.com`) or use the free r2.dev URL
6. Ask which local folder to stage images in (default: `_images/`)
7. Save config to `.r2-upload.json` and create `.r2-manifest.json`

After setup, all R2 files are gitignored automatically. Just commit the `.gitignore` change.

---

## Daily Workflow

### Upload all new/changed images

```
Upload images to R2
```

Claude will:
- Scan your `_images/` folder (or your configured folder)
- Skip anything already uploaded with the same content (MD5 hash dedup)
- Upload new and changed files
- Report: X uploaded, Y skipped, Z failed
- Print the public URL for each uploaded file

### Upload a single file

```
Upload _images/blog/hero.webp to R2
```

### Check what needs uploading (dry run)

```
What images need uploading?
```

Reports new/changed/synced status without uploading anything.

---

## Example Prompts

```
Upload images to R2
```

```
Sync the images folder
```

```
Upload this image: _images/hero.png
```

```
What images are not yet uploaded?
```

```
Set up R2 for this project
```

---

## Folder Structure

```
your-project/
├── _images/          ← local staging folder (gitignored)
│   ├── blog/
│   │   └── hero.webp
│   └── team-photo.jpg
├── .r2-upload.json   ← config (gitignored)
├── .r2-manifest.json ← upload state (gitignored)
└── .env              ← credentials (gitignored)
```

Images in `_images/` are a **local staging area only** — R2 is the source of truth. The manifest tracks what's been uploaded so you don't re-upload unchanged files. All R2 files are gitignored automatically on first run.

---

## Supported Image Formats

`.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.svg`, `.avif`, `.ico`

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "command not found: wrangler" | Run `npm install -g wrangler` (requires Node.js 18+) |
| "Not logged in" | Run `wrangler login` to authenticate via browser |
| Auth keeps expiring | Create an API token and add it to `.env` — see `references/cloudflare-token-permissions.md` |
| R2 upload returns 403 | Your token needs "Workers R2 Storage: Edit" at account level |
| File uploaded but URL 404 | Ensure public access is enabled: `wrangler r2 bucket dev-url enable <bucket>` |
| Want to force re-upload | Delete the file's entry from `.r2-manifest.json` |

---

## Cost

Cloudflare R2 has a generous free tier:

| | Free | Paid |
|---|---|---|
| Storage | 10 GB/month | $0.015/GB-month |
| Class A ops (uploads) | 1M/month | $4.50/million |
| Class B ops (reads) | 10M/month | $0.36/million |
| Egress | **Always free** | **Always free** |

Most small-to-medium projects stay within the free tier indefinitely.
