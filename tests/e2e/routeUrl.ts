// astro.config.mjs sets `base: '/telehealth'` for GitHub Pages (a project site is served under
// /telehealth/, not /). Playwright's baseURL joining follows WHATWG URL rules, where a
// leading "/" in the navigated path resets the URL's whole path and silently drops that base
// (BUG-002) — so route paths must have their leading slash stripped before `page.goto` for the
// join against playwright.config.ts's baseURL (which already ends in /telehealth/) to work.
export function routeUrl(route: string): string {
  return route === '/' ? '' : route.slice(1);
}
