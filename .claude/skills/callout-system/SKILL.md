---
name: callout-system
description: Deploy an emoji-prefixed blog callout/highlight system to any Astro + Tailwind CSS project. Auto-detects bold paragraphs with emoji prefixes in markdown and wraps them in styled callout boxes. Only targets blog content (src/content/blog/); skips case studies, pages, and other content types.
---

# Blog Callout/Highlight Module System

Deploy an emoji-prefixed callout system to any Astro + Tailwind CSS v4 project. This skill auto-detects bold paragraphs with emoji prefixes in markdown and wraps them in styled callout boxes. **Zero changes to existing blog content required.**

## When to Use

Use this skill when:
- Blog posts use emoji-prefixed bold paragraphs (e.g. `**⚡ Power Move:** text`) and you want them rendered as visually distinct callout boxes
- You need a non-disruptive way to highlight tips, warnings, insights, and expert takes in long-form content
- You want an automatic content transformation — no manual HTML editing required

## Execution Rules

- **Scope constraint**: Only apply callout optimization to blog markdown content under `src/content/blog/`. Skip case studies, pages, and other content types.
- **URL-based scoping**: If the user provides a specific blog post URL (e.g., `/blog/first-sourcing-project`), only optimize that single post. Otherwise, review all blog posts for callout opportunities.

## How It Works

A **rehype plugin** walks the HTML AST and detects `<p>` elements where the first child is `<strong>` containing a known emoji + keyword pattern. When matched, the `<p>` is wrapped in `<div class="callout callout--{type}"><p>...</p></div>`.

We use rehype (not remark) because HAST allows direct element wrapping without serializing/deserializing HTML strings. The plugin uses a simple iterative tree walker — zero external dependencies.

## Implementation Steps

Follow these steps in order:

### 1. Create the rehype plugin

Create `src/plugins/rehype-callouts.mjs`:

```js
/**
 * Rehype plugin that detects emoji-prefixed bold paragraphs in HTML output
 * and wraps them in styled callout <div> containers.
 *
 * Detects patterns like: <p><strong>⚡ Power Move:</strong> text...</p>
 * and transforms to: <div class="callout callout--power-move"><p>...</p></div>
 */

const CALLOUT_PATTERNS = [
  { emoji: '\u26a1', keywords: ['power move'], type: 'power-move' },
  { emoji: '\u26a0\ufe0f', keywords: ['safety first'], type: 'safety-tip' },
  { emoji: '\ud83d\ude80', keywords: ['actionable insight'], type: 'actionable-insight' },
  { emoji: '\ud83e\udde0', keywords: ['expert take'], type: 'expert-take' },
  { emoji: '\ud83d\udca1', keywords: ['pro tip'], type: 'pro-tip' },
  { emoji: '\ud83d\udccb', keywords: ['checklist'], type: 'checklist' },
];

function getTextContent(node) {
  if (node.type === 'text') return node.value;
  if (node.children) return node.children.map(getTextContent).join('');
  return '';
}

function getCalloutType(text) {
  const lower = text.toLowerCase().trim();
  for (const pattern of CALLOUT_PATTERNS) {
    if (!lower.includes(pattern.emoji)) continue;
    for (const kw of pattern.keywords) {
      if (lower.includes(kw)) return pattern.type;
    }
  }
  return null;
}

function walk(tree, handler) {
  const stack = [{ node: tree, parent: null, index: null }];
  while (stack.length > 0) {
    const { node, parent, index } = stack.pop();
    handler(node, index, parent);
    if (node.children) {
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push({ node: node.children[i], parent: node, index: i });
      }
    }
  }
}

export default function rehypeCallouts() {
  return (tree) => {
    walk(tree, (node, index, parent) => {
      if (!parent || index === null) return;
      if (node.type !== 'element') return;
      if (node.tagName !== 'p') return;
      if (!node.children || node.children.length === 0) return;

      const firstChild = node.children[0];
      if (firstChild.type !== 'element') return;
      if (firstChild.tagName !== 'strong') return;

      const strongText = getTextContent(firstChild);
      const type = getCalloutType(strongText);
      if (!type) return;

      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['callout', `callout--${type}`] },
        children: [node],
      };
    });
  };
}
```

