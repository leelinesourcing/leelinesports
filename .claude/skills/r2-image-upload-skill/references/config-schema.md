# Config & Manifest Schema

## `.r2-upload.json` (project config)

Created during first-run setup. Committed to git — contains no secrets.

```json
{
  "bucket": "my-site-images",
  "publicUrl": "https://images.example.com",
  "sourceFolder": "_images/"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `bucket` | string | R2 bucket name (as created with `wrangler r2 bucket create`) |
| `publicUrl` | string | Base URL for public access. No trailing slash. Either a custom domain (`https://images.example.com`) or R2.dev URL (`https://pub-abc123.r2.dev`) |
| `sourceFolder` | string | Relative path from project root to the local staging folder (gitignored). Trailing slash required. |

## `.r2-manifest.json` (upload state)

Tracks which files have been uploaded and their hashes. Committed to git so the whole team shares upload state.

```json
{
  "blog/hero.webp": {
    "hash": "d41d8cd98f00b204e9800998ecf8427e",
    "url": "https://images.example.com/blog/hero.webp",
    "uploadedAt": "2026-03-09T14:30:00Z"
  },
  "logo.svg": {
    "hash": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
    "url": "https://images.example.com/logo.svg",
    "uploadedAt": "2026-03-09T14:30:01Z"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| *key* | string | Relative path from `sourceFolder` (this becomes the R2 object key) |
| `hash` | string | MD5 hash of the local file at time of upload |
| `url` | string | Full public URL of the uploaded file |
| `uploadedAt` | string | ISO 8601 timestamp of the upload |

### Manifest Rules

- Keys use forward slashes regardless of OS
- The manifest is the single source of truth for dedup — if a file is in the manifest with a matching hash, it does not get re-uploaded
- If a file is deleted locally but still in the manifest, leave the manifest entry (the R2 object still exists)
- If the user wants to force re-upload, they can delete the entry from the manifest
