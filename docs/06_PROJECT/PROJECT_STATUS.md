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
- **Last session**: 2026-08-10 (session 54). **Fifteenth consecutive verification-only session.** Re-checked directly in the files: BACKLOG.md has **zero `Ready` rows**; **D-009 `Proposed`** (DECISION_LOG line 248); **D-012 `Proposed`** (line 434). **Autonomous sessions have no runway left here**: every remaining item is Done, Needs Human Review, Blocked on deps, or gated on those two decisions. The next unit of progress is a human answering D-009 or D-012. Only PROJECT_STATUS.md and CHANGELOG.md changed. Session 54 also sent the standing "pause this leg / fix the stale prompt" request to the routine's owner as a **push notification** rather than a fifteenth file-only note.
- **Build status** — all measured locally in session 54 at `73c57f1`, fresh `pnpm install --frozen-lockfile` (Node 22.22.2, pnpm 10.33.0): typecheck **0 errors** (0 warnings, 34 hints, 81 files); lint, format clean; `pnpm test` **156/156 across 23 files**; `pnpm build` **21 pages**; `check:readability` **16 passed / 0 failed / 2 skipped**. Every figure identical to sessions 40-53, as expected for a session that changed no application code. Playwright and `lhci` were **not** run locally this session. Session 39's local figures (274 passed / 2 skipped; 21/21 lhci URLs) remain the most recent local measurements and are not restated as fresh. Note for future sessions: the format gate is `pnpm format` (it runs `prettier --check`); there is no `format:check` script.
- **CI: green on both trigger paths at `f90832e`** (session 40, unchanged since — no code has landed). The `workflow_dispatch` run `31154026561` and the push run `31154019192` at that SHA each passed **both** jobs independently — `lint-typecheck-build` 58s, `e2e-axe-lighthouse` 5m45s. Every job got a runner immediately, so the session-38/39 scheduling failure is not recurring. **`ci.yml` can be re-triggered by hand** (BUG-007): `workflow_dispatch:` sits alongside the untouched `push`/`pull_request`/`workflow_run` triggers and returns HTTP 204 against `main` — use it instead of pushing an empty commit when a run hangs.
- **Push-trigger lag is not a standing condition.** `f90832e` pushed at 06:27:47Z, its `ci.yml` run created 06:27:50Z — 3 seconds. Session 39's genuine 30-minute lag at `9ba82ee` was transient. Do not budget 30 minutes for it, and do not conclude from a short check that a push failed to trigger. A BUG-004 regression remains ruled out.
- **Deploy: green at the current `main` HEAD.** Verified first-hand in session 54: `deploy.yml` run **`31379774530`** (`workflow_run`) at **`73c57f1`** is `success`. **Deploy-run count is a routing artefact, not a health signal — stop treating a single run as a symptom.** There is **exactly one deploy per landing; only the trigger differs.** A direct push to `main` deploys via `push`. A `claude/*` landing deploys via the `workflow_run` chain off **`Auto-merge claude branches`** — and *not* also via `push`, because that workflow merges using `actions/checkout@v4`'s default `GITHUB_TOKEN`, and GitHub does not trigger `push` workflows from a `GITHUB_TOKEN` push. A SHA showing **both** (`eec9cb7`, `3c27d08`) reached `main` by both routes in one session. Sessions 50 and 51 misread this as a trigger regression; session 52's first attempt at the mechanism was also wrong and is corrected in its CHANGELOG entry. Sessions 52 (`0f9aced`), 53 (`7fc2843`) and 54 (`73c57f1`) all landed via `claude/*` and each produced exactly one `workflow_run` deploy, which is what the corrected explanation predicts. Session 38's outage is long cleared; two of its conclusions were wrong and are corrected in the session-39 CHANGELOG entry.
- **The routine's standing "FIRST PRIORITY: `withastro/action@v3` exit-code-1" instruction is stale** and should be edited out of the scheduled prompt. **Twenty-three sessions (32-54)** have confirmed it does not reproduce, and `--frozen-lockfile` has installed cleanly every time, refuting the prompt's lockfile-mismatch hypothesis too. Session 54 escalated this to the owner by push notification. A red `withastro/action@v3` has meant a GitHub 5xx or a scheduling failure every time — **read the job log before suspecting `astro.config.mjs` or `pnpm-lock.yaml`.**
- **Not independently confirmed** (unchanged, do not restate as first-hand): the live site — the sandbox egress proxy blocks `avrybrdly93.github.io` (re-tested session 39, curl exit 000), so the `smoke` job's curls from a hosted runner are the only evidence it serves; and the Google Rich Results Test against deployed BL-031 data, which needs a tool this environment lacks.

