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
- **Phase**: M1/M2 done. M3 Booking & Contact — **`/book` Steps 1-4 all Done** (BL-035/036/037/021,
  sessions 28-31) — the full Flow 1 booking UI is built end-to-end; BL-022 In Progress (blocked on
  D-009) is the only remaining M3 gap (real `/api/contact` backend). M4 SEO & Launch — underway:
  BL-030/BL-031/BL-018 Done; BL-032 Needs Human Review; BL-033 In Progress (blocked on D-012).
  BUG-005/006 Done.
- **Last session**: 2026-08-06 (session 38) — **no completable item; nothing shipped, no code
  changed.** Seventh consecutive such session. Short orient per session 33's instruction: D-009
  (DECISION_LOG line 248) and D-012 (line 434) both still `Proposed`; a count of `Ready`-status rows
  across BACKLOG.md returns **0**, so the protocol's "top unblocked Ready item" rule has nothing to
  select. Verified anyway at HEAD `f312317` from a fresh `pnpm install --frozen-lockfile`:
  typecheck 0 errors (0 warnings, 34 hints), lint/format clean, `pnpm test` 156/156 across 23 files,
  `pnpm build` 21 pages, `check:readability` 16 passed / 0 failed / 2 skipped — matching this file
  exactly, no drift. Did **not** re-escalate to the operator: session 37's push notification named
  D-009/D-012 and nothing in the blocking picture has changed, so an identical eight-hourly alert
  would only erode the channel. Re-notify only when something moves — a decision resolves, a new
  `Ready` row appears, or build/deploy goes red.
- **Previous sessions**: 37, 36, 35, 34 and 33 — same no-completable-item outcome; session 33's CHANGELOG
  entry holds the full audit, and sessions 34/35/36 additionally confirmed via the Actions API that the
  `withastro/action@v3` exit-code-1 failure is **not reproducing** (deploy runs `30997932201`,
  `30998513012`, `31052765897`, `31055262368` all success). 32 — shipped BL-033's smoke-test sub-item (`deploy.yml`'s
  `/book Step 1 renders` check). 31 — shipped BL-021, completing the Flow 1 booking UI. See CHANGELOG.md.
- **Build status**: typecheck 0 errors, lint/format clean, build 21 pages, `pnpm test` **156/156**
  — re-verified locally in session 38 from a fresh `pnpm install --frozen-lockfile`, identical to
  sessions 32-37. Not re-run locally in session 38: Playwright e2e and `lhci autorun` (no behavioral
  change to exercise). They ran green on a hosted runner instead: `deploy.yml` completed **success**
  at `f312317`, session 37's close-out commit and `main` HEAD at this session's start (run
  `31092850520`) — session 37 could only cite the run one commit behind its own close-out. Last local measurement,
  session 31: **274 passed**, 2 skipped, zero lhci assertion failures, `/book` JS ~66.5KB under
  the 70KB budget.
- **Deployed**: pushed directly to `main` at every commit (no branch workaround needed). `main`'s
  HEAD is session 38's close-out commit; sessions 33-38 changed no application code. The
  standing "FIRST PRIORITY" `withastro/action@v3` exit-code-1 item **is resolved**: seven consecutive
  sessions (32-38) confirmed via the Actions API that `ci.yml` and `deploy.yml`
  both fire and pass on `main`, including the `smoke` job's three checks on a real hosted runner.
  Session 37 read the full `deploy.yml` history rather than spot-checking and session 38 extended it:
  **32 `deploy.yml` runs on `main` back to 2026-08-01 have ended green — one of them, session 38's
  own close-out commit `79f4504`, only on a second attempt.** Its first attempt failed with an
  `actions/deploy-pages@v4` **timeout** (`build` passed, `deploy` polled `deployment_in_progress`
  ~10 min and aborted, `smoke` skipped) — a GitHub Pages platform transient, not a build failure,
  not a repo regression, and **not** the `withastro/action@v3` exit-code-1 signature. Re-running the
  failed jobs returned build/deploy/smoke all green. **If you see an isolated `deploy-pages`
  timeout, re-run the failed jobs before investigating this repo**; only a recurring one is a real
  problem.
  The scheduled-routine instruction that still names it FIRST PRIORITY is stale and should be edited
  out — it currently sends every run hunting a fixed bug before doing anything else.
  Still **not** independently confirmed: the Google Rich Results Test against deployed BL-031 data
  (needs a tool this environment lacks), and the live site itself — the sandbox egress proxy 403s
  `avrybrdly93.github.io`, so the only evidence the deployment serves is the `smoke` job's own curls
  from GitHub's runner. Do not restate that as a first-hand observation.

## Current Focus
M3: **BL-035/036/037/021 Done** — `/book` Steps 1-4 ship, the full Flow 1 booking UI end-to-end
(service → provider → acknowledgments → vendor handoff), BOOK-01 through BOOK-05 all proven via
Playwright. BL-022 (the real `/api/contact` backend) is the only remaining M3 item, gated on
D-009 — don't re-attempt until DECISION_LOG.md shows it resolved. M4: BL-030/031/018 Done; BL-032
Needs Human Review (Tier 3 clinical-content gate); BL-033 In Progress, gated on D-012 — its
smoke-test sub-item is now Done (session 32); only the header mechanism and monitor vendor remain.

