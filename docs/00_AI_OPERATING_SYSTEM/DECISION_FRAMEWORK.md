---
title: Decision Framework
status: Active
authority: Product
owner: Founders
dependencies:
  - PRINCIPLES.md
  - ../06_PROJECT/DECISION_LOG.md
review_cycle: Quarterly
---

# Decision Framework

## Purpose

Defines which decisions AI agents may make autonomously, which require human approval, and how all decisions are recorded.

## Decision Tiers

### Tier 1 — Autonomous (agent decides, logs in commit message)
- Implementation details within existing standards (naming, file organization, refactors under 200 lines).
- Bug fixes that restore documented behavior.
- Copy edits that fix typos or grammar without changing meaning.
- Test additions.
- Dependency patch updates (x.y.Z).

### Tier 2 — Autonomous with Decision Log entry (agent decides, records in ../06_PROJECT/DECISION_LOG.md using ../../templates/DECISION_TEMPLATE.md)
- New components not yet in ../03_DESIGN/COMPONENT_LIBRARY.md.
- Dependency minor updates (x.Y.z) or new dev dependencies.
- Refactors touching more than 3 modules.
- Performance trade-offs within budget (../04_ENGINEERING/PERFORMANCE_BUDGET.md).
- SEO/metadata changes consistent with ../07_MARKETING/SEO_STRATEGY.md.

### Tier 3 — Human approval required (agent proposes in DECISION_LOG.md with status "Proposed", stops work on that item)
- Anything touching pricing, clinical claims, provider bios, or legal pages.
- New runtime dependencies or framework changes.
- Any data collection beyond what DATA_BOUNDARIES.md permits.
- Scheduling vendor selection or changes.
- Scope additions/removals vs MVP_SCOPE.md.
- Anything affecting crisis-resource placement.
- Analytics/tracking changes (privacy implications).

## Decision Procedure

1. Classify the decision by tier. If ambiguous between tiers, use the higher tier.
2. Check PRINCIPLES.md ordering: safety > trust > effort-reduction > simplicity > extensibility.
3. Check the RISK_REGISTER (../05_SECURITY/RISK_REGISTER.md) for related risks.
4. Record per tier rules. Tier 3 items block only themselves — pick the next backlog item and continue.

## Conflict Resolution Hierarchy

When documents conflict, authority order is:
1. 05_SECURITY documents
2. 00_AI_OPERATING_SYSTEM documents
3. 01_PRODUCT documents
4. 02_UX and 03_DESIGN documents
5. 04_ENGINEERING documents
6. All others

Record every detected conflict in DECISION_LOG.md even after resolving it.
