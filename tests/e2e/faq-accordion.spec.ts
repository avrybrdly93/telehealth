import { test, expect, type Page } from '@playwright/test';
import { routeUrl } from './routeUrl';

// BL-040. `/faq` is Flow 4's destination (USER_FLOWS.md) and Step 3 of the booking flow links
// into it (`/faq#getting-started`, BOOK-04), yet nothing exercised the page itself in a browser.
// FAQAccordion.test.tsx renders the component under jsdom; jsdom does not implement `<details>`
// toggling, so the one behaviour the component exists for — open on click, stay open, indexable
// while closed — has never been asserted anywhere it actually works.
//
// COMPONENT_LIBRARY.md#FAQAccordion, PAGE_SPECIFICATIONS.md §/faq, SEO_STRATEGY.md (FAQPage).

const GROUP_IDS = [
  'getting-started',
  'appointments-policies',
  'costs-superbills',
  'medication-questions',
  'emergencies',
] as const;

async function goToFaq(page: Page) {
  await page.goto(routeUrl('/faq'));
  await expect(page.getByRole('heading', { name: 'Frequently asked questions' })).toBeVisible();
}

test.describe('FAQ accordion', () => {
  test('every answer ships closed but present in the DOM — no JS needed to index it', async ({
    page,
  }) => {
    await goToFaq(page);

    const items = page.locator('details');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i += 1) {
      await expect(items.nth(i)).not.toHaveAttribute('open', /.*/);
    }
    // The requirement is "indexable pre-JS": the answer text must exist in the served markup
    // even while collapsed, which `display:none` would satisfy for `<details>` but a
    // JS-injected accordion would not. Assert against the raw response, not the live DOM.
    const html = await page.content();
    const firstAnswer = await items.first().locator('p').textContent();
    expect(firstAnswer?.trim().length).toBeGreaterThan(0);
    expect(html).toContain(firstAnswer!.trim().slice(0, 40));
  });

  test('clicking a question opens it, clicking again closes it, and a second stays open alongside the first', async ({
    page,
  }) => {
    await goToFaq(page);

    const first = page.locator('details').first();
    const second = page.locator('details').nth(1);
    const firstAnswer = first.locator('p');

    await expect(firstAnswer).toBeHidden();
    await first.locator('summary').click();
    await expect(first).toHaveAttribute('open', /.*/);
    await expect(firstAnswer).toBeVisible();

    // COMPONENT_LIBRARY.md is explicit that this is not an exclusive accordion.
    await second.locator('summary').click();
    await expect(second).toHaveAttribute('open', /.*/);
    await expect(first).toHaveAttribute('open', /.*/);

    await first.locator('summary').click();
    await expect(firstAnswer).toBeHidden();
    await expect(second).toHaveAttribute('open', /.*/);
  });

  test('a question opens from the keyboard alone', async ({ page }) => {
    await goToFaq(page);

    const first = page.locator('details').first();
    await first.locator('summary').focus();
    await page.keyboard.press('Enter');

    await expect(first).toHaveAttribute('open', /.*/);
    await expect(first.locator('p')).toBeVisible();
  });
});

test.describe('FAQ topic anchors', () => {
  test('every group heading carries the id the topics nav links to', async ({ page }) => {
    await goToFaq(page);

    const nav = page.getByRole('navigation', { name: 'FAQ topics' });
    const hrefs = await nav
      .getByRole('link')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(hrefs).toEqual(GROUP_IDS.map((id) => `#${id}`));

    for (const id of GROUP_IDS) {
      await expect(page.locator(`h2#${id}`)).toBeVisible();
    }
  });

  test('#emergencies is reachable by direct link and lands on the canonical crisis block (Flow 4)', async ({
    page,
  }) => {
    // Flow 4 is "person in crisis arrives from anywhere"; the anchor has to work as a cold URL,
    // not just as an in-page click.
    await page.goto(`${routeUrl('/faq')}#emergencies`);

    const heading = page.locator('h2#emergencies');
    await expect(heading).toBeVisible();
    await expect(heading).toBeInViewport();

    // COPY_GUIDELINES.md Hard Rule 6: this group embeds the canonical component rather than
    // paraphrasing 988/911 into an answer string.
    const group = page.locator('section', { has: heading });
    const crisis = group.getByRole('note', { name: 'Crisis resources' });
    await expect(crisis).toBeVisible();
    await expect(crisis.getByRole('link', { name: 'call' })).toHaveAttribute('href', 'tel:988');
    await expect(crisis.getByRole('link', { name: '911' })).toHaveAttribute('href', 'tel:911');
  });

  test('clicking a topic link scrolls its group into view', async ({ page }) => {
    await goToFaq(page);

    await page
      .getByRole('navigation', { name: 'FAQ topics' })
      .getByRole('link', { name: 'Costs & superbills' })
      .click();

    await expect(page).toHaveURL(/#costs-superbills$/);
    await expect(page.locator('h2#costs-superbills')).toBeInViewport();
  });
});

test.describe('FAQPage structured data (FR-051)', () => {
  test('the JSON-LD lists exactly the questions the page renders, in order', async ({ page }) => {
    await goToFaq(page);

    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const faqSchema = blocks
      .map((block) => JSON.parse(block))
      .find((parsed) => parsed['@type'] === 'FAQPage');
    expect(faqSchema, 'a FAQPage block must be present on /faq').toBeTruthy();

    const schemaQuestions = faqSchema.mainEntity.map((entry: { name: string }) => entry.name);
    const renderedQuestions = await page.locator('details summary').allInnerTexts();

    expect(schemaQuestions).toEqual(renderedQuestions.map((text) => text.trim()));
    for (const entry of faqSchema.mainEntity) {
      expect(entry['@type']).toBe('Question');
      expect(entry.acceptedAnswer['@type']).toBe('Answer');
      // `stripMarkdownSyntax` runs over these — a leaked `**` or `[]()` means it regressed.
      expect(entry.acceptedAnswer.text.trim().length).toBeGreaterThan(0);
      expect(entry.acceptedAnswer.text).not.toMatch(/\*\*|\]\(/);
    }
  });
});
