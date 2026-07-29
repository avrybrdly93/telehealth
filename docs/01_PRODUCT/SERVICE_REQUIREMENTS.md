---
title: Service Requirements
status: Active
authority: Product
owner: Product
dependencies:
  - MVP_SCOPE.md
  - TELEHEALTH_SPECIFICATION.md
  - ../02_UX/ACCESSIBILITY.md
review_cycle: Monthly
---

# Service Requirements

Requirement IDs are permanent. Never renumber; deprecate instead (status column). Backlog items reference these IDs.

## Functional Requirements

| ID | Requirement | Acceptance criteria | Status |
|---|---|---|---|
| FR-010 | Homepage communicates offering, geography, and primary CTA above the fold | On 375px viewport without scrolling: value proposition, "California" mention, and Book button visible | Active |
| FR-011 | Provider bio pages for MD and PMHNP | Each shows: name, credentials, CA license number, photo, approach statement, conditions treated, education | Active |
| FR-012 | About page with practice philosophy | Includes care model, telehealth-only explanation, and practice values; no outcome guarantees | Active |
| FR-013 | Public pricing page | Lists intake and follow-up self-pay prices, superbill explanation, cancellation policy | Active |
| FR-014 | California-only + 18+ eligibility stated | Present on: homepage footer, every service page, pricing, scheduling step 1 | Active |
| FR-015 | "Your first visit" expectations content | Covers duration, tech requirements, what to prepare, privacy of video visit | Active |
| FR-016 | FAQ page | ≥ 12 real Q&As incl. superbills, cancellation, prescriptions policy pointer, emergencies | Active |
| FR-020 | Scheduling flow step: service selection | User selects intake vs follow-up; follow-up path notes it is for existing patients | Active |
| FR-021 | Scheduling flow step: provider preference (optional, skippable) | "No preference" is default-equal option; skipping never penalizes wait time messaging | Active |
| FR-022 | Scheduling flow step: eligibility acknowledgment | Checkboxes: in CA at visit time; 18+; not an emergency (with 988/911 shown) | Active |
| FR-023 | Vendor handoff | Flow passes service/provider selection to vendor booking URL; no free-text clinical info collected on our side | Active |
| FR-024 | Scheduling abandonment safety | Every scheduling step shows persistent crisis-resource strip and a phone alternative | Active |
| FR-030 | Contact form | Fields: name, email, phone (optional), message. Message field labeled "Please don't include medical details" | Active |
| FR-031 | Contact form delivery | Submissions delivered to practice email within 5 min; user sees success state per ERROR_STATES.md | Active |
| FR-032 | Phone and email visible sitewide | Header (desktop) and footer (all); tap-to-call on mobile | Active |
| FR-040 | Legal pages | Privacy Policy, Terms of Use, Accessibility Statement, telehealth consent overview | Active |
| FR-041 | 404 page | On-brand, links to Home/Services/Contact, includes crisis strip | Active |
| FR-050 | Sitemap.xml + robots.txt + canonical URLs | Auto-generated at build; validates in Search Console | Active |
| FR-051 | Structured data | schema.org MedicalBusiness/Physician + FAQPage markup passes Rich Results test | Active |

## Non-Functional Requirements

| ID | Requirement | Acceptance criteria | Status |
|---|---|---|---|
| NFR-001 | Performance | Budgets in ../04_ENGINEERING/PERFORMANCE_BUDGET.md met on all pages | Active |
| NFR-002 | Accessibility | WCAG 2.1 AA per ../02_UX/ACCESSIBILITY.md; axe zero critical/serious | Active |
| NFR-003 | Availability | Static-first architecture; core pages served from CDN; 99.9% target | Active |
| NFR-004 | Privacy | No PHI collected/stored; only DATA_BOUNDARIES.md-approved fields; no third-party ad trackers | Active |
| NFR-005 | SEO technical health | Valid metadata, OG tags, unique titles/descriptions per page | Active |
| NFR-006 | Browser support | Latest 2 versions Chrome/Safari/Firefox/Edge + iOS Safari, Android Chrome | Active |
| NFR-007 | Maintainability | New service page addable via content file only, no component changes | Active |
| NFR-008 | Extensibility | Adding portal/auth later requires no change to public-site routing or content model | Active |

## UX Requirements

| ID | Requirement | Acceptance criteria | Status |
|---|---|---|---|
| UX-001 | One primary CTA per screen | Visual hierarchy audit per page spec; secondary actions styled as secondary | Active |
| UX-002 | 8th-grade reading level for patient copy | Automated readability check in CI on content files | Active |
| UX-003 | Pricing reachable in ≤ 2 interactions from any page | Nav audit | Active |
| UX-010 | Scheduling flow ≤ 4 steps to vendor handoff | Step count in USER_FLOWS.md implementation matches | Active |
| UX-011 | Back navigation never loses scheduling selections | Browser back preserves state through flow | Active |
| UX-020 | Crisis resources on every page and scheduling step | Footer block + scheduling strip: 988 call/text, 911, link to more resources | Active |
| UX-021 | No dark patterns | No countdowns, fake scarcity, pre-checked marketing boxes, or forced accounts | Active |
