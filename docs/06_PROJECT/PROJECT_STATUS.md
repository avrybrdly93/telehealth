---
title: Project Status
status: Active
authority: Project
owner: Engineering
dependencies:
  - BACKLOG.md
  - CHANGELOG.md
review_cycle: Every session
---

# Project Status

> Updated by the agent at the END of every session (EXECUTION_LOOP.md Phase 5). This file is the first thing every session reads. Keep it under 60 lines: current truth only — history lives in CHANGELOG.md.

## Snapshot

- **Phase**: M1/M2 done. M3 — `/book` Steps 1-4 Done (BL-035/036/037/021); BL-022 (`/api/contact` backend) is the only M3 gap, gated on D-009. M4 — BL-030/031/018 Done; BL-032 Needs Human Review; BL-033 gated on D-012. BUG-001…006 Done.
- **Last session**: 2026-08-07 (session 40). **Shipped BUG-007** — `ci.yml` now carries `workflow_dispatch`, proven by dispatching it, not by reading the YAML. First backlog item shipped since session 32; BACKLOG.md now has **no `Ready` row** again. D-009 (DECISION_LOG line 248) and D-012 (line 434) both still `Proposed`.
- **Build status** — all measured locally in session 40 at `f90832e`, fresh `pnpm install --frozen-lockfile` (Node 22.22.2, pnpm 10.33.0): typecheck **0 errors** (0 warnings, 34 hints); lint, format clean; `pnpm test` **156/156 across 23 files**; `pnpm build` **21 pages**; `check:readability` **16 passed / 0 failed / 2 skipped**. Playwright and `lhci` were **not** run locally this session — the hosted `e2e-axe-lighthouse` job ran them green twice at this exact SHA (see below), so local re-runs would have added no evidence. Session 39's local figures (274 passed / 2 skipped; 21/21 lhci URLs) are the most recent local measurements and are unchanged in the CHANGELOG.
- **`ci.yml` can now be re-triggered by hand — this is what BUG-007 fixed.** `workflow_dispatch:` sits alongside the untouched `push`/`pull_request`/`workflow_run` triggers. Dispatching against `main` returns HTTP 204 and produces a real run. Use this instead of pushing an empty commit whenever a CI run hangs or a job fails to get a runner.
- **Push-trigger lag did NOT reproduce this session — session 39's "~30 minutes late" is not a standing condition.** `f90832e` was pushed at 06:27:47Z; its `ci.yml` run (`31154019192`) was created at **06:27:50Z, 3 seconds later**. Session 39 measured a genuine 30-minute lag at `9ba82ee`; that was transient, not the norm. Still do not conclude from a short check that a push failed to trigger — but do not budget 30 minutes for it either. A BUG-004 regression remains ruled out for this repo.
- **CI: green, on both trigger paths, at `f90832e`.** The `workflow_dispatch` run `31154026561` (#66) passed **both** jobs — `lint-typecheck-build` 58s (all 11 steps), `e2e-axe-lighthouse` 5m45s (Playwright E2E + axe 49s, Lighthouse CI 3m58s). The push run `31154019192` at the same SHA also passed both jobs independently. Every job got a runner immediately (`runner_id` non-zero on all four), so the session-38/39 scheduling failure is not recurring.
- **Deploy**: green. **The GitHub Actions outage of session 38 has cleared** — `deploy.yml` run `31128915877` at `49e7071` was all-green first attempt in 55s (build 25s, deploy 7s, smoke 3/3). Two of session 38's conclusions were wrong and are corrected in the session-39 CHANGELOG entry: its `deploy.yml` run had not failed (its `build` job passed; the `deploy` job hung in status `waiting` for 6h09m and was cancelled by session 39), and `ci.yml` was **not** "green throughout" — its last three runs concluded `failure`, always because the `e2e-axe-lighthouse` job never got a runner, never because of repo code.
- **The routine's standing "FIRST PRIORITY: `withastro/action@v3` exit-code-1" instruction is stale** and should be edited out of the scheduled prompt. Eight sessions (32-39) have confirmed it does not reproduce; in session 39 that step passed in 22-23s on two separate runs. A red `withastro/action@v3` has meant a GitHub 5xx or a scheduling failure every time — **read the job log before suspecting `astro.config.mjs` or `pnpm-lock.yaml`.**
- **Not independently confirmed** (unchanged, do not restate as first-hand): the live site — the sandbox egress proxy blocks `avrybrdly93.github.io` (re-tested session 39, curl exit 000), so the `smoke` job's curls from a hosted runner are the only evidence it serves; and the Google Rich Results Test against deployed BL-031 data, which needs a tool this environment lacks.

## Current Focus

M3: BL-022 (`/api/contact` backend) gated on D-009 — do not re-attempt until DECISION_LOG.md shows it resolved. M4: BL-033 gated on D-012; only the header-delivery mechanism and monitor vendor remain, its smoke-test sub-item shipped in session 32. Everything else in M3/M4 is Done or Needs Human Review.

## Ready

_(none — BUG-007 shipped in session 40. The project is human-gated again: see Blocked / Needs Human Input.)_

## In Progress

| Item | Next step |
| --- | --- |
| BL-022 | D-009 (Tier 3, Proposed) needs a human to name a hosting platform + email vendor. Once resolved: stand up the function against `ContactForm.client.ts`'s existing `fetch('/api/contact', {method:'POST', …})` call (no client rework expected), add server-side rate limiting, verify real delivery, flip to Done. Page, form UI, validation, honeypot, success/failure states and submit-outcome analytics are all shipped and tested. |
| BL-033 | D-012 (Tier 3, Proposed) needs a human to pick a header-delivery mechanism (CDN/proxy in front of Pages, a hosting migration that would also resolve D-009, or accept the gap as documented residual risk) and an uptime-monitor vendor. Once resolved: deliver the missing `X-Content-Type-Options`/`X-Frame-Options`/`Permissions-Policy`/HSTS headers, stand up monitoring on `/` and `/book`, flip to Done. CSP + Referrer-Policy meta tags, e2e coverage and the smoke job are shipped. The deferred contact-function healthcheck needs BL-022 first. |

## Blocked / Needs Human Input

| Item | What's needed |
| --- | --- |
| **D-009** | Hosting platform + email vendor for `/api/contact`. Highest-leverage decision here — per D-012 a hosting migration would unblock both items at once. |
| **D-012** | Header-delivery mechanism + uptime-monitor vendor. |
| Practice constants | Real provider names, credentials, CA license numbers, prices, phone, email, domain, cancellation policy, accepted payment methods (fills `practice.ts` placeholders). |
| Provider bios | Approach statements (first-person, ≤150 words), education/training lists, bio body copy (fills `src/content/providers/*.md` NEEDS_HUMAN placeholders) — Tier 3. |
| Legal copy | Counsel-approved Privacy Policy, Terms, telehealth consent, Accessibility Statement — Tier 3; `src/content/legal/*.md` are placeholder shells (`reviewStatus: needs-human-review`). |
| FAQ content | `/faq`'s 13 Q&As are AI-drafted and need clinical/practice review before publish; cancellation-policy and payment-methods answers await the practice-constants row. |
| Vendor selection | Scheduling/intake/video vendor chosen + BAA signed (R-004) + booking URL format. |
| Provider photos | Professional photos per IMAGE_GUIDELINES.md. |
| Human review | BL-012, BL-015, BL-032. |

## Next Session

**BUG-007 is done, so the project is human-gated again.** Check DECISION_LOG.md for D-009 and D-012 first. If both are still `Proposed` and BACKLOG.md has no new `Ready` row, log "no completable item" here and in CHANGELOG.md and stop. Do not force a drive-by task, and do not re-derive the human-gated conclusion at length — session 33's CHANGELOG entry holds the full audit.

Verification-only sessions should still confirm the local gate (`pnpm install --frozen-lockfile`, lint, typecheck, test, format, `check:readability`, build) and may now **dispatch `ci.yml` by hand** for hosted signal — that escape hatch exists as of this session and did not before.

Queued behind decisions rather than judgement calls: the `contact function healthcheck` smoke TODO becomes implementable the moment BL-022 ships — claim it in that same session.

## Weekly Review Findings

_(most recent only; older → CHANGELOG.md)_

- **2026-08-06 (session 39)**: This file had grown to 163 lines against its own ≤60-line rule, most of it session-38 outage narrative that CHANGELOG.md already records in full. Compacted to current truth only — 163 lines down to 66, so **still 6 over the rule**, not silently "fixed"; the remaining overage is the Blocked table, which is all live human-gate state. Nothing was dropped that is not preserved in the session-37/38/39 CHANGELOG entries; the In Progress and Blocked tables are unchanged in substance.
