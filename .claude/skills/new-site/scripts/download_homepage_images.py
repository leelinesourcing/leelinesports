#!/usr/bin/env python3
"""Download content images from a homepage into the Astro public folder.

Usage:
    python3 download_homepage_images.py https://example.com \
        --project-dir /path/to/astro-project \
        --manifest .new-site/homepage-images.json \
        --max 15

Outputs:
    - {project-dir}/public/images/redesign/image-01.jpg (etc.)
    - manifest JSON with local paths, alt text, and Astro src paths
"""

import argparse
import json
import os
import re
import sys
from urllib.parse import urljoin, urlparse

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Install dependencies: pip3 install requests beautifulsoup4", file=sys.stderr)
    sys.exit(1)

HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}

# URL fragments that indicate non-content images (icons, logos, tracking pixels, etc.)
SKIP_PATTERNS = [
    'logo', 'icon', 'favicon', 'sprite', '1x1', 'pixel', 'avatar',
    'gravatar', 'placeholder', 'blank', 'spacer', 'separator', 'divider',
    'arrow', 'checkmark', 'star-rating', 'badge', 'seal', 'ribbon',
    'pattern', 'texture', 'noise', 'gradient', 'bg-', '-bg',
]

# Extensions to skip (usually non-photo assets)
SKIP_EXTENSIONS = {'.svg', '.gif', '.ico', '.webp'}  # webp ok to include actually
SKIP_EXTENSIONS = {'.svg', '.gif', '.ico'}

# Minimum image URL length (filters out data: URIs kept short)
MIN_URL_LENGTH = 10


def fetch_page(url):
    resp = requests.get(url, headers=HEADERS, timeout=30)
    resp.raise_for_status()
    return resp.text, resp.url  # resp.url has final URL after redirects


def should_skip_url(url):
    """Return True if this URL looks like a non-content image."""
    lower = url.lower()
    # Skip data URIs
    if lower.startswith('data:'):
        return True
    # Skip very short URLs
    if len(url) < MIN_URL_LENGTH:
        return True
    # Skip based on path fragments
    path = urlparse(url).path.lower()
    if any(pat in path for pat in SKIP_PATTERNS):
        return True
    # Skip certain extensions
    ext = os.path.splitext(path)[1]
    if ext in SKIP_EXTENSIONS:
        return True
    return False


def collect_image_urls(soup, base_url):
    """Collect candidate image URLs from img tags, picture sources, and inline bg styles."""
    candidates = []  # list of (url, alt)

    # <img> tags
    for img in soup.find_all('img'):
        src = img.get('src') or img.get('data-src') or img.get('data-lazy-src', '')
        alt = img.get('alt', '').strip()
        if src and not should_skip_url(src):
            candidates.append((urljoin(base_url, src), alt))

    # <source> tags inside <picture>
    for source in soup.find_all('source'):
        srcset = source.get('srcset', '')
        if srcset:
            # Take the first URL from srcset (highest res is often last, but first is fine)
            first = srcset.split(',')[0].strip().split()[0]
            if first and not should_skip_url(first):
                # Try to get alt from sibling <img>
                parent = source.parent
                sibling_img = parent.find('img') if parent else None
                alt = sibling_img.get('alt', '').strip() if sibling_img else ''
                candidates.append((urljoin(base_url, first), alt))

    # Inline background-image styles
    for tag in soup.find_all(style=True):
        for match in re.finditer(r'background-image\s*:\s*url\(["\']?([^"\')\s]+)["\']?\)', tag['style']):
            url = match.group(1)
            if not should_skip_url(url):
                candidates.append((urljoin(base_url, url), ''))

    # Deduplicate while preserving order
    seen = set()
    unique = []
    for url, alt in candidates:
        if url not in seen:
            seen.add(url)
            unique.append((url, alt))

    return unique


def get_extension(url, content_type):
    """Determine file extension from URL or content-type header."""
    # Try URL first
    path = urlparse(url).path
    ext = os.path.splitext(path)[1].lower()
    if ext in ('.jpg', '.jpeg', '.png', '.webp', '.avif'):
        return '.jpg' if ext == '.jpeg' else ext

    # Fall back to content-type
    ct = content_type.lower()
    if 'jpeg' in ct or 'jpg' in ct:
        return '.jpg'
    if 'png' in ct:
        return '.png'
    if 'webp' in ct:
        return '.webp'
    if 'avif' in ct:
        return '.avif'

    return '.jpg'  # default


def download_image(url, output_path):
    """Download a single image. Returns True on success."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15, stream=True)
        resp.raise_for_status()

        # Skip tiny responses (likely tracking pixels or errors)
        content_length = resp.headers.get('content-length')
        if content_length and int(content_length) < 2000:
            return False, None

        content = resp.content
        if len(content) < 2000:
            return False, None

        with open(output_path, 'wb') as f:
            f.write(content)
        return True, resp.headers.get('content-type', '')
    except Exception as e:
        print(f"  Skip {url}: {e}", file=sys.stderr)
        return False, None


def main():
    parser = argparse.ArgumentParser(description='Download homepage content images for redesign')
    parser.add_argument('url', help='Homepage URL to scrape')
    parser.add_argument('--project-dir', '-p', default='.', help='Astro project root directory')
    parser.add_argument('--manifest', '-m', default='.new-site/homepage-images.json',
                        help='Path to write the image manifest JSON')
    parser.add_argument('--max', type=int, default=15, help='Maximum images to download (default: 15)')
    args = parser.parse_args()

    output_dir = os.path.join(args.project_dir, 'public', 'images', 'redesign')
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(os.path.dirname(os.path.abspath(args.manifest)), exist_ok=True)

    print(f"Fetching {args.url}...", file=sys.stderr)
    html, final_url = fetch_page(args.url)
    soup = BeautifulSoup(html, 'html.parser')

    print("Collecting image candidates...", file=sys.stderr)
    candidates = collect_image_urls(soup, final_url)
    print(f"Found {len(candidates)} candidates, downloading up to {args.max}...", file=sys.stderr)

    manifest = []
    downloaded = 0

    for img_url, alt in candidates:
        if downloaded >= args.max:
            break

        idx = downloaded + 1
        # Temporary filename — we'll rename with correct extension after download
        tmp_path = os.path.join(output_dir, f'image-{idx:02d}.tmp')
        success, content_type = download_image(img_url, tmp_path)

        if not success:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
            continue

        # Determine final filename
        ext = get_extension(img_url, content_type or '')
        final_filename = f'image-{idx:02d}{ext}'
        final_path = os.path.join(output_dir, final_filename)
        os.rename(tmp_path, final_path)

        astro_path = f'/images/redesign/{final_filename}'
        print(f"  ✓ {final_filename} — {alt or '(no alt)'}", file=sys.stderr)

        manifest.append({
            'filename': final_filename,
            'astro_path': astro_path,
            'alt': alt,
            'original_url': img_url,
        })
        downloaded += 1

    # Write manifest
    with open(args.manifest, 'w') as f:
        json.dump({'images': manifest, 'total': downloaded, 'source_url': args.url}, f, indent=2)

    print(f"\nDownloaded {downloaded} images → {output_dir}", file=sys.stderr)
    print(f"Manifest written → {args.manifest}", file=sys.stderr)
    print(json.dumps({'images': manifest, 'total': downloaded}, indent=2))


if __name__ == '__main__':
    main()
