/**
 * Central source of truth for practice facts referenced across content and components.
 * Implements CODING_STANDARDS.md §Content Files — prices, credentials, contact info
 * are defined once here, never inlined in copy files.
 *
 * Values below are NEEDS_HUMAN placeholders — see PROJECT_STATUS.md "Blocked / Needs
 * Human Input". Do not replace with invented real-sounding facts.
 */

export const PLACEHOLDER_PRACTICE_NAME = 'NEEDS_HUMAN_PRACTICE_NAME';
export const PLACEHOLDER_PHONE = 'NEEDS_HUMAN_PHONE';
export const PLACEHOLDER_EMAIL = 'NEEDS_HUMAN_EMAIL';
export const PLACEHOLDER_DOMAIN = 'NEEDS_HUMAN_DOMAIN';

/**
 * Stable keys referenced from content frontmatter (never the values themselves).
 * Implements ARCHITECTURE.md §Content boundary — content files stay valid even
 * before real names/prices are supplied; components look up the value by key.
 */
export const PROVIDER_KEYS = ['md', 'pmhnp'] as const;
export type ProviderKey = (typeof PROVIDER_KEYS)[number];

export const SERVICE_KEYS = ['evaluation', 'followup'] as const;
export type ServiceKey = (typeof SERVICE_KEYS)[number];

export const PROVIDER_NAMES: Record<ProviderKey, string> = {
  md: 'NEEDS_HUMAN_PROVIDER_MD_NAME',
  pmhnp: 'NEEDS_HUMAN_PROVIDER_PMHNP_NAME',
};

export const PROVIDER_CREDENTIALS: Record<ProviderKey, string> = {
  md: 'NEEDS_HUMAN_PROVIDER_MD_CREDENTIALS',
  pmhnp: 'NEEDS_HUMAN_PROVIDER_PMHNP_CREDENTIALS',
};

export const PROVIDER_LICENSE_NUMBERS: Record<ProviderKey, string> = {
  md: 'NEEDS_HUMAN_PROVIDER_MD_LICENSE_NUMBER',
  pmhnp: 'NEEDS_HUMAN_PROVIDER_PMHNP_LICENSE_NUMBER',
};

export const SERVICE_PRICES: Record<ServiceKey, string> = {
  evaluation: 'NEEDS_HUMAN_EVALUATION_PRICE',
  followup: 'NEEDS_HUMAN_FOLLOWUP_PRICE',
};

export const PLACEHOLDER_CANCELLATION_POLICY = 'NEEDS_HUMAN_CANCELLATION_POLICY';
export const PLACEHOLDER_PAYMENT_METHODS = 'NEEDS_HUMAN_PAYMENT_METHODS';

/**
 * Booking flow Step 4 vendor-handoff target (BL-021, FR-023). No scheduling/intake vendor has
 * been chosen yet (PROJECT_STATUS.md "Blocked / Needs Human Input" — "Vendor selection"), so
 * unlike the string placeholders above this needs to be a syntactically real, navigable URL for
 * `buildBookingUrl`/the e2e mock-vendor test to target. `.example` is the IANA/RFC 2606 reserved
 * TLD guaranteed never to resolve on a real network, so this is CI-safe even if a test ever
 * skipped mocking it. Replace with the real vendor's booking endpoint once D-009/vendor selection
 * resolves.
 */
export const PLACEHOLDER_VENDOR_BOOKING_URL = 'https://scheduling.needs-human-vendor.example/book';
