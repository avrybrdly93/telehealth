---
title: MVP Scope
status: Active
authority: Product
owner: Founders
dependencies:
  - SERVICE_REQUIREMENTS.md
  - ../06_PROJECT/ROADMAP.md
review_cycle: Monthly
---

# MVP Scope

## In Scope

| Area | Deliverable |
|---|---|
| Pages | Home, Services (index + one page per service), Providers (index + 2 bios), About, Pricing, Contact, FAQ, Legal (Privacy Policy, Terms, Telehealth Consent info, Accessibility statement), 404 |
| Scheduling | Multi-step flow: service → provider (optional) → eligibility acknowledgment (CA, 18+, non-emergency) → handoff to vendor booking |
| Contact | Contact form (name, email/phone, non-clinical message) + phone/email display |
| Platform | Mobile-first responsive, WCAG 2.1 AA, SEO foundation (metadata, sitemap, schema.org), analytics per ANALYTICS_PLAN.md |

## Out of Scope (MVP) — architecture must not block these

Patient portal · EHR integration · insurance billing · secure messaging · automated clinical workflows · blog CMS beyond simple markdown content · multi-language.

## Scope Change Rules

- Additions/removals are Tier 3 decisions (../00_AI_OPERATING_SYSTEM/DECISION_FRAMEWORK.md).
- "Small" additions (a new FAQ entry, a new image) inside existing pages are Tier 1.
- Anything that adds a data field collected from patients is Tier 3 regardless of size.

## MVP Acceptance Criteria (launch gate)

- [ ] All in-scope pages live with final copy (no placeholders).
- [ ] Scheduling flow completes end-to-end to a real vendor booking in production.
- [ ] Lighthouse (mobile): Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95 on all pages.
- [ ] axe: zero critical/serious issues on all pages.
- [ ] Crisis resources verified present on every page + every scheduling step.
- [ ] Legal pages reviewed by a human (Tier 3 sign-off recorded in DECISION_LOG.md).
- [ ] Analytics events firing per ../08_OPERATIONS/ANALYTICS_PLAN.md.
