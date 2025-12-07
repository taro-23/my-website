// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';


import sitemap from '@astrojs/sitemap';


export default defineConfig({
  site: "https://kimurataro.com/",
  integrations: [react(), mdx(), icon(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});