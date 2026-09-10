# R2 Image Upload

Upload images to Cloudflare R2 from a local folder. Handles deduplication (skip already-uploaded files), first-run setup, and returns public URLs.

## Installation

1. Download the skill zip from the course resources
2. In Claude Code, run:
   ```
   /install-skill r2-image-upload-skill.zip
   ```
3. Follow the prompts to install the system dependency (wrangler)

## System Requirements

### Wrangler CLI

This skill requires the **Wrangler** CLI from Cloudflare (no API key needed — uses browser login).

**Install:**
```bash
npm install -g wrangler
```

Requires **Node.js 18+**. Check with: `node --version`

**Authenticate (one-time):**
```bash
wrangler login
```

This opens your browser to log into Cloudflare. Free account works fine.

## No API Keys Required

Authentication is handled via `wrangler login` (browser OAuth) — no API keys to configure. Credentials are stored locally by wrangler and never end up in your project.

> **If auth expires:** Create a Cloudflare API token and add it to a `.env` file in your project root. The skill creates this file automatically during setup (gitignored). See `references/cloudflare-token-permissions.md` for details.

## Cloudflare R2 Pricing

| | Free Tier | Paid |
|---|---|---|
| Storage | **10 GB/month** | $0.015/GB-month |
| Uploads (Class A ops) | **1M/month** | $4.50/million |
| Downloads (Class B ops) | **10M/month** | $0.36/million |
| Egress | **Always free** | **Always free** |

Most projects stay within the free tier indefinitely.

Sign up: [cloudflare.com/developer-platform/products/r2](https://www.cloudflare.com/developer-platform/products/r2/)

## Usage

Just say in Claude Code:

```
Upload images to R2
```

Or:
```
Sync my images
What images need uploading?
Set up R2 for this project
Upload _images/hero.png
```

See `WORKFLOW.md` for detailed usage instructions and examples.

## How It Works

1. **First run:** Claude walks you through creating an R2 bucket, enabling public access, and saves config to `.r2-upload.json`
2. **Upload:** Scans your local staging folder, computes MD5 hashes, skips unchanged files, uploads new/changed ones
3. **Manifest:** `.r2-manifest.json` tracks what's uploaded locally (gitignored along with all other R2 files)

---
Packaged with Claude Code /export-skill | Commands provided by [Authority Hacker's AI Accelerator](https://www.authorityhacker.com/ai-accelerator/). Enjoy ✌️
