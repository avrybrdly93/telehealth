---
title: Page Specifications
status: Active
authority: Design
owner: Product
dependencies:
  - COMPONENT_LIBRARY.md
  - ../02_UX/INFORMATION_ARCHITECTURE.md
  - ../01_PRODUCT/SERVICE_REQUIREMENTS.md
review_cycle: Monthly
---

# Page Specifications

Every route in INFORMATION_ARCHITECTURE.md has a spec here. Format: purpose · primary persona · section order · CTA · requirements implemented. Header/footer implied on all pages.

## / — Homepage (persona: Maya; FR-010, FR-014, UX-001)
1. **Hero**: H1 value proposition naming services + "California" + Book button (primary) + "See pricing" (text button). Above fold at 375px. No image carousel; single calm photo or none.
2. **Services overview**: 2 service Cards.
3. **Providers preview**: 2 provider Cards → bios.
4. **How it works**: 3 steps (Book → Video visit → Ongoing plan), each ≤ 2 sentences.
5. **Trust strip**: license line, "Self-pay, transparent pricing" line, telehealth-across-CA line.
6. **FAQ preview**: 3 FAQAccordion items → /faq.
7. End CTA: Book.

## /services + /services/[slug] (Maya, Danielle; FR-013 summary, FR-014)
Index: intro paragraph + 2 service Cards. Detail pages: H1 · who it's for · what happens (duration, format) · what it costs (exact price + link /pricing) · which provider(s) · Book CTA. Evaluation page must state the 60-minute duration; follow-up page states it's for existing patients.

## /conditions/[slug] (SEO entry; Maya)
H1 condition name · plain-language overview (educational disclaimer per COPY_GUIDELINES.md rule 2) · how psychiatric care typically helps · link to matching service within first screen · Book CTA · related FAQ items. Breadcrumbs. FAQPage schema where Q&A included (FR-051).

## /providers + /providers/[slug] (all personas; FR-011)
Index: intro + 2 provider Cards. Bio page: photo (IMAGE_GUIDELINES.md) · name + full credential · approach statement in first person (≤ 150 words) · conditions treated · education/training list · Book CTA pre-selecting provider (/book?provider=slug). No CA license number — removed per DECISION_LOG.md D-014 (2026-08-16).

## /pricing (Maya, Danielle; FR-013, UX-003)
PricingTable: initial evaluation and follow-up with exact prices and durations · what's included · superbill explanation (plain language) · cancellation policy · payment methods · "Why self-pay" short section · Book CTA. No asterisks or "starting at".

## /about (Robert, Danielle; FR-012)
Practice story and philosophy · why telehealth-only · care values · providers preview → bios · Book CTA.

## /faq (Danielle; FR-016)
FAQAccordion grouped: Getting started · Appointments & policies · Costs & superbills · Medication questions (policy-level only) · Emergencies (crisis guidance + what we're not). Anchor links per group; #emergencies anchor required (Flow 4).

## /your-first-visit (FR-015)
What to expect timeline · tech checklist (device, connection, private space) · what to have ready · privacy of video visits note · Book CTA.

## /book (Maya; FR-020–024, UX-010/011/020)
Implements Flow 1 exactly (USER_FLOWS.md). Minimal chrome: logo, StepIndicator, step content, CrisisResources strip, phone alternative. No footer nav (reduce exits) but crisis strip mandatory.

## /contact (Robert; FR-030–032)
Phone (tel:) and email prominent above the form · form per Flow 2 · response-time expectation · "For medical questions, please book an appointment" note · crisis strip.

## /legal/* (FR-040)
Prose template, --text-body, last-updated date, table of contents if > 8 sections. Content requires human sign-off (Tier 3).

## /404 (FR-041, E-040)
Per ERROR_STATES.md.
