import { describe, expect, it } from 'vitest';
import { buildBookingUrl } from './vendor-booking';
import { PLACEHOLDER_VENDOR_BOOKING_URL } from './practice';

// Implements BL-021 / ARCHITECTURE.md §Extensibility / DATA_BOUNDARIES.md Boundary 2.
describe('buildBookingUrl', () => {
  it('includes service and provider as query params (BOOK-01)', () => {
    const url = new URL(buildBookingUrl({ service: 'intake', provider: 'dr-md' }));
    expect(url.origin + url.pathname).toBe(
      new URL(PLACEHOLDER_VENDOR_BOOKING_URL).origin +
        new URL(PLACEHOLDER_VENDOR_BOOKING_URL).pathname,
    );
    expect(url.searchParams.get('service')).toBe('intake');
    expect(url.searchParams.get('provider')).toBe('dr-md');
  });

  it('carries the "none" sentinel as a plain provider value, same as any other slug', () => {
    const url = new URL(buildBookingUrl({ service: 'followup', provider: 'none' }));
    expect(url.searchParams.get('provider')).toBe('none');
  });

  it('omits provider when unset rather than inventing a fallback', () => {
    const url = new URL(buildBookingUrl({ service: 'intake' }));
    expect(url.searchParams.has('provider')).toBe(false);
  });

  it('omits service when unset', () => {
    const url = new URL(buildBookingUrl({ provider: 'dr-md' }));
    expect(url.searchParams.has('service')).toBe(false);
  });

  it('never includes any field other than service/provider (DATA_BOUNDARIES Boundary 2)', () => {
    const url = new URL(buildBookingUrl({ service: 'intake', provider: 'dr-md' }));
    expect(Array.from(url.searchParams.keys()).sort()).toEqual(['provider', 'service']);
  });
});
