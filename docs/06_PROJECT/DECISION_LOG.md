---
title: Decision Log
status: Active
authority: Project
owner: Founders
dependencies:
  - ../00_AI_OPERATING_SYSTEM/DECISION_FRAMEWORK.md
review_cycle: Monthly
---

# Decision Log

Append-only. Use ../../templates/DECISION_TEMPLATE.md. IDs sequential D-xxx. Statuses: Proposed (Tier 3 awaiting human) · Approved · Rejected · Superseded (link successor).

---

## D-001 — Static-first architecture with single serverless function
- Date: 2026-07-29 · Tier: 2 · Status: Approved (documented at repo creation)
- Context: MVP is a marketing site; PHI must be structurally impossible; solo-dev economics.
- Decision: Astro static output + one contact function; no database (ARCHITECTURE.md).
- Alternatives: Next.js SSR (more surface, no benefit at this scale); WordPress (plugin/security drag, weak fit for typed content + agent workflow).
- Consequences: some Phase 2 features will require new infrastructure — accepted; the Phase 1→2 gate covers it.

## D-002 — Cookieless privacy-focused analytics only
- Date: 2026-07-29 · Tier: 3 · Status: Approved (founder direction at repo creation)
- Context: psychiatry-site visits are sensitive (PRIVACY_MODEL.md); ad pixels create inference risk and consent-banner friction.
- Decision: aggregate cookieless analytics; no ad platforms; NFR-004 codified.
- Consequences: no retargeting-based acquisition; accepted — organic + trust strategy instead (SEO_STRATEGY.md).

## D-003 — Booking identity data deferred entirely to vendor
- Date: 2026-07-29 · Tier: 3 · Status: Approved (founder direction at repo creation)
- Context: earliest-possible handoff keeps the site outside PHI scope (DATA_BOUNDARIES B2).
- Decision: our flow collects service, optional provider, three acknowledgments — nothing else (FR-020…023).
- Consequences: less funnel telemetry after handoff; mitigated via vendor-side reporting (ANALYTICS_PLAN.md §handoff).

---
_(new entries appended above this line's section by date, newest first within the list)_
