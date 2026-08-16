import { describe, expect, it } from 'vitest';
import {
  buildFaqPageSchema,
  buildMedicalBusinessSchema,
  buildPhysicianSchema,
  serializeJsonLd,
} from './structuredData';

// Implements FR-051 / SEO_STRATEGY.md §Technical Foundation (BL-031): MedicalBusiness/Physician/
// FAQPage JSON-LD builders must emit valid schema.org shapes and respect
// LOCAL_SEARCH_STRATEGY.md's "no fake address markup" rule.
describe('structuredData', () => {
  const homeUrl = new URL('https://avrybrdly93.github.io/telehealth/');

  it('buildMedicalBusinessSchema has no address field and areaServed California', () => {
    const schema = buildMedicalBusinessSchema(homeUrl);
    expect(schema['@type']).toBe('MedicalBusiness');
    expect(schema).not.toHaveProperty('address');
    expect(schema.areaServed).toEqual({ '@type': 'State', name: 'California' });
    expect(schema.url).toBe('https://avrybrdly93.github.io/telehealth/');
  });

  it('buildPhysicianSchema reads jobTitle from the passed-in credential, not a hardcoded guess', () => {
    const schema = buildPhysicianSchema({
      name: 'Dr. Example',
      credential: 'MD, Board-Certified Psychiatrist',
      approachStatement: 'I focus on collaborative, whole-person care.',
      photoUrl: 'https://avrybrdly93.github.io/telehealth/images/provider-photo-placeholder.svg',
      pageUrl: 'https://avrybrdly93.github.io/telehealth/providers/dr-md/',
    });
    expect(schema['@type']).toBe('Physician');
    expect(schema.jobTitle).toBe('MD, Board-Certified Psychiatrist');
  });

  it('buildPhysicianSchema emits no identifier field now that license numbers are not shown', () => {
    // DECISION_LOG.md D-014 (2026-08-16). Asserting absence, not just "not equal to a stale
    // value" — a regression that re-added an empty/undefined identifier would be a broken
    // structured-data claim and should fail this the same way a wrong value would.
    const schema = buildPhysicianSchema({
      name: 'Dr. Example',
      credential: 'MD, Board-Certified Psychiatrist',
      approachStatement: 'I focus on collaborative, whole-person care.',
      photoUrl: 'https://avrybrdly93.github.io/telehealth/images/provider-photo-placeholder.svg',
      pageUrl: 'https://avrybrdly93.github.io/telehealth/providers/dr-md/',
    });
    expect(schema).not.toHaveProperty('identifier');
  });

  it('buildFaqPageSchema strips markdown syntax from answers', () => {
    const schema = buildFaqPageSchema([
      { question: 'What is a video visit?', answer: 'A **video visit** is a live appointment.' },
    ]);
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toEqual([
      {
        '@type': 'Question',
        name: 'What is a video visit?',
        acceptedAnswer: { '@type': 'Answer', text: 'A video visit is a live appointment.' },
      },
    ]);
  });

  it('serializeJsonLd escapes </script to prevent premature tag closure', () => {
    const serialized = serializeJsonLd({ text: '</script><script>alert(1)</script>' });
    expect(serialized).not.toContain('</script>');
    expect(serialized).toContain('<\\/script>');
  });
});
