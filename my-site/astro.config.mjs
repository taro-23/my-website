// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

export default defineConfig({
  site: "https://www.kimurataro.com/",
  integrations: [
    react(), 
    mdx(), 
    icon(), 
    sitemap(), 
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    })
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  // 末尾スラッシュの設定（.mdx拡張子を非表示にするため）
  trailingSlash: 'never',
  // ビルド設定
  build: {
    format: 'directory'
  }
});