import { test, expect } from '@playwright/test';
import { routeUrl } from './routeUrl';

// Implements TESTING_AND_VALIDATION_PLAN.md's BOOK-02/03/04/05 (USER_FLOWS.md Flow 1,
// SERVICE_REQUIREMENTS.md FR-020-024, ERROR_STATES.md E-011, BL-037's own acceptance criteria).
// These only become verifiable end-to-end now that Steps 1-3 all exist (BL-035/036/037) — no
// single step's Vitest/RTL coverage substitutes for a real cross-step browser navigation test.
// BOOK-01 (the vendor-handoff walkthrough, requiring Step 4/`buildBookingUrl`) is explicitly
// BL-021's acceptance criterion, not this file's.

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
    await expect(
      page.getByText(/only available to patients 18 years of age or older/),
    ).toHaveCount(0);
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
    await expect(
      page.getByText('Do I need to be in California for my appointment?'),
    ).toBeVisible();
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

test.describe('BOOK-03: browser back preserves selections across the full Step 1-3 chain', () => {
  test('back from Step 3 restores Step 2\'s provider selection; back again restores Step 1\'s service', async ({
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
