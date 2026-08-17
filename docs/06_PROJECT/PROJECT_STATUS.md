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
- **Last session**: 2026-08-17 (session 73). **Thirty-fourth consecutive verification-only session.** Re-checked directly in the files: `grep -c '| Ready |' BACKLOG.md` returns **0**; **D-009 `Proposed`** (line 247, 2026-08-01, 16 days) and **D-012 `Proposed`** (line 433, 2026-08-03, 14 days) — day counts unchanged from session 72 because that session ran on this same date. Nothing claimable, so nothing claimed. Gate green at `5e8372d` (install `--frozen-lockfile` clean in 11.2s; typecheck **0 errors / 34 hints across 81 files**; test **156/156 across 23 files**; readability **16/0/2**; build **21 pages**). `deploy.yml` run **106** at `5e8372d` is `success`; runs **99-106** zero non-success. **No control branch pushed here** — a cross-repo write-permission question arose this run and was deliberately not tested against this repository, per session 72's instruction. Only this file and CHANGELOG.md changed. Carried forward from session 72 and still true: the scheduled routine's step 3 ("claim exactly one backlog item before writing code") is **vacuous with no `Ready` row**, and manufacturing a claim to satisfy it is the invented work this file has told 18 sessions not to do. **Autonomous sessions have no runway left here** — every remaining item is Done, Needs Human Review, Blocked on deps, or gated on D-009/D-012, so the next unit of progress is a human answering one of them. **The owner escalation is closed**: sessions 54 and 56 sent it on separate dates, sessions 57-73 sent no third, and no later session should.
- **Build status** — all measured locally in session 73 at `5e8372d`, fresh `pnpm install --frozen-lockfile` (Node 22.22.2, pnpm 10.33.0, clean in 11.2s): typecheck **0 errors** (0 warnings, 34 hints, 81 files); lint, format clean; `pnpm test` **156/156 across 23 files**; `check:readability` **16 passed / 0 failed / 2 skipped**; `pnpm build` **21 pages** in 4.11s. Every figure identical to sessions 40-72 except install and build wall-clock, which are container-speed artefacts and not signal. Playwright and `lhci` were **not** run in session 73; session 39's figures (274 passed / 2 skipped; 21/21 lhci URLs) remain the most recent measurements and are not restated as fresh. Note for future sessions: the format gate is `pnpm format` (it runs `prettier --check`); there is no `format:check` script.
- **Fetch `main` by itself.** `git fetch origin main claude/<branch>` **aborts entirely** — the session's `claude/*` branch is deleted from the remote after auto-merge, and git fails the whole fetch on the bad refspec, leaving `origin/main` at the stale clone value. Session 64 hit this and it reads exactly like six sessions of unpushed commits; `git fetch origin main` alone showed `origin/main..HEAD` empty. Do not conclude work is unpushed from an aborted multi-refspec fetch.
- **CI: green on both trigger paths at `f90832e`** (session 40, unchanged since — no code has landed). The `workflow_dispatch` run `31154026561` and the push run `31154019192` at that SHA each passed **both** jobs independently — `lint-typecheck-build` 58s, `e2e-axe-lighthouse` 5m45s. Every job got a runner immediately, so the session-38/39 scheduling failure is not recurring. **`ci.yml` can be re-triggered by hand** (BUG-007): `workflow_dispatch:` sits alongside the untouched `push`/`pull_request`/`workflow_run` triggers and returns HTTP 204 against `main` — use it instead of pushing an empty commit when a run hangs.
- **Push-trigger lag is not a standing condition.** `f90832e` pushed at 06:27:47Z, its `ci.yml` run created 06:27:50Z — 3 seconds. Session 39's genuine 30-minute lag at `9ba82ee` was transient. Do not budget 30 minutes for it, and do not conclude from a short check that a push failed to trigger. A BUG-004 regression remains ruled out.
- **Deploy: green at the current `main` HEAD.** Verified first-hand in session 73: at **`5e8372d`** `deploy.yml` run **106** is `success`, and runs **99-106** hold **zero non-success**. Run 106 is session 72's own docs landing arriving via the `workflow_run` chain — one deploy for one landing, as predicted. Session 71 caused run 104 as a cross-repo credential control and should not have; **sessions 72 and 73 did not repeat it.** Session 73 faced the same temptation — a genuine 403 on another repository — and used `git push --dry-run` elsewhere instead, which creates no ref and triggered nothing here. **Do not run cross-repo credential tests against this repository.** **Deploy-run count and trigger path are routing artefacts, not health signals.** There is **exactly one deploy per landing; only the trigger differs.** A direct push to `main` deploys via `push`. A `claude/*` landing deploys via the `workflow_run` chain off **`Auto-merge claude branches`** — and *not* also via `push`, because that workflow merges using `actions/checkout@v4`'s default `GITHUB_TOKEN`, and GitHub does not trigger `push` workflows from a `GITHUB_TOKEN` push. A SHA showing **both** (`eec9cb7`, `3c27d08`) reached `main` by both routes in one session. Sessions 50 and 51 misread this as a trigger regression; session 52's first attempt at the mechanism was also wrong and is corrected in its CHANGELOG entry. Session 58's extra run at `3b3527b` came from its own empty second landing, not a second route — do not investigate it. Session 66's `push`-where-`workflow_run`-was-predicted caveat was closed in session 68 and the `CI_MERGE_PAT` check is **not** needed; do not reopen it. Session 38's outage is long cleared; two of its conclusions were wrong and are corrected in the session-39 CHANGELOG entry.
- **The routine's standing "FIRST PRIORITY: `withastro/action@v3` exit-code-1" instruction is stale** and should be edited out of the scheduled prompt. **Forty-one sessions (32-73)** have confirmed it does not reproduce, and `--frozen-lockfile` has installed cleanly every time — 11.2s in session 73 — refuting the prompt's lockfile-mismatch hypothesis too. Session 54 escalated this to the owner by push notification and session 56 sent it a second and final time; the escalation channel is now closed; sessions 57-73 each sent no third. Session 73, like 64, 67, 70, 71 and 72, tested both of the prompt's hypotheses directly rather than inheriting the conclusion: the lockfile one is refuted by an 11.2-second clean `--frozen-lockfile` install, the `astro.config.mjs` one by `pnpm build` completing 21 pages, which a config syntax error could not do. A red `withastro/action@v3` has meant a GitHub 5xx or a scheduling failure every time — **read the job log before suspecting `astro.config.mjs` or `pnpm-lock.yaml`.**
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