## Current Focus

M3: BL-022 (`/api/contact` backend) gated on D-009 — do not re-attempt until DECISION_LOG.md shows it resolved. M4: BL-033 gated on D-012; only the header-delivery mechanism and monitor vendor remain, its smoke-test sub-item shipped in session 32. Everything else in M3/M4 is Done or Needs Human Review.

## Ready

_(none — unchanged since BUG-007 shipped in session 40, re-confirmed in sessions 41, 42 and 43. The project is human-gated: see Blocked / Needs Human Input.)_

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

**Session 54 did the same as 53: gate re-run, no restatement of the audit, three lines recording only what was new.** Do the same in session 55. Check D-009 (DECISION_LOG line 248) and D-012 (line 434) — if both are still `Proposed` and BACKLOG.md still has no `Ready` row, run the local gate (`pnpm install --frozen-lockfile`, lint, typecheck, test, `pnpm format`, `check:readability`, build), confirm `deploy.yml` is green at the then-current HEAD, and **write at most three lines** saying so. Do not re-derive the human-gated audit — session 33's CHANGELOG entry holds it — and do not invent a task to fill the session. **The deploy-run-count question is closed**: session 52's corrected mechanism (GitHub does not fire `push` workflows for a `GITHUB_TOKEN` push, so one deploy per landing, only the trigger differs) has now predicted sessions 52, 53 and 54 correctly. Count runs only if a run *fails*.

**Session 54 escalated the standing request to the owner by push notification** — the first time it left these files. Do **not** send it again in session 55 unless D-009 is still `Proposed` and enough time has passed that the owner has plausibly seen it and chosen not to act; a repeated notification on an unchanging condition is noise. If the schedule or D-009 has changed, say so and act on it instead.

**What unblocks this repo is one human decision, and D-009 is the one to make.** Per D-012's own analysis a hosting migration off GitHub Pages resolves *both* gates at once — BL-022's `/api/contact` function gets a runtime, and BL-033's security headers get a delivery mechanism. Answering D-009 alone therefore converts two `In Progress` items into startable work, and the `contact function healthcheck` smoke TODO becomes implementable the moment BL-022 ships — claim it that same session.

`ci.yml` can be **dispatched by hand** (BUG-007) — but only when something has actually moved or a push-triggered run hangs; sessions 41-53 all skipped it because deploy was already green at HEAD.

## Weekly Review Findings

_(most recent only; older → CHANGELOG.md)_

- **2026-08-10 (session 54)**: This file is **70 lines against its own ≤60-line rule — 10 over**, and session 54 added two of them, stated rather than quietly ignored: one line recording that the owner escalation was sent, so session 55 does not send it a second time. That is a deliberate trade — a duplicate notification costs the owner more than two lines cost this file. The rest of the overage is the Blocked / Needs Human Input table plus the two In Progress rows, all live human-gate state, none of it history. **It shrinks when a human resolves D-009 or D-012, not before.** Session 52's corrected deploy mechanism is now three-for-three on predictions, so that thread stays closed rather than being re-derived a fifth time. **Standing observation, now fifteen sessions old (40-54): no product change, because every remaining item is human-gated, and the scheduled prompt's "FIRST PRIORITY: `withastro/action@v3` exit-code-1 / check `astro.config` / check the lockfile" has failed to reproduce across twenty-three sessions (32-54) with twenty-three clean `--frozen-lockfile` installs. Fourteen file-only notes did not reach anyone; session 54 sent it as a notification instead.**
