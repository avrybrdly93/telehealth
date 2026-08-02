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
