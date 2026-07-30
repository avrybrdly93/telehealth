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

test.describe('GLOBAL-02: footer crisis block on every route', () => {
  for (const route of ROUTES) {
    test(`${route} renders the crisis resources block in the footer`, async ({ page }) => {
      await page.goto(routeUrl(route));

      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
      // 988 (Suicide & Crisis Lifeline) is the canonical crisis-block anchor per CrisisResources.
      await expect(footer.getByText('988', { exact: false })).toBeVisible();
    });
  }
});
