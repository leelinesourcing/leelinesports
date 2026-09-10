---
name: r2-image-upload-skill
description: Upload images to Cloudflare R2 from a local folder. Handles dedup, first-run setup, and returns public URLs.
metadata:
  version: 1.0.0
  requires_system:
    - name: wrangler
      description: Cloudflare CLI for R2 uploads
      check: wrangler --version
      install: npm install -g wrangler
      requires: Node.js 18+
---

# R2 Image Upload

Upload images to Cloudflare R2 from a local folder. Handles dedup (skip already-uploaded files), first-run setup, and returns public URLs.

## Triggers

- "upload images", "sync images", "push images to R2"
- "upload this image [path]"
- "what images need uploading?"
- "set up R2", "configure image uploads"

## Wrangler Command Prefix

On first use, determine which command works:

1. Try `wrangler --version`
2. If that fails, try `npx wrangler --version`
3. Use whichever succeeds as the prefix for ALL subsequent wrangler commands in this session

Store the chosen prefix mentally and reuse it. If neither works → read `references/install-wrangler.md` and walk through installation.

## Quick Workflow

### First Run (no config exists)

1. Check if `wrangler` CLI is installed (see "Wrangler Command Prefix" above)
2. Check if wrangler is authenticated: `wrangler whoami`
   - If not logged in → run `wrangler login` (opens browser)
   - If auth error and a `.env` file exists with `CLOUDFLARE_API_TOKEN` → check that the token is valid
   - If auth error persists → re-run `wrangler login`
3. List available buckets: `wrangler r2 bucket list`
   - If one bucket → suggest it as default
   - If multiple → ask which one to use
   - If none → create one:
     ```bash
     wrangler r2 bucket create <project-name>-images
     ```
     Suggest `<project-name>-images` as the bucket name based on the current directory name.
4. Enable public access via r2.dev URL:
   ```bash
   wrangler r2 bucket dev-url enable <bucket-name> -y
   ```
5. Get the public r2.dev URL:
   ```bash
   wrangler r2 bucket dev-url get <bucket-name>
   ```
6. Ask the user: **"Do you have a domain on Cloudflare you'd like to use for images?"**
   - **If yes** → tell them to connect a custom domain (dashboard-only):
     1. Go to **Cloudflare Dashboard** → **R2** → select bucket → **Settings**
     2. Under **Custom Domains**, click **Connect Domain**
     3. Enter subdomain like `images.yourdomain.com`
     4. Wait for status to show Active
     5. Use `https://images.yourdomain.com` as the public URL
   - **If no** → use the r2.dev URL from step 5. Mention they can add a custom domain later.
7. Ask: **Source folder** — which folder to stage images for upload (default: `_images/`)
8. Save config to `.r2-upload.json` at project root:
   ```json
   {
     "bucket": "<bucket-name>",
     "publicUrl": "https://images.yourdomain.com OR https://pub-abc123.r2.dev",
     "sourceFolder": "_images/"
   }
   ```
9. Create empty `.r2-manifest.json` at project root (`{}`)
10. **Ensure `.env` exists** — if not, create it:
    ```
    # Cloudflare credentials (wrangler reads this automatically)
    # Uncomment and add your token if wrangler login expires:
    # CLOUDFLARE_API_TOKEN=your_token_here
    ```
11. **Ensure `.gitignore` includes required entries** — check for each and append any that are missing:
    ```
    _images/
    .env
    .r2-upload.json
    .r2-manifest.json
    .wrangler/
    ```
    Do NOT overwrite existing `.gitignore` content — only append missing lines.
12. Create the source folder if it doesn't exist: `mkdir -p _images`
13. Tell user to commit the `.gitignore` change

### Upload Flow

1. Read `.r2-upload.json` for config. If missing → run First Run flow
2. Read `.r2-manifest.json` for existing upload records. If missing or invalid JSON → create empty `{}` and warn user
3. Check source folder exists. If missing → create it and tell user to add images first
4. Scan `sourceFolder` for image files (`*.jpg`, `*.jpeg`, `*.png`, `*.webp`, `*.gif`, `*.svg`, `*.avif`, `*.ico`)
5. If no image files found → tell user the folder is empty, no action needed
6. For each image file found:
   a. Compute MD5 hash: `md5 -q "<filepath>"` (macOS) or `md5sum "<filepath>"` (Linux). **Always quote file paths** — filenames may contain spaces.
   b. Look up the file's relative path in manifest
   c. **Skip** if manifest entry exists AND hash matches — log as "already uploaded"
   d. **Upload** if new or hash changed. **Always include `--remote`** — without it, wrangler silently uploads to a local emulated bucket instead of the real remote R2 bucket:
      ```bash
      wrangler r2 object put "<bucket>/<relative-path>" --file "<local-path>" --content-type <mime-type> --remote
      ```
   e. If upload fails with auth error → attempt `wrangler login` once, then retry. If it fails again, log the error and continue with remaining files.
   f. Update manifest entry with new hash, public URL, and timestamp
7. Write updated `.r2-manifest.json`
8. Report summary: X uploaded, Y skipped, Z failed
9. For each newly uploaded file, output the public URL so user can copy it

### Single File Upload

When user specifies a single file path:
- Follow steps 1-2 and 6-9 above for just that file
- The file does not need to be in the source folder — upload it directly and track it in the manifest using its path relative to the project root
- Output the public URL

### Check Status (dry run)

When user asks "what needs uploading?" or similar:
- Run steps 1-5 but don't upload anything
- Report which files are new, changed, or already synced

## Config Format

Read `references/config-schema.md` for the full schema of `.r2-upload.json` and `.r2-manifest.json`.

## Content-Type Mapping

Detect from file extension:
- `.jpg`, `.jpeg` → `image/jpeg`
- `.png` → `image/png`
- `.webp` → `image/webp`
- `.gif` → `image/gif`
- `.svg` → `image/svg+xml`
- `.avif` → `image/avif`
- `.ico` → `image/x-icon`

## Key Behaviors

- **Never re-upload unchanged files** — MD5 hash is the source of truth
- **Always use `--remote` on `r2 object` commands** — `wrangler r2 object put` without `--remote` silently uploads to a local emulated bucket. The upload says "Upload complete." but the file never reaches the real Cloudflare R2. This is the #1 cause of "images not showing up" bugs.
- **Preserve folder structure** — `_images/blog/hero.webp` → `<bucket>/blog/hero.webp` (strip the sourceFolder prefix)
- **Quote all file paths** — filenames may contain spaces or special characters
- **Report errors per file** — don't stop on first failure, continue uploading remaining files
- **Always update manifest** — even partial runs should save progress
- **Platform-aware hashing** — use `md5 -q` on macOS, `md5sum` on Linux
- **Re-auth on failure** — if any wrangler command fails with auth error, attempt `wrangler login` once before giving up
- **Protect .gitignore** — only append missing entries, never overwrite existing content
