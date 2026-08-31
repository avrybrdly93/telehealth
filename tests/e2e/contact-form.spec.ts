import { test, expect, type Page, type Route } from '@playwright/test';
import { routeUrl } from './routeUrl';

// BL-040. `ContactForm.client.ts` is unit-tested under jsdom (ContactForm.client.test.ts) but was
// never driven in a real browser: jsdom does not run the `<script type="module">` Astro emits, so
// nothing until now proved the island is *wired up* on the shipped page — only that the module
// behaves when a test calls `initContactForm` by hand. Everything below goes through the rendered
// /contact page, so a broken import, a missing directive or a changed selector fails it.
//
// CONTACT-01/02 (TESTING_AND_VALIDATION_PLAN.md), FR-030/031, ERROR_STATES.md E-010/E-030.

const CONTACT_ENDPOINT = '**/api/contact';

async function goToContact(page: Page) {
  await page.goto(routeUrl('/contact'));
  // The form's behaviour arrives with its module script; without this the first `click()` can
  // land before the submit listener is attached and the browser performs a native submit.
  await expect(page.locator('form[data-contact-form]')).toBeVisible();
  await page.waitForFunction(() => document.readyState === 'complete');
}

// Sequential on purpose. Concurrent `fill()`s on one page race for focus and all three strings
// land in whichever field won — caught while writing this file: the message box came out reading
// "Test Persontest.person@example.comA question about scheduling." and the form failed validation
// instead of submitting.
async function fillValidly(page: Page) {
  await page.getByLabel('Name *').fill('Test Person');
  await page.getByLabel('Email *').fill('test.person@example.com');
  await page.getByLabel('Message *').fill('A question about scheduling.');
}

const submit = (page: Page) => page.getByRole('button', { name: /Send message|Sending/ }).click();

test.describe('CONTACT-01: client-side validation (E-010)', () => {
  test('an empty submit blocks the request, flags all three required fields inline, and focuses the first', async ({
    page,
  }) => {
    await goToContact(page);

    let requestCount = 0;
    await page.route(CONTACT_ENDPOINT, (route: Route) => {
      requestCount += 1;
      return route.fulfill({ status: 200, body: '{}' });
    });

    await submit(page);

    for (const label of ['Name *', 'Email *', 'Message *']) {
      await expect(page.getByLabel(label)).toHaveAttribute('aria-invalid', 'true');
    }
    await expect(page.getByText('Please enter your name.')).toBeVisible();
    await expect(page.getByText('Please enter your email address.')).toBeVisible();
    await expect(page.getByText('Please enter a message.')).toBeVisible();
    // E-010: errors are inline text next to the field, never a modal or an alert() — and the
    // first offending field takes focus so a keyboard user lands on the thing to fix.
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByLabel('Name *')).toBeFocused();
    expect(requestCount).toBe(0);
  });

  test('a malformed email is rejected on shape, and fixing a field clears only its own error', async ({
    page,
  }) => {
    await goToContact(page);

    await page.getByLabel('Name *').fill('Test Person');
    await page.getByLabel('Email *').fill('not-an-email');
    await submit(page);

    await expect(page.getByText("That email doesn't look complete.")).toBeVisible();
    await expect(page.getByText('Please enter a message.')).toBeVisible();
    await expect(page.getByText('Please enter your name.')).toHaveCount(0);

    await page.getByLabel('Email *').fill('test.person@example.com');
    await page.getByLabel('Message *').fill('A question about scheduling.');
    await page.route(CONTACT_ENDPOINT, (route: Route) =>
      route.fulfill({ status: 200, body: '{}' }),
    );
    await submit(page);

    await expect(page.getByText("That email doesn't look complete.")).toHaveCount(0);
    await expect(page.getByLabel('Email *')).not.toHaveAttribute('aria-invalid', 'true');
  });
});

