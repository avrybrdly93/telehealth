import { PLACEHOLDER_VENDOR_BOOKING_URL } from './practice';
import type { BookingSelection } from './booking-state';

/**
 * The vendor handoff (BL-021, FR-023, ARCHITECTURE.md §Extensibility): "one function
 * (`buildBookingUrl(selection)`) — swapping vendors touches one file + tests." Only `service` and
 * `provider` ever leave the client this way — DATA_BOUNDARIES.md Boundary 2 draws the line here:
 * no name, DOB, contact, or intake info is ever collected on our side, let alone forwarded.
 * `selection.provider` is expected already normalized (e.g. to `'none'` for no-preference) by the
 * caller — this function doesn't invent a fallback, so a `BookingSelection` with an unset
 * `provider` produces a URL with no `provider` param.
 */
export function buildBookingUrl(selection: BookingSelection): string {
  const url = new URL(PLACEHOLDER_VENDOR_BOOKING_URL);
  if (selection.service) url.searchParams.set('service', selection.service);
  if (selection.provider) url.searchParams.set('provider', selection.provider);
  return url.toString();
}
