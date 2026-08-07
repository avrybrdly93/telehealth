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
- **Last session**: 2026-08-07 (session 41). **Verification-only — no item shipped, and none was claimable**, which is exactly what session 40's Next Session note prescribed. Checked directly in the files, not carried over: BACKLOG.md has **zero `Ready` rows**; **D-009 `Proposed`** (DECISION_LOG line 248); **D-012 `Proposed`** (line 434). BL-022/BL-033 are gated on those two, so neither is startable. Only PROJECT_STATUS.md and CHANGELOG.md changed.
- **Build status** — all measured locally in session 41 at `7024485`, fresh `pnpm install --frozen-lockfile` (Node 22.22.2, pnpm 10.33.0): typecheck **0 errors** (0 warnings, 34 hints, 81 files); lint, format clean; `pnpm test` **156/156 across 23 files**; `pnpm build` **21 pages**; `check:readability` **16 passed / 0 failed / 2 skipped**. Every figure identical to session 40's, as expected for a session that changed no application code. Playwright and `lhci` were **not** run locally this session — nothing changed that could move them. Session 39's local figures (274 passed / 2 skipped; 21/21 lhci URLs) remain the most recent local measurements and are not restated as fresh.
- **CI: green on both trigger paths at `f90832e`** (session 40, unchanged since — no code has landed). The `workflow_dispatch` run `31154026561` and the push run `31154019192` at that SHA each passed **both** jobs independently — `lint-typecheck-build` 58s, `e2e-axe-lighthouse` 5m45s. Every job got a runner immediately, so the session-38/39 scheduling failure is not recurring. **`ci.yml` can be re-triggered by hand** (BUG-007): `workflow_dispatch:` sits alongside the untouched `push`/`pull_request`/`workflow_run` triggers and returns HTTP 204 against `main` — use it instead of pushing an empty commit when a run hangs.
- **Push-trigger lag is not a standing condition.** `f90832e` pushed at 06:27:47Z, its `ci.yml` run created 06:27:50Z — 3 seconds. Session 39's genuine 30-minute lag at `9ba82ee` was transient. Do not budget 30 minutes for it, and do not conclude from a short check that a push failed to trigger. A BUG-004 regression remains ruled out.
- **Deploy: green at the current `main` HEAD.** Verified first-hand in session 41: `deploy.yml` run **`31154819837`** at **`7024485`**, all three jobs `success` — build 29s, deploy 10s, smoke **3/3** (homepage 200, sitemap.xml non-empty, `/book` Step 1 renders). Session 38's outage is long cleared; two of its conclusions were wrong and are corrected in the session-39 CHANGELOG entry.
- **The routine's standing "FIRST PRIORITY: `withastro/action@v3` exit-code-1" instruction is stale** and should be edited out of the scheduled prompt. **Nine sessions (32-41)** have confirmed it does not reproduce; in run `31154819837` that step passed **green in 19s**. A red `withastro/action@v3` has meant a GitHub 5xx or a scheduling failure every time — **read the job log before suspecting `astro.config.mjs` or `pnpm-lock.yaml`.**
- **Not independently confirmed** (unchanged, do not restate as first-hand): the live site — the sandbox egress proxy blocks `avrybrdly93.github.io` (re-tested session 39, curl exit 000), so the `smoke` job's curls from a hosted runner are the only evidence it serves; and the Google Rich Results Test against deployed BL-031 data, which needs a tool this environment lacks.

## Current Focus

M3: BL-022 (`/api/contact` backend) gated on D-009 — do not re-attempt until DECISION_LOG.md shows it resolved. M4: BL-033 gated on D-012; only the header-delivery mechanism and monitor vendor remain, its smoke-test sub-item shipped in session 32. Everything else in M3/M4 is Done or Needs Human Review.

## Ready

_(none — unchanged since BUG-007 shipped in session 40, re-confirmed in session 41. The project is human-gated: see Blocked / Needs Human Input.)_

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

**Unchanged by session 41.** Check D-009 (DECISION_LOG line 248) and D-012 (line 434) first. If both are still `Proposed` and BACKLOG.md has no new `Ready` row, log "no completable item" here and in CHANGELOG.md and stop — three file checks, under a minute. Do not force a drive-by task; session 33's CHANGELOG entry holds the full human-gated audit, so do not re-derive it.

Still confirm the local gate (`pnpm install --frozen-lockfile`, lint, typecheck, test, format, `check:readability`, build). `ci.yml` can be **dispatched by hand** (BUG-007) — but only when something has actually moved or a push-triggered run hangs; session 41 skipped it because deploy was already green at an unchanged HEAD.

**Two verification-only sessions running is a signal, not a routine.** If session 42 also finds nothing claimable, say plainly that autonomous sessions have no runway left here until a human resolves D-009 or D-012, rather than logging a third identical entry. Queued behind those decisions, not judgement: the `contact function healthcheck` smoke TODO becomes implementable the moment BL-022 ships — claim it that same session.

## Weekly Review Findings

_(most recent only; older → CHANGELOG.md)_

- **2026-08-07 (session 41)**: This file is **68 lines against its own ≤60-line rule — still 8 over**, stated rather than quietly ignored. Session 39 cut it from 163 to 66; session 41's edits would have taken it to 71, so three session-40 CI bullets were merged into two to claw most of that back. The residual overage is the Blocked / Needs Human Input table plus the two In Progress rows — all live human-gate state, none of it history. The next real reduction comes from a human resolving D-009 or D-012, not from more editing. Session 39's own finding is preserved in the session-39 CHANGELOG entry, per this section's "most recent only" rule.
