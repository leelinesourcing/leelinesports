// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.leelinesports.com/',

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
