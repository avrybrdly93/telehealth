import { test, expect } from '@playwright/test';
import { ROUTES } from './routes';
import { routeUrl } from './routeUrl';
import { BASE_URL } from '../../playwright.config';

// Implements UX-003 ("Pricing reachable in <=2 interactions from any page", SERVICE_REQUIREMENTS.md)
// as a nav audit, per BL-013's acceptance criteria. Desktop: the header's Primary nav has a
// visible Pricing link (1 interaction). Mobile (<1024px, SiteHeader.module.css breakpoint): the
// toggle must be opened first, so it's menu-open + link click = 2 interactions — still within budget.

// The old assertion here was `toHaveURL(/\/pricing\/?(?:[?#]|$)/)` -- unanchored, so it matched
// a base-dropped URL (`http://.../pricing`, missing the `/telehealth` base) exactly as well as
// the correct one, and stayed green through BUG-005 (site-wide missing base on internal hrefs)
// without catching it. This regex is anchored to the full expected origin+base+path so a
// regression here fails the test again.
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
const EXPECTED_PRICING_URL = new RegExp(
  `^${escapeRegExp(new URL(routeUrl('/pricing'), BASE_URL).toString())}/?(?:[?#]|$)`,
);
test.describe('UX-003: pricing reachable in <=2 interactions from every page', () => {
  for (const route of ROUTES) {
    test(`${route} reaches /pricing in <=2 interactions`, async ({ page, viewport }) => {
      await page.goto(routeUrl(route));

      const isMobile = (viewport?.width ?? 0) < 1024;
      if (isMobile) {
        await page.getByRole('button', { name: /menu/i }).click();
      }

      const nav = isMobile
        ? page.getByRole('dialog', { name: 'Site menu' })
        : page.getByRole('navigation', { name: 'Primary' });
      const pricingLink = nav.getByRole('link', { name: 'Pricing' });
      await expect(pricingLink).toBeVisible();

      await pricingLink.click();
      await expect(page).toHaveURL(EXPECTED_PRICING_URL);
    });
  }
});
