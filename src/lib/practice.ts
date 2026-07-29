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
