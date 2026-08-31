import { test, expect } from '@playwright/test';
import { ROUTES } from './routes';
import { routeUrl } from './routeUrl';

// BL-040. Nothing in the suite has ever looked at the browser console or at whether a page's
// subresources actually arrived. A 404 on a stylesheet, a font, or an island's JS chunk does not
// fail any existing assertion — the page still renders, axe still passes, and the site ships
// broken. This is the cheapest coverage in the suite and the one that catches a bad build.

/**
 * `astro dev` serves `public/` assets only at their base-prefixed path, but Vite's dev pipeline
 * hands CSS `url()` values through unrewritten, so `global.css`'s `url('/fonts/…')` is requested
 * without the base and 404s — *in dev only*. The production build rewrites them
 * (`dist/_astro/*.css` contains `url(/telehealth/fonts/…)`, verified), and the preview run of
 * this same spec asserts that with no exception at all. Narrow, and deliberately not widened to
 * "any font": a real broken font in the built output must still fail this.
 */
const DEV_SERVER = process.env.E2E_SERVER === 'dev';
const DEV_ONLY_ALLOWED = [/\/fonts\/[^/]+\.woff2$/];

function isAllowedFailure(url: string): boolean {
  return DEV_SERVER && DEV_ONLY_ALLOWED.some((pattern) => pattern.test(new URL(url).pathname));
}

for (const route of ROUTES) {
  test(`${route} loads with no console errors and no uncaught exceptions`, async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.goto(routeUrl(route), { waitUntil: 'load' });
    // Islands hydrate after load; give the microtask queue a turn so a hydration throw lands
    // before the assertions rather than after the test ends.
    await page.waitForTimeout(250);

    expect(pageErrors, `uncaught exceptions on ${route}:\n${pageErrors.join('\n')}`).toEqual([]);

    const unexpected = consoleErrors.filter(
      (text) => !(DEV_SERVER && /\.woff2/.test(text) && /404/.test(text)),
    );
    expect(unexpected, `console errors on ${route}:\n${unexpected.join('\n')}`).toEqual([]);
  });

  test(`${route} fetches every subresource successfully`, async ({ page }) => {
    const failed: { url: string; status: number }[] = [];

    page.on('response', (response) => {
      if (response.status() >= 400 && !isAllowedFailure(response.url())) {
        failed.push({ url: response.url(), status: response.status() });
      }
    });
    page.on('requestfailed', (request) => {
      if (!isAllowedFailure(request.url())) failed.push({ url: request.url(), status: 0 });
    });

    await page.goto(routeUrl(route), { waitUntil: 'load' });
    await page.waitForTimeout(250);

    expect(failed, `failed requests on ${route}:\n${JSON.stringify(failed, null, 2)}`).toEqual([]);
  });
}

test.describe('E-040: the 404 page', () => {
  test('an unknown URL under the base serves the 404 document, not a blank or a redirect', async ({
    page,
  }) => {
    const response = await page.goto(routeUrl('/this-page-does-not-exist'));

    // `astro preview` and GitHub Pages both serve 404.html with a real 404 status.
    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test('offers a way back and keeps the crisis resources in reach (Flow 4)', async ({ page }) => {
    await page.goto(routeUrl('/404'));

    await expect(page.getByRole('note', { name: 'Crisis resources' }).first()).toBeVisible();

    // A dead end is the failure mode E-040 exists to prevent: there must be a working route out,
    // and following it must land on a real page — not another 404, and not the base-dropped URL
    // BUG-005 produced.
    const escape = page.getByRole('main').getByRole('link').first();
    await expect(escape).toBeVisible();

    const [response] = await Promise.all([page.waitForNavigation(), escape.click()]);
    expect(response?.status()).toBeLessThan(400);
    expect(new URL(page.url()).pathname).toMatch(/^\/telehealth\//);
    await expect(page.locator('h1')).toHaveCount(1);
  });
});
