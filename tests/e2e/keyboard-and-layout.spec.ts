import { test, expect } from '@playwright/test';
import { ROUTES } from './routes';
import { routeUrl } from './routeUrl';

// BL-040. Two things ACCESSIBILITY.md and RESPONSIVE_DESIGN require that no test has ever
// checked in a browser:
//   1. The skip link. SkipLink.test.tsx asserts it renders with an href; the behaviour that
//      matters — first in tab order, off-screen until focused, on-screen when focused, and
//      actually moving focus into <main> when activated — is CSS + browser focus handling, and
//      jsdom has neither.
//   2. Horizontal overflow at 375px. axe does not flag it, Lighthouse does not fail on it, and
//      it is the single most common mobile layout regression: one over-wide element and the
//      whole page scrolls sideways.

test.describe('skip link (ACCESSIBILITY.md §Operable)', () => {
  test('is the first thing a keyboard reaches, hidden until then, and lands focus in <main>', async ({
    page,
  }) => {
    await page.goto(routeUrl('/'));

    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toHaveAttribute('href', '#main-content');

    // Off-screen before focus: translated out of the viewport, not `display:none` (which would
    // take it out of the tab order entirely and defeat the point).
    const restingBox = await skipLink.boundingBox();
    expect(restingBox, 'the skip link must keep layout while hidden').not.toBeNull();
    expect(restingBox!.y + restingBox!.height).toBeLessThanOrEqual(0);

    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();

    // `.skipLink` slides in on a `transform` transition, so a `boundingBox()` read immediately
    // after Tab catches it mid-slide (-59px, then -47px, then -36px across three runs). A plain
    // `toBeInViewport()` does not settle it either — that passes at any non-zero overlap, and a
    // half-arrived link overlaps. Poll the coordinate itself, then require it fully inside.
    await expect
      .poll(async () => (await skipLink.boundingBox())?.y ?? -1)
      .toBeGreaterThanOrEqual(0);
    await expect(skipLink).toBeInViewport({ ratio: 1 });

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main-content$/);
    // The target must exist and be the real content container, or the jump goes nowhere.
    await expect(page.locator('#main-content')).toHaveCount(1);
    await expect(page.locator('main#main-content')).toBeVisible();
  });

  for (const route of ['/', '/pricing', '/book', '/contact']) {
    test(`${route} puts the skip link first in the tab order`, async ({ page }) => {
      await page.goto(routeUrl(route));
      await page.keyboard.press('Tab');
      await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
    });
  }
});

test.describe('no horizontal overflow', () => {
  for (const route of ROUTES) {
    test(`${route} fits its viewport width`, async ({ page }, testInfo) => {
      await page.goto(routeUrl(route));

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      // 1px of slack for sub-pixel rounding at fractional device scales; anything wider is a real
      // element sticking out, and on a 375px viewport that is a side-scrolling page.
      expect(
        scrollWidth,
        `${route} overflows horizontally at ${testInfo.project.name}: content ${scrollWidth}px in a ${clientWidth}px viewport`,
      ).toBeLessThanOrEqual(clientWidth + 1);
    });
  }
});

test.describe('interactive targets are reachable on a phone', () => {
  test('the header CTA and mobile menu toggle clear the 44px touch-target floor at 375px', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-375', 'a touch-target requirement');
    await page.goto(routeUrl('/'));

    const toggle = page.getByRole('button', { name: /menu/i });
    const toggleBox = await toggle.boundingBox();
    expect(toggleBox).not.toBeNull();
    expect(toggleBox!.height).toBeGreaterThanOrEqual(44);
    expect(toggleBox!.width).toBeGreaterThanOrEqual(44);

    await toggle.click();
    const dialog = page.getByRole('dialog', { name: 'Site menu' });
    for (const name of ['Services', 'Providers', 'Pricing', 'About', 'FAQ']) {
      const box = await dialog.getByRole('link', { name, exact: true }).boundingBox();
      expect(box, `${name} has no box in the open menu`).not.toBeNull();
      expect(box!.height, `${name} is under the 44px touch-target floor`).toBeGreaterThanOrEqual(
        44,
      );
    }
  });
});