**Sessions 53-73 all did the same: gate re-run, no restatement of the audit, three lines recording only what was new.** Do the same in session 74. Check D-009 (DECISION_LOG line 247) and D-012 (line 433) — if both are still `Proposed` and BACKLOG.md still has no `Ready` row, run the local gate (`pnpm install --frozen-lockfile`, lint, typecheck, test, `pnpm format`, `check:readability`, build), confirm `deploy.yml` is green at the then-current HEAD, and **write at most three lines** saying so. **Do not push an empty `claude/*` branch** — session 58 did for an unrelated reason and session 71 did it again as a cross-repo credential control; each cost a no-op landing plus a redundant deploy run. Session 72 did not, which is the pattern to keep. There is nothing to learn from repeating it, and a question about *another* repository is never a reason to write to this one. Do not re-derive the human-gated audit — session 33's CHANGELOG entry holds it — and do not invent a task to fill the session. **The deploy-run-count question is closed**: session 52's corrected mechanism has now predicted sessions 52-73 correctly. Count runs only if a run *fails*.

**The owner escalation is closed — send none.** Sessions 54 and 56 sent it on separate dates, sessions 57-71 correctly sent no third, and neither should any session after. The two asks stay on the record — edit the stale `withastro/action@v3` FIRST PRIORITY out of the scheduled prompt, and pause this leg until a human answers D-009 — but the lever is the owner's, not this session's. Recording the condition in the changelog line is the whole obligation.

**What unblocks this repo is one human decision, and D-009 is the one to make.** Per D-012's own analysis a hosting migration off GitHub Pages resolves *both* gates at once — BL-022's `/api/contact` function gets a runtime, and BL-033's security headers get a delivery mechanism. Answering D-009 alone therefore converts two `In Progress` items into startable work, and the `contact function healthcheck` smoke TODO becomes implementable the moment BL-022 ships — claim it that same session.

`ci.yml` can be **dispatched by hand** (BUG-007) — but only when something has actually moved or a push-triggered run hangs; sessions 41-70 all skipped it because deploy was already green at HEAD.

## Weekly Review Findings

_(most recent only; older → CHANGELOG.md)_

- **2026-08-15 (session 67)**: This file remains **over its own ≤60-line rule**; session 67 rewrote lines rather than adding them. The overage is still the Blocked / Needs Human Input table plus the two In Progress rows — live human-gate state, not history — and **it shrinks when a human resolves D-009 or D-012, not before.** **Standing observation, now twenty-eight sessions old (40-67): no product change, because every remaining item is human-gated, and the scheduled prompt's "FIRST PRIORITY: `withastro/action@v3` exit-code-1 / check `astro.config` / check the lockfile" has failed to reproduce across thirty-six sessions (32-67) with thirty-six clean `--frozen-lockfile` installs.** Session 67 re-tested both hypotheses directly rather than inheriting the conclusion, and again checked the last **30** `deploy.yml` runs: **zero non-success**. **The one new fact is a closure, not an opening:** session 66's unexplained `push` event is resolved — at `4021082` the event is `workflow_run` as the session-52 model predicts, so that was a one-off at a directly-pushed SHA and the `CI_MERGE_PAT` check session 66 proposed is unnecessary. Escalation stays closed; sessions 54 and 56 exhausted that channel and 57-67 correctly sent nothing. The remaining lever is the owner's.
