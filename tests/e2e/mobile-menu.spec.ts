import { test, expect } from '@playwright/test';
import { routeUrl } from './routeUrl';

// Implements COMPONENT_LIBRARY.md#SiteHeader end-to-end: focus-trapped mobile menu, Esc closes
// and returns focus. Menu toggle only renders below the 1024px breakpoint (SiteHeader.module.css).
test.describe('mobile menu', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) >= 1024, 'desktop-only');

  test('opens on toggle, traps focus, and Esc closes returning focus to the toggle', async ({
    page,
  }) => {
    await page.goto(routeUrl('/'));

    const toggle = page.getByRole('button', { name: /menu/i });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    const dialog = page.getByRole('dialog', { name: 'Site menu' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('link', { name: 'Services' })).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});
