import { test, expect } from '@playwright/test';
import { ROUTES } from './routes';
import { routeUrl } from './routeUrl';

// Implements BL-033 / SECURITY_AND_COMPLIANCE_PLAN.md §Website Security Controls, D-012.
//
// This only verifies the meta-tag-delivered subset of the documented header set
// (Content-Security-Policy, Referrer-Policy) — the only mechanism available on the current
// GitHub Pages deployment, which has no HTTP-header configuration surface at all. It
// deliberately does NOT assert X-Content-Type-Options, X-Frame-Options, Permissions-Policy, or
// Strict-Transport-Security: those have no meta-tag equivalent and are not implemented anywhere
// in this build (see BaseLayout.astro's comment and D-012 for the full gap and proposed options).
for (const route of ROUTES) {
  test(`${route} sends a same-origin CSP meta tag with no external allowances`, async ({
    page,
  }) => {
    await page.goto(routeUrl(route));

    const csp = await page
      .locator('head meta[http-equiv="Content-Security-Policy"]')
      .getAttribute('content');

    expect(csp).toBeTruthy();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    // No bare external scheme/host allowances anywhere in the policy (only 'self'/'none'/
    // 'unsafe-inline'/data: keyword sources) — a regression here would mean a third-party
    // domain snuck into the allowlist without a DATA_BOUNDARIES/PRIVACY_MODEL review.
    expect(csp).not.toMatch(/https?:\/\//);
  });

  test(`${route} sends a strict-origin-when-cross-origin referrer meta tag`, async ({ page }) => {
    await page.goto(routeUrl(route));

    const referrer = await page.locator('head meta[name="referrer"]').getAttribute('content');
    expect(referrer).toBe('strict-origin-when-cross-origin');
  });
}
