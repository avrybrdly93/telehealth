import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { ROUTES } from './routes';
import { routeUrl } from './routeUrl';

// Implements QUALITY_STANDARD.md's blocking a11y gate and TESTING_AND_VALIDATION_PLAN.md's
// axe-core layer: zero critical/serious violations, both viewports (see playwright.config.ts).
for (const route of ROUTES) {
  test(`${route} has no critical/serious axe violations`, async ({ page }) => {
    await page.goto(routeUrl(route));

    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter(
      (violation) => violation.impact === 'critical' || violation.impact === 'serious',
    );

    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });
}