## In Progress
| Item | Next step |
|---|---|
| BL-022 | D-009 (DECISION_LOG.md, Tier 3, Proposed) needs a human to name a hosting platform + email vendor for `/api/contact`. Once resolved: stand up the function against `ContactForm.client.ts`'s existing `fetch('/api/contact', {method:'POST', ...})` call (no client-side rework expected), add server-side rate limiting, verify real delivery, then flip BL-022 to Done. Everything else (page, form UI, validation, honeypot, success/failure states, and client-side analytics on submit outcomes) is shipped and tested. Still Proposed as of this session — do not re-attempt the backend until this changes. |
| BL-033 | D-012 (DECISION_LOG.md, Tier 3, Proposed) needs a human to pick a header-delivery mechanism (CDN/proxy in front of GitHub Pages, a hosting migration that also resolves D-009, or explicitly accept the gap as documented residual risk) and an uptime-monitor vendor. Once resolved: wire the chosen mechanism to deliver the still-missing `X-Content-Type-Options`/`X-Frame-Options`/`Permissions-Policy`/HSTS headers, stand up the monitor with alerting on `/` and `/book`, then flip BL-033 to Done. Already shipped and tested: CSP + Referrer-Policy meta tags, e2e coverage, and the smoke job — homepage, sitemap, and (session 32) `/book` Step 1, confirmed green on a real runner. The only smoke check still deferred is the contact-function healthcheck, which needs BL-022/D-009. Do not re-attempt the vendor/platform pieces until D-012 changes. |

## Blocked / Needs Human Input
| Item | What's needed |
|---|---|
| Practice constants | Real provider names, credentials, CA license numbers, prices, phone, email, domain, cancellation policy, accepted payment methods (fills practice.ts placeholders) |
| Provider bios | Approach statements (first-person, ≤150 words), education/training lists, bio body copy (fills src/content/providers/*.md NEEDS_HUMAN placeholders) — Tier 3 |
| Vendor selection | Scheduling/intake/video vendor chosen + BAA signed (R-004) + booking URL format |
| Provider photos | Professional photos per IMAGE_GUIDELINES.md |
| Legal copy | Human/counsel-approved Privacy Policy, Terms, telehealth consent overview, and Accessibility Statement — Tier 3; `src/content/legal/*.md` are placeholder shells only (`reviewStatus: needs-human-review`), shipped by BL-016 |
| FAQ content | `/faq`'s 13 Q&As are AI-drafted per COPY_GUIDELINES.md and need clinical/practice review before publish (same Needs Human Review status as BL-012); cancellation-policy and payment-methods answers are placeholders pending the practice-constants item above |

## Tomorrow's Focus
**No unblocked backlog item remains — re-confirmed session 38, now for the seventh consecutive
session.** Every BL-*/BUG-* row in BACKLOG.md is Done, Needs Human Review, In
Progress-gated-on-a-decision (BL-022/D-009, BL-033/D-012), or Blocked-on-deps (BL-034, which
depends on literally everything above it, including the other three). Session 32's work was **not**
an exception: it was an explicit in-repo TODO (`deploy.yml`'s `/book` smoke check) whose own stated
blocker had cleared, not new scope — and sessions 33 and 34 both re-checked for more of that class
and found only the contact-function healthcheck, still blocked.

**The project is fully human-gated. An unattended session cannot advance it.** Phase 1 orient
should therefore be short: check DECISION_LOG.md's status on D-009/D-012; if both are still
`Proposed`, log "no completable item" here and in CHANGELOG.md and stop. Do not force a drive-by
task, and do not re-derive this conclusion at length — session 33's entry has the full audit and
session 34's is deliberately brief for exactly that reason.

Concretely still needed, all requiring a human:
- **D-009** — hosting platform + email vendor for `/api/contact` (unblocks BL-022, and per D-012 a
  hosting migration would resolve both at once — the single highest-leverage decision here).
- **D-012** — header-delivery mechanism + uptime-monitor vendor (unblocks BL-033).
- The practice-constants / provider-bios / legal-copy / provider-photos / vendor-selection rows in
  "Blocked / Needs Human Input" above.
- Human review of BL-012, BL-015, BL-032.

Queued behind a decision rather than a judgement call: the remaining `contact function healthcheck`
smoke TODO becomes implementable the moment BL-022 ships — claim it in that same session. Still
outstanding on tooling access rather than a decision: the Google Rich Results Test against deployed
`/`, `/providers/dr-md`, `/faq` (BL-031, carried several sessions), and any first-hand check of the
live site (session 33's sandbox egress 403s `avrybrdly93.github.io`; the `smoke` job on GitHub's
runner is the only working probe).

## Weekly Review Findings
_(most recent review only; older → CHANGELOG.md)_
- **2026-08-02 (session 21)**: While fixing BUG-005 (routing every internal `href` through the new
  `withBase()` helper), found the same missing-`/telehealth`-base root cause in 4 files'
  `PROVIDER_PHOTO_PLACEHOLDER` `<img src>` (`providers/index.astro`, `providers/[slug].astro`,
  `about.astro`, `index.astro`) — confirmed 404ing in built `dist/providers/index.html` the same
  way BUG-005's hrefs were. Lower severity (S3): decorative placeholder with `alt=""`, a
  broken-image/professionalism issue, not a broken flow or a11y regression. Filed as **BUG-006**
  rather than expanding BUG-005's diff — `withBase()`'s doc comment scopes it to hrefs, not asset
  `src`s, and fixing both root causes in one session diff would blur the boundary between what
  BUG-005's acceptance criteria actually covered and what was opportunistically added.
