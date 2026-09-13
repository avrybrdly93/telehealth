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

**Reading a red `deploy.yml` run (BL-045).** A red run has two meanings and they call for opposite responses:

| What you see | What it means | First response |
| --- | --- | --- |
| `build` or `deploy` red | The site did **not** deploy. The previous commit is still being served. | Diagnose. Start with the failing job's log. |
| `deploy` green, `smoke` red | The site is **live but unverified** — `actions/deploy-pages@v4` returned success, so the commit is being served; only the post-deploy check is missing. | **Re-run the failed job.** Do not open `astro.config.mjs` or `pnpm-lock.yaml`. |

Before diagnosing any red job, check whether it actually ran: a job that ran and failed has a `steps` array, a `runner_id` and a log; a job that never acquired a runner has none of the three and its log endpoint returns **HTTP 404** rather than an empty log. Run 184 (`6a40066`) was the second kind — 15 m 15 s, zero steps, no runner — and re-running that one job passed all three checks in 2 s against the same live site. The `smoke` job carries `timeout-minutes: 5` so a repeat fails in single-digit minutes; the checks themselves take ~2 s, so the timeout bounds *scheduling*, not the work. **`continue-on-error` is not an acceptable alternative** — it would green the badge and let a genuine homepage 404 deploy silently.

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