### 2. Register the plugin in `astro.config.mjs`

```js
import rehypeCallouts from './src/plugins/rehype-callouts.mjs';

export default defineConfig({
  markdown: {
    rehypePlugins: [rehypeCallouts /* ...other plugins */],
  },
});
```

**Place `rehypeCallouts` first** in the rehypePlugins array so callout wrapping happens before other plugins.

### 3. Add the color token to your Tailwind theme

In `src/styles/global.css`, inside the `@theme static` block, add:

```css
--color-safety: #e0a040;
```

Adjust the hex value to match your brand palette. This color is used for safety/warning callouts.

### 4. Add callout CSS styles

```css
/* ===== Blog Callout Boxes ===== */
.callout {
  border-left: 3px solid;
  border-radius: 0 0.75rem 0.75rem 0;
  padding: 1rem 1.25rem;
  margin: 1.5rem 0;
}

.callout p {
  margin: 0;
}

.callout--power-move {
  background: rgba(232, 197, 71, 0.1);
  border-color: var(--color-gold);
}

.callout--safety-tip {
  background: rgba(224, 160, 64, 0.1);
  border-color: var(--color-safety);
}

.callout--actionable-insight {
  background: rgba(28, 111, 102, 0.1);
  border-color: var(--color-teal);
}

.callout--expert-take {
  background: rgba(10, 42, 51, 0.05);
  border-color: rgba(10, 42, 51, 0.4);
}

.callout--pro-tip {
  background: rgba(28, 111, 102, 0.05);
  border-color: rgba(28, 111, 102, 0.5);
}

.callout--checklist {
  background: var(--color-cream);
  border-color: rgba(232, 197, 71, 0.5);
}
```

Adapt the CSS variable references (`--color-gold`, `--color-teal`, etc.) to match your project's theme tokens.

### 5. Add prose override for paragraph margins

If your blog template uses Tailwind prose classes with `[&_p]:mb-6` (or similar paragraph margin utilities), add this to the prose container to prevent margin conflicts inside callouts:

```
[&_.callout_p]:mb-0
```

This ensures the `.editorial-prose .callout p` selector has higher specificity than `.editorial-prose p`.

### 6. Build and verify

```bash
npm run build
```

Check the generated HTML — callout paragraphs should now be wrapped in `<div class="callout callout--{type}">` containers.

## Callout Types Reference

| Emoji | Keyword | CSS Class | Background | Border | Purpose |
|-------|---------|-----------|-----------|--------|---------|
| ⚡ | power move | `callout--power-move` | Gold 10% | Gold | Energetic, premium |
| ⚠️ | safety first | `callout--safety-tip` | Amber 10% | Amber | Cautionary, warm |
| 🚀 | actionable insight | `callout--actionable-insight` | Teal 10% | Teal | Fresh, forward-moving |
| 🧠 | expert take | `callout--expert-take` | Navy 5% | Navy/40% | Authoritative, calm |
| 💡 | pro tip | `callout--pro-tip` | Teal 5% | Teal/50% | Helpful, friendly |
| 📋 | checklist | `callout--checklist` | Cream | Gold/50% | Organizational, neutral |

## Matching Rules

- Both **emoji AND keyword** must be present in the `<strong>` text (case-insensitive on keyword)
- ✅ `**⚡ Power Move:** Do X` — matches
- ✅ `**🚀 ACTIONABLE INSIGHT:** Do X` — matches (case-insensitive)
- ❌ `**Winner: Direct Factory**` — no emoji, no match
- ❌ `**⚡ Important:** Do X` — has emoji but no matching keyword

## Adding New Callout Types

1. Add an entry to `CALLOUT_PATTERNS` with the emoji (as Unicode escape), keywords array, and type name
2. Add the `.callout--{type}` CSS class
3. Authors use `**{emoji} {keyword}:**` in markdown — no code changes needed

## Prerequisites

- Astro 4+ project
- Tailwind CSS (v3 or v4)
- Blog posts in markdown
- Emoji-prefixed bold paragraphs in content
