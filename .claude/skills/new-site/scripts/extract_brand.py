#!/usr/bin/env python3
"""Extract brand identity (colors, fonts, logo) from a URL.

Usage:
    python3 extract_brand.py https://example.com -o research/

Outputs:
    - brand-identity.json (colors, fonts, CSS variables, logo URLs)
    - logo.png/svg/jpg (downloaded logo file)
"""

import argparse
import json
import os
import re
import sys
from urllib.parse import urljoin

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Install dependencies: pip3 install requests beautifulsoup4", file=sys.stderr)
    sys.exit(1)

HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}

# Colors that are too generic to be brand colors
COMMON_COLORS = {
    '#000', '#000000', '#fff', '#ffffff', '#333', '#333333', '#666', '#666666',
    '#999', '#999999', '#ccc', '#cccccc', '#eee', '#eeeeee', '#f5f5f5', '#fafafa',
    '#ddd', '#dddddd', '#aaa', '#aaaaaa', '#bbb', '#bbbbbb', '#f0f0f0', '#e0e0e0',
    '#111', '#111111', '#222', '#222222', '#444', '#444444', '#555', '#555555',
    '#777', '#777777', '#888', '#888888', '#transparent',
}

GENERIC_FONTS = {
    'inherit', 'initial', 'unset', 'serif', 'sans-serif', 'monospace',
    'cursive', 'fantasy', 'system-ui', '-apple-system', 'blinkmacsystemfont',
    'segoe ui', 'arial', 'helvetica', 'helvetica neue', 'times new roman',
    'times', 'courier new', 'courier', 'verdana', 'georgia', 'tahoma',
}

# CSS variable prefixes from common CMS platforms (WordPress, Shopify, etc.)
# These are platform defaults, not brand-specific variables
CMS_VAR_PREFIXES = [
    '--wp--preset--',           # WordPress block editor presets
    '--wp--custom--',           # WordPress custom presets
    '--wp--style--',            # WordPress style engine
    '--global--color--',        # WordPress global colors
    '--color-base',             # Shopify Dawn theme
    '--font-body',              # Shopify generic
    '--font-heading',           # Shopify generic
    '--swiper-',                # Swiper.js slider
    '--bs-',                    # Bootstrap
    '--chakra-',                # Chakra UI
    '--mantine-',               # Mantine UI
    '--tw-',                    # Tailwind CSS
]


def fetch_page(url):
    resp = requests.get(url, headers=HEADERS, timeout=30)
    resp.raise_for_status()
    return resp.text


def get_all_css(soup, base_url):
    """Collect CSS from <style> tags and linked stylesheets (up to 5)."""
    parts = []

    for style in soup.find_all('style'):
        if style.string:
            parts.append(style.string)

    fetched = 0
    for link in soup.find_all('link', rel='stylesheet'):
        if fetched >= 5:
            break
        href = link.get('href', '')
        if href:
            try:
                resp = requests.get(urljoin(base_url, href), headers=HEADERS, timeout=10)
                if resp.ok:
                    parts.append(resp.text)
                    fetched += 1
            except Exception:
                pass

    for tag in soup.find_all(style=True):
        parts.append(tag['style'])

    return '\n'.join(parts)


def extract_css_variables(css_text):
    """Extract CSS custom properties that look brand-related, filtering out CMS defaults."""
    brand_keywords = [
        'color', 'brand', 'primary', 'secondary', 'accent', 'surface',
        'bg', 'background', 'text', 'heading', 'link', 'button', 'cta',
        'highlight', 'border', 'gradient', 'theme',
    ]
    variables = {}
    for match in re.finditer(r'--([\w-]+)\s*:\s*([^;}{]+)', css_text):
        name = match.group(1).strip()
        value = match.group(2).strip()
        full_var = f'--{name}'

        # Skip CMS platform defaults
        if any(full_var.startswith(prefix) for prefix in CMS_VAR_PREFIXES):
            continue

        if any(kw in name.lower() for kw in brand_keywords):
            variables[full_var] = value
    return variables


def extract_colors(css_text):
    """Extract hex and rgb colors from CSS."""
    colors = set()

    for match in re.finditer(r'#([0-9a-fA-F]{3,8})\b', css_text):
        hex_val = match.group(0).lower()
        if len(hex_val) in (4, 7, 9):
            colors.add(hex_val)

    for match in re.finditer(r'rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)', css_text):
        r, g, b = int(match.group(1)), int(match.group(2)), int(match.group(3))
        colors.add(f'#{r:02x}{g:02x}{b:02x}')

    return sorted(colors - COMMON_COLORS)


