import { test, expect } from '@playwright/test';
import { routeUrl } from './routeUrl';
import { BASE_URL } from '../../playwright.config';

// Implements BUG-006's acceptance criteria: PROVIDER_PHOTO_PLACEHOLDER's <img src> must resolve
// through withBase() like every href already does (BUG-005 precedent), not a hardcoded
// root-relative string that 404s once the base is dropped in production. Verifies the built
// <img src> is the full base+path URL on every page that renders the placeholder.
const PAGES_WITH_PLACEHOLDER = ['/', '/about', '/providers', '/providers/dr-md'];
// The rendered <img src> attribute is the raw root-relative string withBase() produced
// ("/telehealth/images/..."), not a resolved absolute URL -- derive the expected base path
// from BASE_URL's pathname rather than hardcoding "/telehealth" a second time.
const BASE_PATH = new URL(BASE_URL).pathname.replace(/\/$/, '');
const EXPECTED_SRC = `${BASE_PATH}/images/provider-photo-placeholder.svg`;

test.describe('BUG-006: provider-photo placeholder src includes the deployment base', () => {
  for (const route of PAGES_WITH_PLACEHOLDER) {
    test(`${route}: placeholder <img src> resolves under the base path`, async ({ page }) => {
      await page.goto(routeUrl(route));
      const photo = page.locator('img[src*="provider-photo-placeholder.svg"]').first();
      await expect(photo).toHaveAttribute('src', EXPECTED_SRC);
    });
  }
});
