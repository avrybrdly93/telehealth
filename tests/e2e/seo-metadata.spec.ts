import { test, expect } from '@playwright/test';
import { ROUTES } from './routes';
import { SITE_ROUTES } from '../../src/lib/routes';
import { routeUrl } from './routeUrl';
import { BASE_URL } from '../../playwright.config';

// BL-040. GLOBAL-01 already asserts that each route has one h1 and a non-empty, unique
// title/description. Everything else `BaseLayout.astro` emits for BL-030/BL-031 — canonical, the
// eight OG/Twitter tags, the site-wide MedicalBusiness JSON-LD — is only covered by
// structuredData.test.ts's unit tests of the *builders*. Nothing asserted the tags land on the
// page, point at the right URL, or agree with the title the page actually renders.
//
// FR-050/FR-051, NFR-005, SEO_STRATEGY.md §Technical Foundation.

const SITE_ORIGIN = 'https://avrybrdly93.github.io'; // astro.config.mjs `site`
const BASE_PATH = new URL(BASE_URL).pathname.replace(/\/$/, ''); // "/telehealth"

async function metaContent(page: import('@playwright/test').Page, selector: string) {
  return page.locator(`head ${selector}`).getAttribute('content');
}

for (const route of ROUTES) {
  test(`${route} points its canonical at its own production URL`, async ({ page }) => {
    await page.goto(routeUrl(route));

    const canonical = await page.locator('head link[rel="canonical"]').getAttribute('href');
    expect(canonical, 'every route must declare a canonical').toBeTruthy();

    const url = new URL(canonical!);
    // Absolute and on the real deployment origin — a canonical pointing at 127.0.0.1 would ship
    // the local test URL to search engines, which is exactly the class of mistake BUG-005 was.
    expect(url.origin).toBe(SITE_ORIGIN);
    expect(url.pathname.startsWith(`${BASE_PATH}/`)).toBe(true);

    const expectedPath = route === '/' ? `${BASE_PATH}/` : `${BASE_PATH}${route}`;
    expect(url.pathname.replace(/\/$/, '')).toBe(expectedPath.replace(/\/$/, ''));
  });

  test(`${route} emits OG and Twitter tags that agree with the page`, async ({ page }) => {
    await page.goto(routeUrl(route));

    const title = await page.title();
    const description = await metaContent(page, 'meta[name="description"]');
    const canonical = await page.locator('head link[rel="canonical"]').getAttribute('href');

    expect(await metaContent(page, 'meta[property="og:type"]')).toBe('website');
    expect(await metaContent(page, 'meta[property="og:title"]')).toBe(title);
    expect(await metaContent(page, 'meta[property="og:description"]')).toBe(description);
    expect(await metaContent(page, 'meta[property="og:url"]')).toBe(canonical);
    expect(await metaContent(page, 'meta[name="twitter:card"]')).toBe('summary_large_image');
    expect(await metaContent(page, 'meta[name="twitter:title"]')).toBe(title);
    expect(await metaContent(page, 'meta[name="twitter:description"]')).toBe(description);

    // The OG image must be an absolute URL — relative values are ignored by every crawler that
    // matters, and a base-less one repeats BUG-006.
    for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
      const image = await metaContent(page, selector);
      expect(image).toBeTruthy();
      const imageUrl = new URL(image!);
      expect(imageUrl.origin).toBe(SITE_ORIGIN);
      expect(imageUrl.pathname.startsWith(`${BASE_PATH}/`)).toBe(true);
    }
  });

  test(`${route} carries valid site-wide MedicalBusiness structured data`, async ({ page }) => {
    await page.goto(routeUrl(route));

    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks.length).toBeGreaterThan(0);

    const parsed = blocks.map((block) => JSON.parse(block));
    const business = parsed.find((entry) => entry['@type'] === 'MedicalBusiness');
    expect(business, 'MedicalBusiness is site-wide per BL-031').toBeTruthy();
    expect(business['@context']).toBe('https://schema.org');
    expect(business.areaServed).toBeTruthy();
    // LOCAL_SEARCH_STRATEGY.md: no fake address markup, deliberately. Asserting its *absence*
    // keeps a future "improve local SEO" change from quietly inventing one.
    expect(business.address).toBeUndefined();
  });
}

test.describe('sitemap.xml (BL-030)', () => {
  test('lists exactly SITE_ROUTES, absolute, on the production origin, and each one resolves', async ({
    request,
  }) => {
    const response = await request.get(new URL('sitemap.xml', BASE_URL).toString());
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('xml');

    const body = await response.text();
    const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

    const expected = SITE_ROUTES.map(
      (route) => `${SITE_ORIGIN}${BASE_PATH}${route === '/' ? '/' : `${route}/`}`,
    );
    expect(locs).toEqual(expected);

    // /404 is deliberately not a sitemap entry (tests/e2e/routes.ts says so); assert it, so the
    // day someone adds it to SITE_ROUTES this fails rather than silently indexing an error page.
    expect(locs.some((loc) => loc.includes('/404'))).toBe(false);

    for (const loc of locs) {
      const path = new URL(loc).pathname;
      const local = await request.get(new URL(path, BASE_URL).toString());
      expect(local.status(), `${path} is in the sitemap but does not resolve`).toBeLessThan(400);
    }
  });

  test('robots.txt is served under the base and its Sitemap line is the real sitemap URL', async ({
    request,
  }) => {
    // Note the path: `public/robots.txt` ships to `/telehealth/robots.txt`, not to the origin
    // root. Crawlers only ever read `https://<origin>/robots.txt`, which on a GitHub Pages
    // *project* site belongs to the user site, not to this repo — so this file is served but not
    // consulted in production. That is a real BL-030 gap and is filed as BL-041; it is not this
    // test's job to assert a URL the deployment cannot produce, so this asserts what the build
    // actually ships and BL-041 owns the fix.
    const response = await request.get(new URL('robots.txt', BASE_URL).toString());
    expect(response.status()).toBe(200);

    const body = await response.text();
    const sitemapLine = /^Sitemap:\s*(\S+)$/m.exec(body);
    expect(sitemapLine, 'robots.txt must declare a Sitemap').toBeTruthy();
    expect(sitemapLine![1]).toBe(`${SITE_ORIGIN}${BASE_PATH}/sitemap.xml`);
  });
});
