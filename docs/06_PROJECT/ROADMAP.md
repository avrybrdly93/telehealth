---
title: Roadmap
status: Active
authority: Product
owner: Founders
dependencies:
  - BACKLOG.md
  - ../01_PRODUCT/MVP_SCOPE.md
review_cycle: Quarterly
---

# Roadmap

## Phase 1 — MVP Launch (now)
Milestones M1–M4 in BACKLOG.md. Exit = MVP acceptance criteria in MVP_SCOPE.md all green. Estimated at the documented cadence (~5 agent sessions/day): M1 ≈ wk 1–2 · M2 ≈ wk 2–4 · M3 ≈ wk 4–5 · M4 ≈ wk 5–6, plus human-input latency (photos, legal copy, vendor BAA — see PROJECT_STATUS blocked list). Estimates are planning aids, not commitments.

## Phase 1.5 — Optimize (months 2–4 post-launch)
Driven by CONTINUOUS_IMPROVEMENT.md loops: funnel fixes, SEO content expansion (condition pages beyond initial 3, per CONTENT_STRATEGY quality gate), local-search buildout, copy iteration from patient feedback. No new systems.

## Phase 2 — Patient Convenience (trigger: BG-001 utilization + founders' go)
Candidates (each begins with its own spec + security review — see gate below): patient portal (visit history, superbill downloads) · secure messaging via vendor or compliant service · online rebooking deep links · Spanish localization.

## Phase 3 — Growth (trigger: Phase 2 stable + provider capacity)
Insurance support (eligibility info → billing workflows) · additional providers (content model already supports N providers) · group/therapy service lines · expanded intake automation.

## Hard Gate Between Phase 1 and Phase 2
Before ANY PHI-touching feature: (1) SECURITY_AND_COMPLIANCE_PLAN.md Phase-2 program designed and human-approved; (2) vendor BAA coverage mapped for the new data path; (3) DATA_BOUNDARIES.md formally revised (Tier 3); (4) RISK_REGISTER re-scored. No exceptions; an agent asked to build portal features before this gate must refuse and cite this section.

## Standing Sequencing Rules
- SEO content expansion never outruns human clinical review capacity (R-010).
- New service lines require TELEHEALTH_SPECIFICATION.md update first, code second.
