# Phase 6: Audit & Optimization Checklist

---

## Audit Targets

| Category | Desktop Target | Mobile Target |
|----------|---------------|---------------|
| Performance | >= 95 | >= 95 |
| Accessibility | >= 95 | >= 95 |
| Best Practices | >= 100 | >= 100 |
| SEO | >= 100 | >= 100 |

---

## Pre-Audit Preparation

Before running Lighthouse:

- [ ] Page is navigable to via HTTP (not file://)
- [ ] All images loaded and rendering
- [ ] All interactive elements working (accordion, tabs, CTA buttons)
- [ ] Console has zero errors
- [ ] Page has a meta viewport tag
- [ ] Page has a `<title>` tag
- [ ] Page has a meta description

---

## Desktop Audit Checklist

### Run Desktop Lighthouse
```bash
# Via Chrome DevTools MCP:
# Navigate to page > Lighthouse tab > Desktop mode > Generate report
```

### Performance Checks

| Check | Threshold | Fix if Failing |
|-------|-----------|----------------|
| LCP (Largest Contentful Paint) | < 2.5s | Optimize hero image: WebP, resize to 1920x1080, add `loading="eager"`, add `fetchpriority="high"` |
| TBT (Total Blocking Time) | < 50ms | Defer non-critical JS, split bundles, remove unused CSS |
| CLS (Cumulative Layout Shift) | < 0.1 | Set explicit `width` and `height` on all images/videos. Reserve space for embeds. |
| Speed Index | < 3.0s | Inline critical CSS, defer non-critical styles |
| Image optimization | Score >= 95 | Compress images further, use responsive srcset |
| Render-blocking resources | Score >= 95 | Defer non-critical CSS/JS, inline critical styles |
| Properly sized images | Score >= 95 | Use responsive images with `srcset` and `sizes` |

### Accessibility Checks

| Check | Standard | Fix if Failing |
|-------|----------|----------------|
| Heading hierarchy | h1 → h2 → h3 (no skips) | Restructure headings sequentially |
| ALT text on images | All meaningful images have ALT | Add semantic ALT text |
| Form labels | All form fields have labels | Add `<label>` or `aria-label` |
| Color contrast | >= 4.5:1 normal text, >= 3:1 large | Adjust text/background colors |
| Focus states | All interactive elements visible on focus | Add `:focus-visible` styles |
| ARIA landmarks | Main, nav, footer landmarks | Add semantic HTML elements |
| Touch targets | >= 48x48px mobile | Increase button/link sizes |

### Best Practices Checks

| Check | Fix if Failing |
|-------|----------------|
| HTTPS | Ensure page is served over HTTPS |
| No JS errors | Fix any console errors |
| Correct image aspect ratio | Verify width/height attributes match rendered size |
| No deprecated APIs | Check for usage of deprecated features |
| Proper font display | Use `font-display: swap` or `optional` |

### SEO Checks

| Check | Fix if Failing |
|-------|----------------|
| Document title | `<title>` must be unique, descriptive |
| Meta description | `<meta name="description">` with primary keyword |
| Heading structure | One h1, logical h2-h3 hierarchy |
| Link text | Descriptive link text (no "click here") |
| robots meta | Allow indexing unless specified otherwise |
| Open Graph tags | og:title, og:description, og:image, og:url |
| Canonical URL | `<link rel="canonical">` |

---

## Mobile Audit Checklist

### Pre-Mobile Audit

- [ ] Viewport meta tag set to `width=device-width, initial-scale=1`
- [ ] No horizontal scroll at 375px width
- [ ] Touch targets >= 48x48px
- [ ] Font sizes >= 16px (prevents iOS zoom)

### Run Mobile Lighthouse
```bash
# Via Chrome DevTools MCP:
# Navigate to page > Lighthouse tab > Mobile mode > Generate report
```

### Mobile-Specific Performance Fixes

| Issue | Fix |
|-------|-----|
| Hero image too large | Serve mobile hero: max 768px wide, < 80KB |
| Font rendering blocking | Ensure `font-display: swap` on all `@font-face` declarations |
| Third-party scripts delaying load | Defer or async analytics, chat widgets |
| Too many network connections | Limit to 2-3 critical third-party origins |
| Large DOM size | Keep < 1500 nodes, < 60 depth |

---

## Iterative Fix Pattern

For each failed Lighthouse check:

```
1. Identify the failing element/asset from Lighthouse report
2. Apply fix (compress image, add dimension, defer script, etc.)
3. Rebuild: npm run build
4. Re-run Lighthouse on that category
5. Repeat until threshold met
```

### Common Issues & Their Fixes

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| Low LCP score | Hero image too large, not optimized | Convert to WebP, resize to 1920px wide, add `fetchpriority="high"` |
| Low CLS score | Images without width/height, web fonts | Add explicit dimensions, use `font-display: swap` |
| Low TBT score | Render-blocking JS, heavy components | Add `defer` or `type="module"` to scripts, lazy-load below-fold components |
| Low A11y score | Missing ALT, poor contrast | Add ALT text, adjust color palette |
| Low BP score | Mixed content, console errors | Fix protocol mismatches, remove debug logs |
| Low SEO score | Missing meta tags, poor heading structure | Add meta description, fix heading hierarchy |

---

## Final Verification

After all audits pass:

- [ ] Desktop Lighthouse: Perf >= 95, A11y >= 95, BP >= 100, SEO >= 100
- [ ] Mobile Lighthouse: Perf >= 95, A11y >= 95, BP >= 100, SEO >= 100
- [ ] `npm run build` or equivalent succeeds with zero errors
- [ ] Page loads without console errors
- [ ] Page responsive at 1440px, 1024px, 768px, 375px
- [ ] All CTA buttons functional
- [ ] FAQ accordion opens/closes
- [ ] Images load and have correct ALT text
- [ ] No broken links
- [ ] Contact/form submission works
