---
title: Risk Register
status: Active
authority: Security
owner: Founders
dependencies:
  - SECURITY_AND_COMPLIANCE_PLAN.md
review_cycle: Monthly
---

# Risk Register

Scoring: Likelihood × Impact, 1–5 each. ≥ 12 = mitigation required before launch; 6–11 = mitigation planned; ≤ 5 = accepted with review. Agents may add risks (Tier 2) but never downgrade scores (Tier 3).

| ID | Risk | L | I | Score | Mitigation | Status |
|---|---|---|---|---|---|---|
| R-001 | Site copy drifts into medical advice / outcome claims → patient harm + liability | 3 | 5 | 15 | COPY_GUIDELINES hard rules; Tier 3 human review for clinical copy; banned-phrase list check in CI | Mitigating |
| R-002 | Person in crisis enters booking funnel instead of reaching 988 | 2 | 5 | 10 | UX-020/FR-024 persistent crisis resources; anti-persona routing (Flow 4); "not for emergencies" at step 1 | Mitigating |
| R-003 | Scope creep quietly adds PHI collection (e.g., "reason for visit" box) | 3 | 5 | 15 | DATA_BOUNDARIES enforcement CI check; Tier 3 gate on any new field | Mitigating |
| R-004 | Vendor BAA not executed before launch | 2 | 5 | 10 | MVP acceptance checklist item; launch blocker | Open until signed |
| R-005 | Scheduling vendor outage strands motivated patients | 3 | 3 | 9 | E-020 fallback with phone booking path; uptime monitoring; phone visible sitewide (FR-032) | Mitigating |
| R-006 | Inaccurate credentials/license info published | 2 | 5 | 10 | Single-source constants module; Tier 3 review; launch verification against license board records (human) | Mitigating |
| R-007 | Analytics/3rd-party script leaks visitor health-implying data | 2 | 4 | 8 | Cookieless analytics only; CSP allowlist; Boundary 4/5 checks | Mitigating |
| R-008 | Contact form abused (spam/injection) | 4 | 2 | 8 | Validation, rate limit, honeypot, size caps, no persistence | Mitigating |
| R-009 | Solo-dev bus factor: only founders + agent understand system | 3 | 3 | 9 | This documentation repo; weekly review keeps docs true | Mitigating |
| R-010 | SEO content generated at scale becomes thin/inaccurate | 3 | 4 | 12 | Condition pages require provider (human) review before publish — Tier 3; quality bar in CONTENT_STRATEGY.md | Mitigating |
| R-011 | Out-of-state visitor books, discovers ineligibility late | 3 | 3 | 9 | FR-014 placement rules; FR-022 acknowledgment step | Mitigating |
| R-012 | Dependency/supply-chain vulnerability | 3 | 3 | 9 | CI audit gate, update tiers, lockfile | Mitigating |

## Register Maintenance
Reviewed in the weekly consistency review (quick scan) and monthly (full re-score, human). New incidents always add or update a row. Closed risks move to an archive section with closure rationale, never deleted.
