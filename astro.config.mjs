// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.leelinesports.com/',

  image: {
    // Content images live in the `leelinesports` R2 bucket behind this custom
    // domain. Astro fetches them at build time and emits optimised local
    // variants, so the bucket is the source of truth but delivery stays
    // same-origin (see the image rules in CLAUDE.md).
    remotePatterns: [{ protocol: 'https', hostname: 'img.leelinesports.com' }],
  },

  integrations: [
    sitemap({
      // The design system inventory is internal — it carries a noindex meta tag,
      // which the sitemap integration cannot read, so filter it out here.
      filter: (page) => !page.includes('/design-system/'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
