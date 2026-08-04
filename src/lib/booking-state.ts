import type { BookingService } from './analytics';

/**
 * Booking flow state shape (BL-035/DECISION_LOG.md D-013). Kept as a plain, framework-free
 * interface — the contract BL-036 (adds `provider`, already present here), BL-037, and BL-021's
 * future `buildBookingUrl(selection)` build against (ARCHITECTURE.md §Extensibility). Never
 * carries identity data (D-003) — service + optional provider slug only.
 */
export interface BookingSelection {
  service?: BookingService;
  provider?: string;
}

const SERVICE_VALUES: readonly BookingService[] = ['intake', 'followup'];

function isBookingService(value: string | null): value is BookingService {
  return value !== null && (SERVICE_VALUES as readonly string[]).includes(value);
}

/** UX-011: state lives in URL params/sessionStorage, never cookies. */
export const BOOKING_SESSION_STORAGE_KEY = 'booking-selection';

/** Reads a `BookingSelection` from URL search params (e.g. `Astro.url.searchParams`, `location.search`). */
export function parseBookingSelection(searchParams: URLSearchParams): BookingSelection {
  const service = searchParams.get('service');
  const provider = searchParams.get('provider');
  const selection: BookingSelection = {};
  if (isBookingService(service)) selection.service = service;
  if (provider) selection.provider = provider;
  return selection;
}

/** Serializes a `BookingSelection` to URL search params, omitting unset fields. */
export function bookingSelectionToParams(selection: BookingSelection): URLSearchParams {
  const params = new URLSearchParams();
  if (selection.service) params.set('service', selection.service);
  if (selection.provider) params.set('provider', selection.provider);
  return params;
}

/**
 * Reads the last-persisted selection from `sessionStorage` (survives browser back/forward within
 * a tab session, per UX-011 — cleared when the tab closes, never a cookie). Returns `{}` if
 * nothing is stored, storage is unavailable (SSR, disabled storage), or the stored value is
 * malformed — never throws.
 */
export function readStoredBookingSelection(storage: Storage): BookingSelection {
  try {
    const raw = storage.getItem(BOOKING_SESSION_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return {};
    const { service, provider } = parsed as Record<string, unknown>;
    const selection: BookingSelection = {};
    if (typeof service === 'string' && isBookingService(service)) selection.service = service;
    if (typeof provider === 'string' && provider) selection.provider = provider;
    return selection;
  } catch {
    return {};
  }
}

/** Persists a `BookingSelection` to `sessionStorage`. Silently no-ops if storage is unavailable. */
export function writeStoredBookingSelection(storage: Storage, selection: BookingSelection): void {
  try {
    storage.setItem(BOOKING_SESSION_STORAGE_KEY, JSON.stringify(selection));
  } catch {
    // Storage unavailable (private-browsing quota, disabled storage) — URL params still carry
    // the selection within the same page load; nothing else this module can do.
  }
}

/**
 * Merges a URL-derived selection with a stored one: URL params win per field (so a deep link like
 * `/book?provider=slug`, Flow 3, always reflects what's actually in the address bar), falling
 * back to the stored value for any field the URL didn't specify.
 */
export function mergeBookingSelection(
  fromUrl: BookingSelection,
  fromStorage: BookingSelection,
): BookingSelection {
  return {
    service: fromUrl.service ?? fromStorage.service,
    provider: fromUrl.provider ?? fromStorage.provider,
  };
}
