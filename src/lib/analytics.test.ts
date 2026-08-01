import { afterEach, describe, expect, it } from 'vitest';
import {
  sanitizeRoute,
  setAnalyticsConsent,
  setAnalyticsTransport,
  trackEvent,
  type AnalyticsEventName,
} from './analytics';

// Implements ANALYTICS_PLAN.md §Event Schema / DATA_BOUNDARIES.md Boundary 4 (BL-023):
// trackEvent() must only ever forward the exact allowlisted properties for an event, strip
// query strings from route-shaped properties, and respect the consent seam.
describe('analytics', () => {
  afterEach(() => {
    setAnalyticsConsent(true);
    setAnalyticsTransport(() => {});
  });

  it('sanitizeRoute strips query strings and fragments', () => {
    expect(sanitizeRoute('/providers?provider=dr-md')).toBe('/providers');
    expect(sanitizeRoute('/faq#emergencies')).toBe('/faq');
    expect(sanitizeRoute('/')).toBe('/');
    expect(sanitizeRoute('')).toBe('/');
  });

  it('forwards exactly the allowlisted properties for each schema event', () => {
    const calls: Array<[AnalyticsEventName, Record<string, string>]> = [];
    setAnalyticsTransport((event, properties) => calls.push([event, properties]));

    trackEvent('pageview', {
      route: '/pricing',
      referrer_domain: 'google.com',
      device_class: 'mobile',
    });
    trackEvent('cta_book_click', { source_route: '/', cta_position: 'hero' });
    trackEvent('crisis_resource_click', { source_route: '/faq' });
    trackEvent('contact_submit_success', { route: '/contact' });
    trackEvent('contact_submit_error', { route: '/contact' });
    trackEvent('error_view', { error_id: 'E-030', route: '/contact' });
    trackEvent('booking_step_view', { step: '1' });
    trackEvent('booking_service_selected', { service: 'intake' });
    trackEvent('booking_provider_selected', { provider_slug: 'dr-md' });
    trackEvent('booking_handoff', { service: 'intake', provider_slug: 'dr-md' });

    expect(calls).toEqual([
      ['pageview', { route: '/pricing', referrer_domain: 'google.com', device_class: 'mobile' }],
      ['cta_book_click', { source_route: '/', cta_position: 'hero' }],
      ['crisis_resource_click', { source_route: '/faq' }],
      ['contact_submit_success', { route: '/contact' }],
      ['contact_submit_error', { route: '/contact' }],
      ['error_view', { error_id: 'E-030', route: '/contact' }],
      ['booking_step_view', { step: '1' }],
      ['booking_service_selected', { service: 'intake' }],
      ['booking_provider_selected', { provider_slug: 'dr-md' }],
      ['booking_handoff', { service: 'intake', provider_slug: 'dr-md' }],
    ]);
  });

  it('strips query strings from route-shaped properties even if a caller forgets to', () => {
    const calls: Array<[AnalyticsEventName, Record<string, string>]> = [];
    setAnalyticsTransport((event, properties) => calls.push([event, properties]));

    trackEvent('pageview', {
      route: '/providers?provider=dr-md',
      referrer_domain: '',
      device_class: 'desktop',
    });

    expect(calls[0][1].route).toBe('/providers');
  });

  it('drops any property not on the event schema, even when forced past the type system', () => {
    const calls: Array<[AnalyticsEventName, Record<string, string>]> = [];
    setAnalyticsTransport((event, properties) => calls.push([event, properties]));

    // Simulates a caller accidentally passing free-text field contents (e.g. the contact form's
    // message) via a loose cast — DATA_BOUNDARIES.md Boundary 4 requires this never reach the
    // transport, regardless of what TypeScript alone would have prevented.
    trackEvent('contact_submit_error', {
      route: '/contact',
      message: 'my social security number is 123-45-6789',
    } as never);

    expect(calls[0][1]).toEqual({ route: '/contact' });
    expect(calls[0][1]).not.toHaveProperty('message');
  });

  it('never sends an event once consent is revoked', () => {
    const calls: Array<[AnalyticsEventName, Record<string, string>]> = [];
    setAnalyticsTransport((event, properties) => calls.push([event, properties]));
    setAnalyticsConsent(false);

    trackEvent('pageview', { route: '/', referrer_domain: '', device_class: 'desktop' });

    expect(calls).toHaveLength(0);
  });
});
