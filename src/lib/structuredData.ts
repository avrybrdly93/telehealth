/**
 * schema.org JSON-LD builders for MedicalBusiness, Physician, and FAQPage structured data.
 * Implements FR-051 / SEO_STRATEGY.md §Technical Foundation (BL-031). Pure data builders only —
 * no filesystem/Astro-global access — so they're unit-testable directly; pages pass in `site`
 * (Astro.site) and embed the result via a `<script type="application/ld+json">` tag.
 */
import { PLACEHOLDER_EMAIL, PLACEHOLDER_PHONE, PLACEHOLDER_PRACTICE_NAME } from './practice';
import { stripMarkdownSyntax } from './readability';

/** SEO_STRATEGY.md §Technical Foundation: both provider bios use MedicalSpecialty "Psychiatric". */
const MEDICAL_SPECIALTY = 'Psychiatric';

/**
 * LOCAL_SEARCH_STRATEGY.md §Site-Side Support: "schema.org MedicalBusiness with areaServed:
 * California; no fake address markup" — deliberately no `address` field. This is a
 * telehealth-only practice with no public location; inventing one is explicitly prohibited.
 *
 * @param homeUrl the site's fully-resolved, base-prefixed homepage URL (callers already compute
 *   this shape — e.g. `new URL(withBase('/'), Astro.site)` — so this module stays pure/testable
 *   and doesn't need `import.meta.env` itself).
 */
export function buildMedicalBusinessSchema(homeUrl: URL): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: PLACEHOLDER_PRACTICE_NAME,
    url: homeUrl.toString(),
    telephone: PLACEHOLDER_PHONE,
    email: PLACEHOLDER_EMAIL,
    medicalSpecialty: MEDICAL_SPECIALTY,
    areaServed: { '@type': 'State', name: 'California' },
  };
}

export interface PhysicianInput {
  name: string;
  /** PROVIDER_CREDENTIALS[key] (practice.ts) — the canonical, per-role-accurate title source. */
  credential: string;
  licenseNumber: string;
  approachStatement: string;
  photoUrl: string;
  pageUrl: string;
}

/**
 * SEO_STRATEGY.md §Technical Foundation: "Physician (both bios — type applies to the practice's
 * clinicians; PMHNP page also uses accurate jobTitle)". `jobTitle` is read from `credential`
 * (practice.ts) rather than hardcoded per role, so it stays accurate for both MD and PMHNP
 * without this module guessing at wording.
 */
export function buildPhysicianSchema(input: PhysicianInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: input.name,
    jobTitle: input.credential,
    medicalSpecialty: MEDICAL_SPECIALTY,
    url: input.pageUrl,
    image: input.photoUrl,
    description: input.approachStatement,
    identifier: {
      '@type': 'PropertyValue',
      name: 'California medical license',
      value: input.licenseNumber,
    },
  };
}

export interface FaqPageItem {
  question: string;
  answer: string;
}

/**
 * `answer` is run through readability.ts's `stripMarkdownSyntax` (same helper the readability
 * CI script uses) since FAQ answers are markdown content-file bodies — a schema.org Answer.text
 * should be plain prose, not raw Markdown syntax.
 */
export function buildFaqPageSchema(items: FaqPageItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripMarkdownSyntax(item.answer),
      },
    })),
  };
}

/**
 * Serializes a JSON-LD object for embedding in a `<script type="application/ld+json">` tag,
 * escaping `</script` so content can never prematurely close the tag it's embedded in.
 */
export function serializeJsonLd(schema: Record<string, unknown>): string {
  return JSON.stringify(schema).replace(/<\/script/gi, '<\\/script');
}
