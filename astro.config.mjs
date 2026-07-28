// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// À remplacer par le nom de domaine personnalisé une fois acheté (patte-maligne.fr)
const SITE_URL = 'https://patte-maligne-5pxv.vercel.app';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap()],
});
