// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// À remplacer par l'URL Vercel réelle une fois le projet déployé
// (ou par le nom de domaine personnalisé si acheté plus tard)
const SITE_URL = 'https://patte-maligne.vercel.app';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap()],
});
