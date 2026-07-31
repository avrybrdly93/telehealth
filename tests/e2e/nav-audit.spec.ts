import { test, expect } from '@playwright/test';
import { ROUTES } from './routes';
import { routeUrl } from './routeUrl';

// Implements UX-003 ("Pricing reachable in <=2 interactions from any page", SERVICE_REQUIREMENTS.md)
// as a nav audit, per BL-013's acceptance criteria. Desktop: the header's Primary nav has a
// visible Pricing link (1 interaction). Mobile (<1024px, SiteHeader.module.css breakpoint): the
// toggle must be opened first, so it's menu-open + link click = 2 interactions — still within budget.
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
      await expect(page).toHaveURL(/\/pricing\/?(?:[?#]|$)/);
    });
  }
});
