import { test, expect } from '@playwright/test';
import { ROUTES } from './routes';
import { routeUrl } from './routeUrl';
import { BASE_URL } from '../../playwright.config';

// BL-040. BUG-005 was a site-wide broken-link bug — every internal href dropped the `/telehealth`
// base and 404'd in production — and the suite of the day stayed green through it because the one
// test that clicked a link asserted an unanchored URL regex. nav-audit.spec.ts fixed that for the
// single Pricing link it walks. Nothing checks the other ~200.
//
// This sweeps every anchor on every route and asks the server whether it actually resolves, which
// is the only form of the question a selector can't quietly agree with.

const BASE_PATH = new URL(BASE_URL).pathname; // "/telehealth/"
const ORIGIN = new URL(BASE_URL).origin;

interface FoundLink {
  readonly href: string;
  readonly route: string;
  readonly text: string;
}

/** Anchors on `route`, with their raw href attributes as authored. */
async function collectLinks(
  page: import('@playwright/test').Page,
  route: string,
): Promise<FoundLink[]> {
  await page.goto(routeUrl(route));
  const raw = await page.locator('a[href]').evaluateAll((anchors) =>
    anchors.map((anchor) => ({
      href: anchor.getAttribute('href') ?? '',
      text: (anchor.textContent ?? '').trim().slice(0, 60),
    })),
  );
  return raw.map((link) => ({ ...link, route }));
}

test.describe('link integrity', () => {
  // One browser session walks all 21 routes, so this is a handful of seconds, not 21 tests.
  test('every internal link on every route resolves, and carries the deployment base', async ({
    page,
    request,
  }) => {
    test.slow();

    const links: FoundLink[] = [];
    for (const route of ROUTES) {
      links.push(...(await collectLinks(page, route)));
    }
    expect(
      links.length,
      'the crawl found no links at all — the walk itself is broken',
    ).toBeGreaterThan(50);

    const internal = links.filter(
      (link) =>
        link.href.startsWith('/') ||
        (link.href.startsWith(ORIGIN) && !link.href.startsWith(`${ORIGIN}/api/`)),
    );

    // BUG-005's exact signature: a root-relative href that skips the base. Every one of these
    // 404s the moment the site is served from a project-site subpath.
    const baseless = internal.filter(
      (link) => link.href.startsWith('/') && !link.href.startsWith(BASE_PATH),
    );
    expect(
      baseless,
      `internal hrefs missing the "${BASE_PATH}" deployment base:\n${JSON.stringify(baseless, null, 2)}`,
    ).toEqual([]);

    // Ask the server, once per distinct target.
    const targets = [...new Set(internal.map((link) => new URL(link.href, BASE_URL).toString()))];
    const broken: { url: string; status: number }[] = [];
    for (const target of targets) {
      const response = await request.get(target);
      if (response.status() >= 400) broken.push({ url: target, status: response.status() });
    }
    expect(
      broken,
      `internal links that do not resolve:\n${JSON.stringify(broken, null, 2)}`,
    ).toEqual([]);
  });

  test('the only off-origin destinations are the allowlisted citation hosts, over https, in the same tab', async ({
    page,
  }) => {
    // DATA_BOUNDARIES.md and the CSP (`default-src 'self'`, no external allowances) both say this
    // site loads nothing third-party; outbound *links* are a separate question and there is one
    // sanctioned class of them — CONTENT_STRATEGY.md's Condition Page Standard requires each
    // condition page to cite one NIMH statistic, so `nimh.nih.gov` is deliberate. Anything else
    // appearing here should fail a test before it reaches a privacy review. The booking vendor
    // is not an exception to add: it is reached from Step 4 of the /book island, never from a
    // route's served markup, and booking-flow.spec.ts owns it.
    const ALLOWED_HOSTS = ['www.nimh.nih.gov'];

    const offOrigin: FoundLink[] = [];
    for (const route of ROUTES) {
      const links = await collectLinks(page, route);
      offOrigin.push(
        ...links.filter((link) => /^https?:\/\//i.test(link.href) && !link.href.startsWith(ORIGIN)),
      );
    }

    const unexpected = offOrigin.filter(
      (link) => !ALLOWED_HOSTS.includes(new URL(link.href).hostname),
    );
    expect(
      unexpected,
      `unallowlisted off-origin links (each needs a DATA_BOUNDARIES review):\n${JSON.stringify(unexpected, null, 2)}`,
    ).toEqual([]);

    const insecure = offOrigin.filter((link) => new URL(link.href).protocol !== 'https:');
    expect(
      insecure,
      `off-origin links over plain http:\n${JSON.stringify(insecure, null, 2)}`,
    ).toEqual([]);

    // Same-tab is the current, safe shape (no `target="_blank"`, so no reverse-tabnabbing surface
    // at all). If one ever gains a new tab, it must bring `rel="noopener"` with it.
    const unsafeNewTab = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]')]
        .filter((anchor) => !anchor.rel.split(/\s+/).includes('noopener'))
        .map((anchor) => anchor.href),
    );
    expect(unsafeNewTab).toEqual([]);
  });

  test('every in-page #anchor points at an element that exists on that page', async ({ page }) => {
    // A dead fragment is silent: the browser just does nothing. /faq's topic nav and the crisis
    // deep-links (Flow 4) are navigation, so a typo here is a broken flow, not a cosmetic bug.
    const dangling: { route: string; hash: string }[] = [];

    for (const route of ROUTES) {
      await page.goto(routeUrl(route));
      const hashes = await page
        .locator('a[href^="#"]')
        .evaluateAll((anchors) =>
          anchors
            .map((anchor) => anchor.getAttribute('href') ?? '')
            .filter((href) => href.length > 1),
        );

      for (const hash of [...new Set(hashes)]) {
        const id = decodeURIComponent(hash.slice(1));
        const exists = await page.evaluate(
          (target) => document.getElementById(target) !== null,
          id,
        );
        if (!exists) dangling.push({ route, hash });
      }
    }

    expect(
      dangling,
      `in-page anchors with no target:\n${JSON.stringify(dangling, null, 2)}`,
    ).toEqual([]);
  });

  test('tel:, sms: and mailto: links are well-formed and never empty', async ({ page }) => {
    const malformed: FoundLink[] = [];

    for (const route of ROUTES) {
      const links = await collectLinks(page, route);
      malformed.push(
        ...links.filter((link) => {
          const match = /^(tel|sms|mailto):(.*)$/i.exec(link.href);
          if (!match) return false;
          const value = match[2].trim();
          if (value.length === 0) return true;
          // Placeholder constants (NEEDS_HUMAN_PHONE etc.) are the documented pre-launch state
          // and are not a malformation — BL-012 tracks filling them in.
          if (value.startsWith('NEEDS_HUMAN_')) return false;
          return match[1].toLowerCase() === 'mailto' ? !value.includes('@') : !/\d/.test(value);
        }),
      );
    }

    expect(malformed, `malformed contact links:\n${JSON.stringify(malformed, null, 2)}`).toEqual(
      [],
    );
  });
});
