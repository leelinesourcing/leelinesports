# R2 Bucket Setup

All steps are CLI-based via wrangler. No dashboard needed.

## 1. Create a Bucket

```bash
wrangler r2 bucket create <bucket-name>
```

Naming rules: lowercase letters, numbers, hyphens only. 3-63 characters. Suggest `<project-name>-images`.

Verify:
```bash
wrangler r2 bucket list
```

## 2. Enable Public Access (r2.dev)

```bash
wrangler r2 bucket dev-url enable <bucket-name> -y
```

This gives the bucket a public URL like `https://pub-abc123.r2.dev`.

Get the URL:
```bash
wrangler r2 bucket dev-url get <bucket-name>
```

## 3. Test Upload

```bash
wrangler r2 object put <bucket-name>/test.txt --file <any-small-file> --content-type text/plain
```

Verify at: `https://pub-abc123.r2.dev/test.txt`

Clean up:
```bash
wrangler r2 object delete <bucket-name>/test.txt
```

## 4. Optional: Custom Domain (Dashboard Only)

For cleaner URLs like `https://images.yourdomain.com` instead of the r2.dev URL:

1. Go to **Cloudflare Dashboard** → **R2** → select the bucket
2. Click **Settings** tab
3. Under **Custom Domains**, click **Connect Domain**
4. Enter a subdomain like `images.yourdomain.com`
5. Cloudflare auto-creates the DNS record

Benefits of custom domain:
- Clean URLs
- Cloudflare CDN caching
- Free image transformations work on it

This can be done any time later — the r2.dev URL keeps working alongside it.
