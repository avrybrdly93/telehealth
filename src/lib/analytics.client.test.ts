import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setAnalyticsTransport, type AnalyticsEventName } from './analytics';
import { initAnalytics } from './analytics.client';

// Implements ANALYTICS_PLAN.md's `pageview` (auto), `cta_book_click`, and `crisis_resource_click`
// events (BL-023) — exercises the delegated document-click listener the same way
// SiteHeader.client.test.ts exercises initSiteHeader, against a fixture DOM.
function click(el: Element) {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

describe('initAnalytics', () => {
  let calls: Array<[AnalyticsEventName, Record<string, string>]>;
  let dispose: () => void;

  beforeEach(() => {
    calls = [];
    setAnalyticsTransport((event, properties) => calls.push([event, properties]));
    document.body.innerHTML = '';
  });

  afterEach(() => {
    dispose?.();
    setAnalyticsTransport(() => {});
  });

  it('fires a pageview once on init with the sanitized route and device class', () => {
    dispose = initAnalytics();

    expect(calls).toHaveLength(1);
    const [event, properties] = calls[0];
    expect(event).toBe('pageview');
    expect(properties.route).toBe('/');
    expect(properties.device_class).toBe('desktop');
  });

  it('fires cta_book_click for a /book link, reading cta_position from the closest tagged ancestor', () => {
    document.body.innerHTML = `
      <div data-cta-position="hero"><a href="/book">Book an appointment</a></div>
      <a href="/book?provider=dr-md">Book with Dr. MD</a>
    `;
    dispose = initAnalytics();
    calls.length = 0;

    click(document.querySelector('div a')!);
    click(document.querySelectorAll('a')[1]);

    expect(calls).toEqual([
      ['cta_book_click', { source_route: '/', cta_position: 'hero' }],
      ['cta_book_click', { source_route: '/', cta_position: 'inline' }],
    ]);
  });

  it('fires crisis_resource_click for 988/911 links and nothing for unrelated links', () => {
    document.body.innerHTML = `
      <a href="tel:988">Call 988</a>
      <a href="sms:988">Text 988</a>
      <a href="tel:911">Call 911</a>
      <a href="/pricing">See pricing</a>
    `;
    dispose = initAnalytics();
    calls.length = 0;

    document.querySelectorAll('a').forEach((a) => click(a));

    expect(calls).toEqual([
      ['crisis_resource_click', { source_route: '/' }],
      ['crisis_resource_click', { source_route: '/' }],
      ['crisis_resource_click', { source_route: '/' }],
    ]);
  });
});