def extract_fonts(css_text):
    """Extract font-family declarations (non-generic)."""
    fonts = set()
    for match in re.finditer(r'font-family\s*:\s*([^;}{]+)', css_text):
        for font_part in match.group(1).split(','):
            font = font_part.strip().strip('"\'').strip()
            if font and font.lower() not in GENERIC_FONTS:
                fonts.add(font)
    return sorted(fonts)


def extract_google_fonts(html):
    """Extract Google Fonts from link tags."""
    fonts = set()
    for match in re.finditer(r'fonts\.googleapis\.com/css2?\?family=([^"&\s]+)', html):
        for font in match.group(1).split('|'):
            fonts.add(font.split(':')[0].replace('+', ' '))
    return sorted(fonts)


def find_logos(soup, base_url):
    """Find likely logo URLs from img tags, favicons, and og:image."""
    logos = []

    for img in soup.find_all('img'):
        src = img.get('src', '')
        alt = img.get('alt', '')
        classes = ' '.join(img.get('class', []))
        parent_classes = ' '.join(img.parent.get('class', [])) if img.parent else ''
        haystack = (src + alt + classes + parent_classes).lower()

        if any(kw in haystack for kw in ['logo', 'brand', 'site-icon']):
            logos.append({
                'url': urljoin(base_url, src),
                'alt': alt,
                'source': 'img_tag',
            })

    for link in soup.find_all('link'):
        rel = ' '.join(link.get('rel', []))
        href = link.get('href', '')
        if 'icon' in rel and href:
            logos.append({
                'url': urljoin(base_url, href),
                'sizes': link.get('sizes', ''),
                'source': 'favicon',
            })

    og = soup.find('meta', property='og:image')
    if og and og.get('content'):
        logos.append({
            'url': urljoin(base_url, og['content']),
            'source': 'og_image',
        })

    return logos


def download_logo(logo_url, output_dir):
    """Download a logo file. Returns local path or None."""
    try:
        resp = requests.get(logo_url, headers=HEADERS, timeout=15)
        resp.raise_for_status()

        ct = resp.headers.get('content-type', '')
        if 'svg' in ct or logo_url.endswith('.svg'):
            ext = '.svg'
        elif 'jpeg' in ct or 'jpg' in ct:
            ext = '.jpg'
        elif 'webp' in ct:
            ext = '.webp'
        else:
            ext = '.png'

        path = os.path.join(output_dir, f'logo{ext}')
        with open(path, 'wb') as f:
            f.write(resp.content)
        return path
    except Exception as e:
        print(f"Logo download failed: {e}", file=sys.stderr)
        return None


def main():
    parser = argparse.ArgumentParser(description='Extract brand identity from URL')
    parser.add_argument('url', help='URL to analyze')
    parser.add_argument('--output-dir', '-o', default='.', help='Output directory')
    args = parser.parse_args()

    os.makedirs(args.output_dir, exist_ok=True)

    print(f"Fetching {args.url}...", file=sys.stderr)
    html = fetch_page(args.url)
    soup = BeautifulSoup(html, 'html.parser')

    print("Extracting CSS...", file=sys.stderr)
    all_css = get_all_css(soup, args.url)

    css_vars = extract_css_variables(all_css)
    colors = extract_colors(all_css)[:20]
    fonts = extract_fonts(all_css)
    google_fonts = extract_google_fonts(html)
    logos = find_logos(soup, args.url)

    # Download best logo: prefer img_tag > og_image > favicon
    logo_path = None
    for source in ('img_tag', 'og_image', 'favicon'):
        candidates = [l for l in logos if l['source'] == source]
        if candidates:
            logo_path = download_logo(candidates[0]['url'], args.output_dir)
            if logo_path:
                break

    result = {
        'url': args.url,
        'css_variables': css_vars,
        'colors': colors,
        'fonts': sorted(set(fonts + google_fonts)),
        'google_fonts': google_fonts,
        'logos': [l['url'] for l in logos],
        'logo_downloaded': logo_path,
    }

    output_file = os.path.join(args.output_dir, 'brand-identity.json')
    with open(output_file, 'w') as f:
        json.dump(result, f, indent=2)

    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
