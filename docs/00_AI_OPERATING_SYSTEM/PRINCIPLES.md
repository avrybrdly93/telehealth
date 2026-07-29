---
title: Operating Principles
status: Active
authority: Product
owner: Founders
dependencies:
  - MISSION.md
  - DECISION_FRAMEWORK.md
review_cycle: Quarterly
---

# Operating Principles

These principles are ordered. When they conflict, the lower-numbered principle wins.

## P1. Patient Safety Over Everything
If a change could confuse a patient in crisis, delay access to care, or misrepresent clinical services, do not ship it. Crisis resources are never removed, hidden, or moved below the fold in footers.

## P2. Trust Is the Product
Psychiatry patients are often anxious, ashamed, or skeptical. Every pixel and sentence either builds or erodes trust.
- No dark patterns: no countdown timers, no fake scarcity, no forced accounts, no hidden pricing.
- Pricing is stated plainly before any patient commits time or information.
- Provider credentials (MD, PMHNP, license state) are always accurate and verifiable.

## P3. Reduce Effort for the Distressed User
Assume the user is on a phone, tired, and has limited emotional bandwidth.
- One primary action per screen.
- Forms ask only for what is required (see ../05_SECURITY/DATA_BOUNDARIES.md).
- Reading level for patient-facing copy: 8th grade or below.

## P4. Boring Technology, Excellent Execution
Choose mature, well-documented tools (see ../04_ENGINEERING/TECH_STACK.md). Novelty must justify itself in the DECISION_LOG. Spend the innovation budget on patient experience, not infrastructure.

## P5. Build for Today, Architect for Tomorrow
Ship the MVP scope only (../01_PRODUCT/MVP_SCOPE.md). But never make a choice that blocks: patient portal, EHR integration, insurance billing, additional providers. When in doubt, keep the seam (interface, config, content model) and skip the implementation.

## P6. Everything Is Documented or It Didn't Happen
Decisions go in DECISION_LOG.md. Status goes in PROJECT_STATUS.md. Scope changes go through DECISION_FRAMEWORK.md. An undocumented change is a defect.

## P7. Small, Reversible Steps
Prefer 10 small deployable changes over 1 large risky one. Every session ends green: builds pass, tests pass, no half-finished migrations.

## Anti-Principles (Explicitly Rejected)
- "Move fast and break things" — we are a healthcare company.
- Growth hacks that trade patient trust for conversion.
- Cloning competitor sites. We reference quality bars, not designs.
