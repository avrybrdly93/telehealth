/**
 * Prepends the deployment base path (astro.config.mjs's `base`, `/telehealth` on the live
 * GitHub Pages project site) to a root-relative internal path. Astro does not rewrite plain
 * string hrefs for a non-root `base` (BUG-005: every hardcoded `href="/pricing"` etc. site-wide
 * resolved against the origin instead, 404ing in production) — every internal `href` must go
 * through this instead of a hardcoded string, the same `import.meta.env.BASE_URL` pattern
 * `BaseLayout.astro` already uses for font/OG-image URLs. Not for `tel:`/`mailto:`/external
 * URLs, or anything already base-prefixed (e.g. `Astro.url.pathname`).
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return path === '/' ? `${base}/` : `${base}${path}`;
}

// Every real, indexable route in src/pages (404 excluded — not a page to link to or index).
// Extend this list as pages ship (BL-010+); sitemap.xml.ts and tests/e2e/routes.ts both derive
// from this single list so route coverage can't drift between them.
export const SITE_ROUTES = [
  '/',
  '/services',
  '/services/psychiatric-evaluation',
  '/services/medication-management',
  '/providers',
  '/providers/dr-md',
  '/providers/np-pmhnp',
  '/pricing',
  '/about',
  '/your-first-visit',
  '/faq',
  '/contact',
  '/legal/privacy',
  '/legal/terms',
  '/legal/accessibility',
  '/legal/telehealth-consent',
];
