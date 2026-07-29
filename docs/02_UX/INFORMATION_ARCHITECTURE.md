---
title: Information Architecture
status: Active
authority: UX
owner: Product
dependencies:
  - ../01_PRODUCT/MVP_SCOPE.md
  - USER_FLOWS.md
review_cycle: Monthly
---

# Information Architecture

## Site Map (authoritative route list)

/                       Homepage
/services               Services index
/services/psychiatric-evaluation
/services/medication-management
/conditions/[slug]      Educational condition pages (SEO; Phase 1: depression, anxiety, adhd)
/providers              Providers index
/providers/[slug]       Individual bios (2 at launch)
/pricing                Pricing & policies
/about                  About the practice
/faq                    FAQ
/your-first-visit       Expectations content (FR-015)
/book                   Scheduling flow (steps as client-side states or /book/step-n)
/contact                Contact form + phone/email
/legal/privacy          /legal/terms       /legal/accessibility      /legal/telehealth-consent
/404

Any new route requires updating this file in the same change (NFR-007 review checks for drift).

## Global Navigation

**Header (desktop)**: Services · Providers · Pricing · About · FAQ · [Book an appointment — primary button] · phone number.
**Header (mobile)**: logo + Book button + menu toggle; menu lists all header items + Contact.
**Footer (all pages)**: nav links, contact info, CA-only + 18+ statement (FR-014), crisis resources block (UX-020), legal links, license disclosure line.

Rules:
- "Book an appointment" is the only button-styled item in the header (UX-001).
- Max nav depth: 2 levels. No mega-menus.
- Current page indicated in nav (aria-current="page" + visual state).

## Content Hierarchy Principles
1. Answer eligibility (California, adults, self-pay) before persuasion.
2. Every service/condition page ends with: pricing summary → provider link → Book CTA, in that order.
3. Educational condition pages exist for SEO and trust; they must link to the matching service page within the first screen.

## URL Rules
Lowercase, hyphenated, no dates, no trailing slashes, stable forever (redirects required for any change — Tier 2 decision).
