---
title: Business Goals
status: Active
authority: Product
owner: Founders
dependencies:
  - PRODUCT_VISION.md
  - ../06_PROJECT/ROADMAP.md
review_cycle: Quarterly
---

# Business Goals

## Business Model (Phase 1)

- Self-pay outpatient psychiatry: intake evaluations and follow-up medication management, delivered via video to California residents.
- Two revenue-generating clinicians: 1 MD psychiatrist, 1 PMHNP.
- Superbills offered for out-of-network reimbursement (a document we provide; we do not bill insurers).

## Goals and Targets

| ID | Goal | Target | Horizon | Measured by |
|---|---|---|---|---|
| BG-001 | Fill provider calendars | 60% intake-slot utilization | 6 months post-launch | Scheduling system reports |
| BG-002 | Efficient acquisition | Visitor→booked conversion ≥ 2.5% | 6 months | Analytics funnel (ANALYTICS_PLAN.md) |
| BG-003 | Organic discovery | Page-1 ranking for 5 priority CA psychiatry queries | 9 months | ../07_MARKETING/SEO_STRATEGY.md keyword set |
| BG-004 | Retention foundation | Follow-up rebook rate ≥ 70% | 9 months | Scheduling system |
| BG-005 | Low operational drag | < 2 staff-hours/week on website ops | Ongoing | ../08_OPERATIONS/MAINTENANCE_PLAN.md log |
| BG-006 | Expansion readiness | Portal/insurance build can start without site rearchitecture | 12 months | Architecture review vs ../04_ENGINEERING/ARCHITECTURE.md |

## Constraints

- **Budget**: solo-developer economics. Prefer managed services with free/low tiers.
- **Regulatory**: California telehealth rules; providers practice only where licensed. Site must state California-only service clearly (FR-014).
- **Brand**: no discount pricing, coupon codes, or urgency tactics — conflicts with PRINCIPLES.md P2.

## Explicit Non-Goals (Phase 1)
- Insurance paneling and claims.
- Hiring/marketplace features for additional providers.
- Controlled-substance prescribing workflows or related content commitments.
- Native mobile apps.
