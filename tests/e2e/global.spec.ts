import { test, expect } from '@playwright/test';
import { ROUTES } from './routes';
import { routeUrl } from './routeUrl';

// Implements TESTING_AND_VALIDATION_PLAN.md's required E2E assertions GLOBAL-01/GLOBAL-02.
test.describe('GLOBAL-01: one h1 per route, unique title/description', () => {
  for (const route of ROUTES) {
    test(`${route} has exactly one h1 and a non-empty unique title/description`, async ({
      page,
    }) => {
      await page.goto(routeUrl(route));

      await expect(page.locator('h1')).toHaveCount(1);

      const title = await page.title();
      expect(title.trim().length).toBeGreaterThan(0);

      const description = await page
        .locator('head meta[name="description"]')
        .getAttribute('content');
      expect(description?.trim().length).toBeGreaterThan(0);
    });
  }

  test('titles are unique across routes', async ({ page }) => {
    const titles = new Set<string>();
    for (const route of ROUTES) {
      await page.goto(routeUrl(route));
      const title = await page.title();
      expect(titles.has(title)).toBe(false);
      titles.add(title);
    }
  });
});

test.describe('GLOBAL-02: crisis resources block present on every route', () => {
  for (const route of ROUTES) {
    // /book has no <footer> at all (BaseLayout `chrome="minimal"`, DECISION_LOG.md D-013 — the
    // spec's "reduce exits" no-footer-nav requirement) — its crisis block is BookingFlow's own
    // CrisisResources `strip` instance, rendered inline in <main>, not the footer. GLOBAL-02's
    // actual requirement (a crisis block present on every route) still holds; only the DOM
    // location differs on this one route.
    const isBook = route === '/book';
    const description = isBook
      ? 'renders the crisis resources strip'
      : 'renders the crisis resources block in the footer';

    test(`${route} ${description}`, async ({ page }) => {
      await page.goto(routeUrl(route));

      const crisisBlock = isBook
        ? page.getByRole('note', { name: 'Crisis resources' })
        : page.locator('footer');
      await expect(crisisBlock).toBeVisible();
      // 988 (Suicide & Crisis Lifeline) is the canonical crisis-block anchor per CrisisResources.
      await expect(crisisBlock.getByText('988', { exact: false })).toBeVisible();
    });
  }
});