test.describe('CONTACT-02: submit outcomes', () => {
  test('a successful POST shows the success alert, clears the fields, and moves focus to it', async ({
    page,
  }) => {
    await goToContact(page);

    const posted: string[] = [];
    await page.route(CONTACT_ENDPOINT, (route: Route) => {
      posted.push(route.request().postData() ?? '');
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });

    await fillValidly(page);
    await submit(page);

    const success = page.getByRole('status').filter({ hasText: 'Thanks for reaching out.' });
    await expect(success).toBeVisible();
    await expect(success).toBeFocused();
    await expect(page.getByLabel('Name *')).toHaveValue('');
    await expect(page.getByLabel('Message *')).toHaveValue('');

    expect(posted).toHaveLength(1);
    expect(JSON.parse(posted[0])).toEqual({
      name: 'Test Person',
      email: 'test.person@example.com',
      phone: '',
      message: 'A question about scheduling.',
    });
  });

  test('E-030: a failed POST keeps what the visitor typed and offers the email fallback', async ({
    page,
  }) => {
    await goToContact(page);
    await page.route(CONTACT_ENDPOINT, (route: Route) => route.fulfill({ status: 500, body: '' }));

    await fillValidly(page);
    await submit(page);

    const failure = page.getByRole('alert').filter({ hasText: "Your message didn't send." });
    await expect(failure).toBeVisible();
    await expect(failure).toBeFocused();
    await expect(failure.getByRole('link')).toHaveAttribute('href', /^mailto:/);
    // The whole point of E-030: never make them retype it.
    await expect(page.getByLabel('Message *')).toHaveValue('A question about scheduling.');
    await expect(page.getByLabel('Email *')).toHaveValue('test.person@example.com');
  });

  test('the submit button reports itself busy while the request is in flight, then recovers', async ({
    page,
  }) => {
    await goToContact(page);

    let release: () => void = () => {};
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route(CONTACT_ENDPOINT, async (route: Route) => {
      await held;
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });

    await fillValidly(page);
    await submit(page);

    const button = page.getByRole('button', { name: /Send message|Sending/ });
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(button).toBeDisabled();

    release();

    await expect(button).toHaveAttribute('aria-busy', 'false');
    await expect(button).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Send message' })).toBeVisible();
  });

  test('with no /api/contact deployed (the live GitHub Pages state, D-009), the page lands on the honest failure state rather than a false success', async ({
    page,
  }) => {
    // No `page.route` here on purpose: this is what a real visitor gets today. The static host
    // has no serverless runtime, so the POST 404s and E-030 is the correct, documented outcome.
    await goToContact(page);
    await fillValidly(page);
    await submit(page);

    await expect(
      page.getByRole('alert').filter({ hasText: "Your message didn't send." }),
    ).toBeVisible();
    await expect(
      page.getByRole('status').filter({ hasText: 'Thanks for reaching out.' }),
    ).toBeHidden();
  });
});

test.describe('BL-022: honeypot', () => {
  test('a filled decoy field is silently dropped — fake success, and nothing reaches the network', async ({
    page,
  }) => {
    await goToContact(page);

    let requestCount = 0;
    await page.route(CONTACT_ENDPOINT, (route: Route) => {
      requestCount += 1;
      return route.fulfill({ status: 200, body: '{}' });
    });

    await fillValidly(page);
    // A real visitor cannot reach this field (aria-hidden, off-screen, tabindex -1); a bot that
    // fills every input it finds can, which is the whole trap. `fill()` would fail its own
    // actionability check on a field positioned off-screen, so set the value the way a script
    // scraping the DOM would.
    await page.locator('#contact-hp-field').evaluate((el) => {
      (el as HTMLInputElement).value = 'https://spam.example';
    });
    await submit(page);

    await expect(
      page.getByRole('status').filter({ hasText: 'Thanks for reaching out.' }),
    ).toBeVisible();
    expect(requestCount).toBe(0);
  });

  test('the decoy is hidden from assistive tech and unreachable by keyboard', async ({ page }) => {
    await goToContact(page);

    const honeypot = page.locator('#contact-hp-field');
    await expect(honeypot).toHaveAttribute('tabindex', '-1');
    await expect(honeypot).toHaveAttribute('autocomplete', 'off');
    await expect(page.locator('[aria-hidden="true"]', { has: honeypot })).toHaveCount(1);
    // Not display:none (bots skip fields with no box) — it must still have layout, just off-screen.
    const box = await honeypot.boundingBox();
    expect(box).not.toBeNull();
  });
});

test.describe('FR-030/031: the page tells the truth about what this form is for', () => {
  test('phone and email are reachable directly, and medical questions are routed to booking', async ({
    page,
  }) => {
    await goToContact(page);

    // Scoped to <main>: the header and footer carry their own phone/email links and their own
    // crisis block, and the header's phone is hidden at 375px. FR-030's requirement is that the
    // *page* offers them above the form, not that the chrome does.
    const main = page.getByRole('main');
    await expect(main.locator('a[href^="tel:"]').first()).toBeVisible();
    await expect(main.locator('a[href^="mailto:"]').first()).toBeVisible();
    await expect(page.getByText('We typically respond within 1 business day.')).toBeVisible();
    // Exact: the header's "Book an appointment" CTA is a separate link with the same words.
    await expect(
      main.getByRole('link', { name: 'book an appointment', exact: true }),
    ).toBeVisible();
    // FR-030: the message field must warn against medical detail, at the field, not in a footnote.
    await expect(page.getByText("Please don't include medical details.")).toBeVisible();
    await expect(main.getByRole('note', { name: 'Crisis resources' })).toBeVisible();
  });
});
