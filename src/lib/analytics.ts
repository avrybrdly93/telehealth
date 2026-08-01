/**
 * Single analytics wrapper module (ARCHITECTURE.md §Extensibility Commitments, BL-023).
 * Cookieless, aggregate-only per DECISION_LOG.md D-002 and ANALYTICS_PLAN.md — the map below is
 * the complete event allowlist; adding an event is Tier 2, adding a property is Tier 3 if it
 * could carry user data (ANALYTICS_PLAN.md §Event Schema). trackEvent() drops any property not
 * named here, so a caller passing extra data (e.g. via a loose cast) can't leak it through.
 *
 * No analytics vendor is configured on this deployment (DEMO/PROTOTYPE — no real credentials;
 * see PROJECT_STATUS.md "Blocked / Needs Human Input"). The default transport is an honest
 * no-op rather than a fabricated call to an unconfigured endpoint — same gap-documented pattern
 * ContactForm.client.ts uses for `/api/contact` (DECISION_LOG.md D-009). setAnalyticsTransport()
 * lets a future session wire in a real provider without touching any call site.
 */

export type CtaPosition = 'hero' | 'nav' | 'footer' | 'inline';
export type BookingService = 'intake' | 'followup';
export type DeviceClass = 'mobile' | 'tablet' | 'desktop';
export type BookingStep = '1' | '2' | '3' | '4';

export interface AnalyticsEventMap {
  pageview: { route: string; referrer_domain: string; device_class: DeviceClass };
  cta_book_click: { source_route: string; cta_position: CtaPosition };
  booking_step_view: { step: BookingStep };
  booking_service_selected: { service: BookingService };
  booking_provider_selected: { provider_slug: string };
  booking_handoff: { service: BookingService; provider_slug: string };
  contact_submit_success: { route: string };
  contact_submit_error: { route: string };
  crisis_resource_click: { source_route: string };
  error_view: { error_id: string; route: string };
}

export type AnalyticsEventName = keyof AnalyticsEventMap;

export type AnalyticsTransport = (
  event: AnalyticsEventName,
  properties: Record<string, string>,
) => void;

// DATA_BOUNDARIES.md Boundary 4 / ANALYTICS_PLAN.md "no query strings in route property" —
// route-shaped properties are sanitized to a bare pathname regardless of what the caller passes.
const ROUTE_PROPERTY_KEYS = new Set(['route', 'source_route']);

// Order here is the allowlist AND the transport's argument order; unlisted keys are dropped.
const EVENT_PROPERTY_ALLOWLIST: {
  [E in AnalyticsEventName]: readonly (keyof AnalyticsEventMap[E])[];
} = {
  pageview: ['route', 'referrer_domain', 'device_class'],
  cta_book_click: ['source_route', 'cta_position'],
  booking_step_view: ['step'],
  booking_service_selected: ['service'],
  booking_provider_selected: ['provider_slug'],
  booking_handoff: ['service', 'provider_slug'],
  contact_submit_success: ['route'],
  contact_submit_error: ['route'],
  crisis_resource_click: ['source_route'],
  error_view: ['error_id', 'route'],
};

/** Strips query string and fragment (never sent — may contain user-supplied data). */
export function sanitizeRoute(pathname: string): string {
  const bare = pathname.split('?')[0].split('#')[0];
  return bare || '/';
}

let consentGranted = true; // D-002: cookieless aggregate analytics needs no consent banner (NFR-004).
let transport: AnalyticsTransport = () => {
  // No analytics vendor configured on this deployment — honest no-op (see module doc comment).
};

/** Seam for a future consent manager (ARCHITECTURE.md) — no call site changes required. */
export function setAnalyticsConsent(granted: boolean): void {
  consentGranted = granted;
}

/** Seam for wiring a real provider once one is chosen; also used by tests to spy on events. */
export function setAnalyticsTransport(next: AnalyticsTransport): void {
  transport = next;
}

export function trackEvent<E extends AnalyticsEventName>(
  event: E,
  properties: AnalyticsEventMap[E],
): void {
  if (!consentGranted) return;

  const source = properties as unknown as Record<string, string>;
  const sanitized: Record<string, string> = {};
  for (const key of EVENT_PROPERTY_ALLOWLIST[event] as readonly string[]) {
    const value = source[key];
    if (value === undefined) continue;
    sanitized[key] = ROUTE_PROPERTY_KEYS.has(key) ? sanitizeRoute(value) : value;
  }
  transport(event, sanitized);
}
