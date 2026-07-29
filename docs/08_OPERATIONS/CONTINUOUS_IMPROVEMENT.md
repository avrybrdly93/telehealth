---
title: Continuous Improvement
status: Active
authority: Operations
owner: Product
dependencies:
  - ANALYTICS_PLAN.md
  - ../06_PROJECT/BACKLOG.md
review_cycle: Quarterly
---

# Continuous Improvement

## The Loop (monthly, post-launch)

1. **Collect**: analytics KPIs (ANALYTICS_PLAN.md) · Search Console · vendor reconciliation numbers · contact-form question themes (summarized, no personal details) · weekly-review findings · patient-reported friction relayed by clinical ops.
2. **Diagnose**: for each KPI off-target, write a one-paragraph hypothesis referencing the journey stage (PATIENT_JOURNEY.md) and persona affected. Guessing is fine; label confidence.
3. **Propose**: convert top 3 hypotheses into backlog items via FEATURE_TEMPLATE.md with an explicit success metric and measurement window.
4. **Prioritize**: founders order them against roadmap work (human step).
5. **Verify**: after each shipped improvement's window, record outcome (improved/neutral/worse) in the item and this file's log. Worse → revert (deploys are revertible) and log learning.

## Improvement Principles
- One meaningful change per funnel step per measurement window — otherwise attribution is noise. No formal A/B infrastructure in MVP (traffic too low; sequential measurement instead).
- Trust metrics veto conversion metrics: a change that raises handoffs but violates COPY_GUIDELINES/UX-021 (e.g., urgency copy) is rejected regardless of numbers.
- Crisis-resource engagement is never an optimization target (ANALYTICS_PLAN.md).
- Copy/UX changes to pricing, clinical claims, providers remain Tier 3 even as "optimizations".

## Improvement Log
_(append entries: date · change · hypothesis · result)_

## Assumption Validation Tracker
RA-001…RA-004 from UX_RESEARCH_AND_PATIENT_JOURNEY.md reviewed at month 1 and month 3; outcomes recorded here; personas/journey docs updated (Tier 2) if falsified.
