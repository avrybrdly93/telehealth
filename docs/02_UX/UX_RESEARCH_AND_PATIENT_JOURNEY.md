---
title: UX Research and Patient Journey
status: Active
authority: UX
owner: Product
dependencies:
  - ../01_PRODUCT/PATIENT_PERSONAS.md
  - ../01_PRODUCT/PATIENT_JOURNEY.md
review_cycle: Quarterly
---

# UX Research and Patient Journey

## Research Basis (assumptions to validate post-launch)

Documented assumptions, each with a validation method in ../08_OPERATIONS/CONTINUOUS_IMPROVEMENT.md:

| ID | Assumption | Validation |
|---|---|---|
| RA-001 | Majority of first visits are mobile, evening | Analytics device/hour report, month 1 |
| RA-002 | Price opacity is the #1 stated drop-off reason | Post-booking 1-question survey + funnel data |
| RA-003 | Provider bio views correlate with booking completion | Funnel path analysis |
| RA-004 | Users abandon flows requiring account creation | We never require accounts pre-booking; monitor vendor step drop-off |

## Emotional Design Requirements by Journey Stage

The patient journey stages are defined in ../01_PRODUCT/PATIENT_JOURNEY.md. This section adds UX treatment rules:

- **Landing (anxious, evaluating)**: no autoplaying motion; hero copy addresses the reader directly ("Care for anxiety, depression, and ADHD — from home, anywhere in California"); CTA verb is "Book an appointment", never "Get started now!!" urgency styling.
- **Evaluating (skeptical)**: license numbers rendered as text (verifiable), not images; photos of the actual clinicians; policies written as answers, not legal boilerplate.
- **Booking (committed, fragile)**: progress indicator on every step; each step ≤ 1 decision; requirements disclosed at step 1; crisis strip persistent (UX-020).
- **Post-booking (relieved, uncertain)**: confirmation content answers "what happens next" in 3 bullets max, links "Your first visit" (FR-015).

## Research Ethics Rules
- No user research that collects health status without explicit consent and a defined retention limit.
- Surveys never ask for diagnosis details; satisfaction and friction questions only.
- All research instruments are Tier 3 approvals (touch data collection).
