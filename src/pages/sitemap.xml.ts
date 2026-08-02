import type { APIRoute } from 'astro';
import { SITE_ROUTES } from '../lib/routes';

// Hand-rolled rather than @astrojs/sitemap: adding a new runtime dependency is Tier 3
// (DECISION_FRAMEWORK.md) and needs human approval first; SITE_ROUTES is small and stable
// enough that a plain XML template covers FR-050 without one.
export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const urls = SITE_ROUTES.map((route) => {
    const path = route === '/' ? `${base}/` : `${base}${route}/`;
    return new URL(path, site).href;
  });

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => `  <url><loc>${url}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
