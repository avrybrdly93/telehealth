---
title: Patient Journey
status: Active
authority: Product
owner: Product
dependencies:
  - PATIENT_PERSONAS.md
  - ../02_UX/USER_FLOWS.md
review_cycle: Quarterly
---

# Patient Journey

## Journey Map (Awareness → Ongoing Care)

### Stage 1 — Trigger & Search
State: distress or a nudge from family; searching on mobile, often at night.
Site touchpoint: SEO landing (service page or homepage).
**Job of the site**: answer "do they treat what I have, in California, and what does it cost?" within 10 seconds of landing. → FR-010, FR-013, UX-003.
Failure mode to prevent: bounce due to unclear geography/price.

### Stage 2 — Evaluation
State: comparing practices; skeptical.
Touchpoints: Providers, Pricing, FAQ, About.
**Job**: prove legitimacy (license info, real photos, specific policies) and warmth. → FR-011, FR-012, FR-016.
Failure mode: generic stock-photo feel → distrust → exit.

### Stage 3 — Decision & Booking
State: motivated but anxious; low tolerance for friction.
Touchpoint: scheduling flow.
**Job**: ≤ 4 steps to vendor handoff; state CA/18+/non-emergency requirements up front, not as a rejection at the end. → FR-020–FR-024, UX-010.
Failure mode: surprise requirements late in flow; forced account creation.

### Stage 4 — Pre-Visit
State: booked; nervous about "what happens".
Touchpoints: confirmation (vendor) + site's "Your first visit" content.
**Job**: set expectations (duration, tech check, what to prepare). → FR-015.

### Stage 5 — Ongoing Care
State: established patient rebooking follow-ups.
Touchpoints: vendor system primarily; site FAQ for policies.
**Job (MVP)**: stay out of the way; make policies findable. Portal features are Phase 2+ (ROADMAP.md).

## Journey KPIs
Mapped in ../08_OPERATIONS/ANALYTICS_PLAN.md: landing→pricing view rate, pricing→booking-start rate, booking-start→vendor-handoff completion rate, and (from vendor) handoff→confirmed booking rate.
