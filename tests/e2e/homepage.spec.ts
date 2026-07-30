import { test, expect } from '@playwright/test';
import { routeUrl } from './routeUrl';

// Implements FR-010 (SERVICE_REQUIREMENTS.md) / TESTING_AND_VALIDATION_PLAN.md's "fold test":
// on a 375px viewport, without scrolling, the value proposition (h1), a "California" mention,
// and the primary Book CTA must all be visible. This is a 375px-specific requirement, so it
// only runs meaningfully under playwright.config.ts's `mobile-375` project.
test.describe('FR-010: homepage fold', () => {
  test('value proposition, "California", and the Book CTA are visible without scrolling at 375px', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-375', 'FR-010 is a 375px-viewport requirement');

    await page.goto(routeUrl('/'));

    const viewportSize = page.viewportSize();
    expect(viewportSize).not.toBeNull();
    const viewportHeight = viewportSize!.height;

    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('California');

    const hero = page.locator('section[aria-label="Introduction"]');
    const bookCta = hero.getByRole('link', { name: 'Book an appointment' });
    await expect(bookCta).toBeVisible();

    for (const locator of [heading, bookCta]) {
      const box = await locator.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.y + box!.height).toBeLessThanOrEqual(viewportHeight);
    }
  });
});
