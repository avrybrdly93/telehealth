---
title: Maintenance Plan
status: Active
authority: Operations
owner: Engineering
dependencies:
  - ../04_ENGINEERING/DEPLOYMENT_AND_OPERATIONS_PLAN.md
  - ../05_SECURITY/SECURITY_AND_COMPLIANCE_PLAN.md
review_cycle: Quarterly
---

# Maintenance Plan

Target: < 2 staff-hours/week of human ops (BG-005); agent sessions absorb routine maintenance.

## Recurring Tasks

| Cadence | Task | Owner |
|---|---|---|
| Weekly (agent, review session) | Full test/axe/LHCI run on production; dependency audit scan; 404-log scan; doc-drift check | Agent (REVIEW_PROCESS.md) |
| Weekly (human, 15 min) | Skim PROJECT_STATUS + approve/reject pending Tier 3 proposals; confirm contact form test message arrived | Founders |
| Monthly (agent) | Dependency patch/minor updates per tier rules; link checker over all routes; sitemap/Search Console error review | Agent |
| Monthly (human) | KPI review (CONTINUOUS_IMPROVEMENT loop); vendor reconciliation; RISK_REGISTER re-score | Founders |
| Quarterly | Rotate email API key + audit platform/repo access & 2FA; verify license/credential info still accurate on bios; review all docs marked Quarterly | Founders + agent |
| Annually | Domain/TLS auto-renew verification; accessibility manual re-audit (screen readers, Flows 1–2); legal pages counsel review | Founders |

## Content Freshness Rules
- Prices, policies, provider info: single-sourced in practice.ts/content — human notifies via a Tier 3 change request; agent implements same-day.
- Condition-page statistics rechecked at each quarterly cycle (CONTENT_STRATEGY sourcing rules).
- Any provider status change (license, new provider, departure) = same-day site update, launch-blocker severity.

## Dependency Policy
Patch weekly (Tier 1, auto) · minor monthly (Tier 2 logged) · major on evaluation (Tier 3). CI vuln gate: high/critical fails build → immediate patch session regardless of schedule.

## Offboarding / Access Checklist
Remove: repo, hosting, analytics, email provider, uptime monitor, GBP, domain registrar. Rotate: email API key, any shared secrets. Verify in quarterly access audit.

## Ops Log
_(agent appends notable maintenance events: incidents, major updates, rotations)_
