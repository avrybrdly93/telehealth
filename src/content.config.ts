/**
 * Content collections + zod schemas. Implements ARCHITECTURE.md §Content boundary —
 * page copy, service data, provider data, FAQ items, and legal metadata live here,
 * separate from components (NFR-007). Invalid frontmatter fails the build.
 *
 * Prices, credentials, and license numbers are NEVER inlined here — content files
 * reference a stable key (e.g. `providerKey: 'md'`) and the real value is looked up
 * from src/lib/practice.ts (CODING_STANDARDS.md §Content Files).
 */
import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { PROVIDER_KEYS, SERVICE_KEYS } from './lib/practice';

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    whoItsFor: z.string(),
    durationMinutesMin: z.number().int().positive(),
    durationMinutesMax: z.number().int().positive(),
    modality: z.literal('Video'),
    priceKey: z.enum(SERVICE_KEYS),
    providerSlugs: z.array(reference('providers')).min(1),
    order: z.number().int(),
  }),
});

const providers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/providers' }),
  schema: z.object({
    providerKey: z.enum(PROVIDER_KEYS),
    role: z.enum(['MD', 'PMHNP']),
    photo: z.string(),
    approachStatement: z.string(),
    conditionsTreated: z.array(reference('conditions')).min(1),
    education: z.array(z.string()).min(1),
    order: z.number().int(),
  }),
});

const conditions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/conditions' }),
  schema: z.object({
    name: z.string(),
    overview: z.string(),
    howCareHelps: z.string(),
    relatedServiceSlug: reference('services'),
    relatedFaqSlugs: z.array(reference('faq')).default([]),
    order: z.number().int(),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({
    question: z.string(),
    group: z.enum([
      'Getting started',
      'Appointments & policies',
      'Costs & superbills',
      'Medication questions',
      'Emergencies',
    ]),
    order: z.number().int(),
  }),
});

const legal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    lastUpdated: z.coerce.date(),
    reviewStatus: z.enum(['needs-human-review', 'approved']),
  }),
});

export const collections = { services, providers, conditions, faq, legal };
