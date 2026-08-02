import { SITE_ROUTES } from '../../src/lib/routes';

// GLOBAL-01/02 and the axe scan also cover /404, which isn't in SITE_ROUTES (not a sitemap entry).
export const ROUTES = [...SITE_ROUTES, '/404'];
