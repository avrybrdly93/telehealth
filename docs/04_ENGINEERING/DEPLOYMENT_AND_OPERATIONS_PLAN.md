---
title: Deployment and Operations Plan
status: Active
authority: Engineering
owner: Engineering
dependencies:
  - TECH_STACK.md
  - ../08_OPERATIONS/MAINTENANCE_PLAN.md
review_cycle: Quarterly
---

# Deployment and Operations Plan

## Environments

| Env | Branch | URL | Purpose |
|---|---|---|---|
| Preview | every PR | auto preview URL | Review, E2E against built preview |
| Production | main | apex domain | Live site |

No long-lived staging: previews + trunk-based flow suffice at this scale.

## Pipeline (GitHub Actions)
PR: lint → typecheck → unit → build → Playwright/axe/LHCI on preview → merge allowed only green.
main: build → deploy → post-deploy smoke (homepage 200, /book Step 1 renders, contact function healthcheck, sitemap reachable) → deploy marked failed and alerting if smoke fails.

## Release Rules
- Deploys are atomic (platform-native) and instantly revertible; **rollback = redeploy previous build**, target < 5 minutes, no rebuild required.
- Anything user-visible on pricing/providers/legal requires the Tier 3 approval recorded before merge.
- No deploys after a session that skipped Phase 5 close-out.

## Operational Configuration
- DNS + TLS via hosting platform; HTTPS enforced, HSTS on.
- Security headers per ../05_SECURITY/SECURITY_AND_COMPLIANCE_PLAN.md (CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) configured in platform config, tested by GLOBAL smoke.
- Secrets (email API key) only in platform env vars; never in repo; rotation procedure in MAINTENANCE_PLAN.md.

## Monitoring & Alerts
- Uptime check on / and /book every 5 min (external monitor) → email/SMS alert.
- Contact-function failure alert (platform function error notification).
- Weekly automated Lighthouse run on production, results logged for CONTINUOUS_IMPROVEMENT.md.

## Incident Response (site-level)
1. Confirm scope (uptime monitor + manual check). 2. Rollback first, diagnose second. 3. If contact form down > 1h: verify phone/email in header/footer still render (they're static — they should). 4. Log incident in PROJECT_STATUS.md + bug via BUG_TEMPLATE.md with root cause within 48h.
Privacy/security incidents follow ../05_SECURITY/SECURITY_AND_COMPLIANCE_PLAN.md instead.
