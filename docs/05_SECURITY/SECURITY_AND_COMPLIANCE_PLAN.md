---
title: Security and Compliance Plan
status: Active
authority: Security
owner: Founders
dependencies:
  - DATA_BOUNDARIES.md
  - PRIVACY_MODEL.md
  - RISK_REGISTER.md
review_cycle: Quarterly
---

# Security and Compliance Plan

## Compliance Posture — the honest framing

**Phase 1 (this MVP)**: the website is a public marketing site that, by design, collects no PHI and creates no treatment relationship. HIPAA obligations attach to the practice's clinical operations and its vendors — not to this static site — *provided the boundaries in DATA_BOUNDARIES.md hold*. We therefore do NOT build HIPAA infrastructure (audit logging, encryption-at-rest schemes, access controls for patient records) into the MVP. We DO build the boundaries that keep the site out of PHI scope, and we treat those boundaries as security-critical.

**Phase 2+ (portal, messaging, EHR integration)**: any feature touching PHI triggers the full program: BAAs for every vendor in the data path, risk analysis, access controls, audit logging, encryption at rest, retention schedules, breach procedures. That program is designed when Phase 2 begins — see ROADMAP.md gate — not speculatively now.

## Practice-level obligations the website depends on (tracked, not built here)
- Signed BAA with the scheduling/intake/video vendor before launch (launch blocker; verify in MVP acceptance).
- Signed BAA with the transactional email provider **only if** contact-form policy ever changes to accept clinical content — current policy forbids it (DATA_BOUNDARIES.md), so a standard provider is acceptable with the no-medical-details labeling (FR-030).
- Telehealth consent handled in the vendor intake flow; our site links an informational overview (FR-040).

## Website Security Controls (Phase 1, implemented)

| Control | Detail |
|---|---|
| Transport | HTTPS everywhere, HSTS (includeSubDomains), TLS via platform |
| Headers | CSP (default-src 'self' + explicit analytics/vendor allowances), X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy denying camera/mic/geolocation, X-Frame-Options: DENY |
| Attack surface | Static pages; one serverless function (contact) with input validation, payload size limit, rate limiting, and no persistence |
| Spam/abuse | Honeypot field + serverless rate limit; no CAPTCHA in MVP (accessibility cost) — revisit if abused (Tier 2) |
| Secrets | Platform env vars only; secret-scan in CI; documented rotation |
| Supply chain | Lockfile, pinned Node, dependency update tiers (TECH_STACK.md), CI audit for known-vuln packages (fail on high/critical) |
| Access | Repo + hosting accounts: 2FA mandatory, least privilege, offboarding checklist in MAINTENANCE_PLAN.md |

## Incident Response (privacy/security)
1. Contain (rollback deploy / disable function / rotate secret). 2. Assess whether any personal data was exposed (contact submissions in transit are the only candidate). 3. If personal data exposure is plausible → notify founders immediately; founders own legal notification obligations (CCPA/CMIA counsel) — the agent never makes notification decisions. 4. Post-incident: RISK_REGISTER.md update + bug with root cause.

## Standing Rules for Agents
- 05_SECURITY docs are read-only to agents (EXECUTION_LOOP.md); propose changes via DECISION_LOG.md.
- Any feature idea that would collect, store, or transmit new personal data is Tier 3 before any code exists.
