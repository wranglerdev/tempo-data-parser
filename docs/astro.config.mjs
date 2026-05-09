// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://wranglerdev.github.io',
  base: '/tempo-data-parser/',
  vite: {
    plugins: [tailwindcss()],
  },
});
