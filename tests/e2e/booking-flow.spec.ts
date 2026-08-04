import { test, expect } from '@playwright/test';
import { routeUrl } from './routeUrl';

// Implements TESTING_AND_VALIDATION_PLAN.md's BOOK-01/02/03/04/05 (USER_FLOWS.md Flow 1,
// SERVICE_REQUIREMENTS.md FR-020-024, ERROR_STATES.md E-011, BL-037/021's own acceptance
// criteria). These only become verifiable end-to-end now that all four steps exist
// (BL-035/036/037/021) — no single step's Vitest/RTL coverage substitutes for a real cross-step
// browser navigation test. BOOK-01 (the vendor-handoff walkthrough) mocks the vendor request
// rather than letting Playwright attempt a real navigation — see that test's own comment.

async function goToBook(page: import('@playwright/test').Page) {
  await page.goto(routeUrl('/book'));
}

// `Card` `selectable`'s radio is intentionally visually-hidden (Card.module.css `.radio`:
// `clip: rect(0 0 0 0)`, a real user activates it by clicking anywhere in the visible `<label>`,
// which native browser label-forwarding always honors regardless of the hidden input's own
// on-screen position) — so these helpers click the visible label text, exactly what a real user
// does, rather than `.check()`ing the hidden input directly (which fails Playwright's own
// actionability check: the 1px clipped target ends up geometrically behind other label content).
async function completeStep1(page: import('@playwright/test').Page) {
  await page.getByText('First appointment (new patient)', { exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
}

/** Advances through Step 2 via "No preference" (BOOK-02's path) and lands on Step 3. */
async function completeStep2ViaNoPreference(page: import('@playwright/test').Page) {
  await page.getByText('No preference — earliest available', { exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
}

/** Advances through Step 2 by choosing a real provider (BOOK-01's path) and lands on Step 3. */
async function completeStep2ViaProvider(page: import('@playwright/test').Page) {
  await page.getByText('NEEDS_HUMAN_PROVIDER_MD_NAME', { exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
}

async function completeStep3(page: import('@playwright/test').Page) {
  await page
    .getByRole('checkbox', { name: /located in California at the time of my appointment/ })
    .check();
  await page.getByRole('checkbox', { name: /18 years of age or older/ }).check();
  await page
    .getByRole('checkbox', { name: /not currently experiencing a mental health emergency/ })
    .check();
  await page.getByRole('button', { name: 'Continue' }).click();
}

test.describe('BOOK-05: crisis strip + phone alternative visible on every booking step', () => {
  test('present on Step 1, Step 2, and Step 3', async ({ page }) => {
    await goToBook(page);
    await expect(page.getByRole('note', { name: 'Crisis resources' })).toBeVisible();
    await expect(page.getByText('Prefer to book by phone?')).toBeVisible();

    await completeStep1(page);
    await expect(page.getByRole('note', { name: 'Crisis resources' })).toBeVisible();
    await expect(page.getByText('Prefer to book by phone?')).toBeVisible();

    await completeStep2ViaNoPreference(page);
    await expect(page.getByRole('note', { name: 'Crisis resources' })).toBeVisible();
    await expect(page.getByText('Prefer to book by phone?')).toBeVisible();
  });
});

test.describe('BOOK-04 (E-011): unchecked acknowledgments keep Continue disabled with guidance visible', () => {
  test('Continue stays disabled and each unmet checkbox explains itself inline, never a modal', async ({
    page,
  }) => {
    await goToBook(page);
    await completeStep1(page);
    await completeStep2ViaNoPreference(page);

    const continueButton = page.getByRole('button', { name: 'Continue' });
    await expect(continueButton).toBeDisabled();
    await expect(
      page.getByText(/only for patients located in California at the time of their/),
    ).toBeVisible();
    await expect(
      page.getByText(/only available to patients 18 years of age or older/),
    ).toBeVisible();
    await expect(page.getByText(/for non-emergency care only/)).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(0);

    // Checking one box clears only its own guidance; Continue stays disabled until all three.
    await page.getByRole('checkbox', { name: /18 years of age or older/ }).check();
    await expect(page.getByText(/only available to patients 18 years of age or older/)).toHaveCount(
      0,
    );
    await expect(continueButton).toBeDisabled();
  });

  test('the "not in CA" guidance links the real FAQ answer about California-only care', async ({
    page,
  }) => {
    await goToBook(page);
    await completeStep1(page);
    await completeStep2ViaNoPreference(page);

    const faqLink = page.getByRole('link', { name: 'our answer about California-only care' });
    await faqLink.click();

    await expect(page).toHaveURL(/\/telehealth\/faq\/?#getting-started$/);
    await expect(page.getByRole('heading', { name: 'Getting started' })).toBeVisible();
    await expect(page.getByText('Do I need to be in California for my appointment?')).toBeVisible();
  });
});

test.describe('BOOK-02: complete Steps 1-3 via "No preference", arriving at Step 4\'s entry point', () => {
  test('Continue becomes enabled once all three acknowledgments are checked', async ({ page }) => {
    await goToBook(page);
    await completeStep1(page);
    await completeStep2ViaNoPreference(page);

    await page
      .getByRole('checkbox', { name: /located in California at the time of my appointment/ })
      .check();
    await page.getByRole('checkbox', { name: /18 years of age or older/ }).check();
    await page
      .getByRole('checkbox', { name: /not currently experiencing a mental health emergency/ })
      .check();

    await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled();
    await expect(page.getByText('Step 3 of 4: Acknowledgments')).toBeVisible();
  });
});

test.describe('BOOK-01: vendor handoff — Step 4 reaches a mock vendor URL with service+provider params', () => {
  test('Step 4 summarizes the selection and "Continue to secure scheduling" navigates to a URL carrying service+provider, with no other request leaking the selection (DATA_BOUNDARIES §Enforcement)', async ({
    page,
  }) => {
    const requestUrls: string[] = [];
    page.on('request', (request) => requestUrls.push(request.url()));

    // PLACEHOLDER_VENDOR_BOOKING_URL (practice.ts) is on the IANA/RFC 2606 `.example` TLD,
    // guaranteed never to resolve on a real network — this repo has no real vendor to book
    // against (PROJECT_STATUS.md "Blocked / Needs Human Input"), so BL-021's "mock-vendor e2e"
    // intercepts and fulfills the request instead of letting Playwright attempt a real
    // navigation.
    await page.route('https://scheduling.needs-human-vendor.example/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html><body>Mock vendor</body></html>',
      }),
    );

    await goToBook(page);
    await completeStep1(page);
    await completeStep2ViaProvider(page);
    await completeStep3(page);

    await expect(page.getByText('Step 4 of 4: Handoff')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Confirm your selections' })).toBeVisible();
    await expect(page.getByText('First appointment (new patient)')).toBeVisible();
    await expect(page.getByText('NEEDS_HUMAN_PROVIDER_MD_NAME')).toBeVisible();
    // BOOK-05 extends to Step 4 too.
    await expect(page.getByRole('note', { name: 'Crisis resources' })).toBeVisible();

    const handoffLink = page.getByRole('link', { name: 'Continue to secure scheduling' });
    const href = await handoffLink.getAttribute('href');
    const handoffUrl = new URL(href!);
    expect(handoffUrl.hostname).toBe('scheduling.needs-human-vendor.example');
    expect(handoffUrl.searchParams.get('service')).toBe('intake');
    expect(handoffUrl.searchParams.get('provider')).toBe('dr-md');

    await handoffLink.click();
    await page.waitForURL(/scheduling\.needs-human-vendor\.example/);

    // The one sanctioned exception (DATA_BOUNDARIES.md Boundary 2/§Enforcement) is this final
    // vendor navigation; every other request made across the whole Step 1-4 flow must not carry
    // the user's selection.
    const leaks = requestUrls.filter(
      (url) =>
        !url.includes('needs-human-vendor.example') &&
        (url.includes('service=intake') || url.includes('provider=dr-md')),
    );
    expect(leaks).toEqual([]);
  });
});

test.describe('BOOK-03: browser back preserves selections across the full Step 1-3 chain', () => {
  test("back from Step 3 restores Step 2's provider selection; back again restores Step 1's service", async ({
    page,
  }) => {
    await goToBook(page);
    await completeStep1(page);
    await completeStep2ViaNoPreference(page);
    await expect(page.getByText('Step 3 of 4: Acknowledgments')).toBeVisible();

    await page.goBack();
    await expect(page.getByText('Step 2 of 4: Provider')).toBeVisible();
    await expect(page.getByRole('radio', { name: /No preference/ })).toBeChecked();

    await page.goBack();
    await expect(page.getByText('Step 1 of 4: Service')).toBeVisible();
    await expect(page.getByRole('radio', { name: /First appointment/ })).toBeChecked();
  });
});
