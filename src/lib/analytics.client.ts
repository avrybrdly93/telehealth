import { sanitizeRoute, trackEvent, type CtaPosition, type DeviceClass } from './analytics';

// Global bootstrap for the analytics wrapper (BL-023) — wired once from BaseLayout.astro so
// `pageview`, `cta_book_click`, and `crisis_resource_click` fire on every route without touching
// each page/component individually (ARCHITECTURE.md's "single module" extensibility goal).
// Vanilla JS, same "plain <script>, no framework runtime" pattern as SiteHeader.client.ts (BL-007).

const CRISIS_HREF_PREFIXES = ['tel:988', 'sms:988', 'tel:911'];

function deviceClassForWidth(width: number): DeviceClass {
  if (width >= 1024) return 'desktop';
  if (width >= 640) return 'tablet';
  return 'mobile';
}

function referrerDomain(referrer: string): string {
  if (!referrer) return '';
  try {
    return new URL(referrer).hostname;
  } catch {
    return '';
  }
}

function closestCtaPosition(el: HTMLElement): CtaPosition {
  const tagged = el.closest<HTMLElement>('[data-cta-position]');
  const value = tagged?.dataset.ctaPosition;
  return value === 'hero' || value === 'nav' || value === 'footer' ? value : 'inline';
}

/** Returns a disposer that removes the click listener — used by tests to isolate runs. */
export function initAnalytics(): () => void {
  const route = sanitizeRoute(window.location.pathname);
  trackEvent('pageview', {
    route,
    referrer_domain: referrerDomain(document.referrer),
    device_class: deviceClassForWidth(window.innerWidth),
  });

  function onClick(event: MouseEvent) {
    const target = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href]');
    if (!target) return;

    const href = target.getAttribute('href') ?? '';
    if (href === '/book' || href.startsWith('/book?') || href.startsWith('/book#')) {
      trackEvent('cta_book_click', {
        source_route: route,
        cta_position: closestCtaPosition(target),
      });
      return;
    }
    if (CRISIS_HREF_PREFIXES.some((prefix) => href.startsWith(prefix))) {
      trackEvent('crisis_resource_click', { source_route: route });
    }
  }

  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}
