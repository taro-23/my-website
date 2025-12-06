// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';


export default defineConfig({
  integrations: [
    react(),
    mdx(),
    icon(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});