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
- **Last session**: 2026-08-05 (session 33) — **no completable item; nothing shipped, no code
  changed.** D-009 and D-012 re-checked, both still `Proposed`; every BACKLOG.md row re-read and
  every in-repo deferred TODO re-checked (only the contact-function healthcheck remains, still
  blocked on BL-022/D-009). Verified anyway so "no change" is evidenced: local typecheck/lint/
  format clean, `pnpm test` 156/156, `pnpm build` 21 pages — all matching this file exactly, no
  drift. Remote at HEAD `09adefc`: CI run `30981712390` and deploy run `30981712407` both success,
  including Playwright e2e + axe, `lhci autorun`, and all three `smoke` checks. **This is the
  second consecutive session with zero completable work — the project is fully human-gated.**
- **Previous session**: 2026-08-05 (session 32) — D-009/D-012 re-checked, both still Proposed. Shipped
  BL-033's **smoke-test sub-item**: `deploy.yml`'s `/book Step 1 renders` check, commented out
  since session 26 because `/book` didn't exist, is now implemented (BL-021 cleared that blocker) —
  asserts 200 + the `booking-step-1-heading` id, not copy, so wording changes can't red the deploy.
  Also **confirmed the deploy pipeline green for the first time** (this environment has Actions API
  access, which prior sessions lacked). The `withastro/action@v3` exit-code-1 failure in the
  standing operating instructions is **no longer reproducing**. Verified at both the session-31 HEAD
  (`3c3f483`: deploy run `30957394012` + CI run `30957394022`, both success) and this session's own
  push (`71fe03f`: deploy run `30981297510` success across `build`/`deploy`/`smoke` — with the new
  `/book Step 1 renders` step green against the real deployed URL — and CI run `30981297479` success
  across both jobs, including Playwright e2e + axe and Lighthouse CI). Detail in CHANGELOG.md
  session 32.
- **Earlier**: session 31 shipped BL-021 (`/book` Step 4 vendor handoff + `buildBookingUrl` +
  mock-vendor e2e), completing the Flow 1 booking UI. See CHANGELOG.md for sessions 31 and earlier.
- **Build status**: typecheck 0 errors (81 files), lint/format clean, build 21 pages, `pnpm test`
  **156/156** — re-verified locally in session 33 from a fresh `pnpm install --frozen-lockfile`,
  identical to session 32's figures. Not re-run locally in session 33: Playwright e2e and
  `lhci autorun` (no behavioral change to exercise; both ran **green on a hosted runner at this
  exact SHA** — CI run `30981712390`. Last local measurement, session 31: **274 passed**, 2 skipped,
  zero lhci assertion failures, `/book` JS ~66.5KB under the 70KB budget).
- **Deployed**: pushed directly to `main` at every commit (no branch workaround needed). `main`'s
  HEAD is session 33's close-out commit; session 33 changed no application code. **Confirmed for a
  second consecutive session** (Actions API): `ci.yml` and `deploy.yml` both fire and pass on
  `main`, including the `smoke` job's three checks on a real hosted runner. Still **not**
  independently confirmed: the Google Rich Results Test against deployed BL-031 data (needs a tool
  this environment lacks), and the live site itself — session 33's sandbox egress proxy 403s
  `avrybrdly93.github.io`, so the only evidence the deployment serves is the `smoke` job's own
  curls from GitHub's runner. Do not restate that as a first-hand observation.

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
**No unblocked backlog item remains — re-confirmed session 33, now for the second consecutive
session.** Every BL-*/BUG-* row in BACKLOG.md is Done, Needs Human Review, In
Progress-gated-on-a-decision (BL-022/D-009, BL-033/D-012), or Blocked-on-deps (BL-034, which
depends on literally everything above it, including the other three). Session 32's work was **not**
an exception: it was an explicit in-repo TODO (`deploy.yml`'s `/book` smoke check) whose own stated
blocker had cleared, not new scope — and session 33 re-checked for more of that class and found
only the contact-function healthcheck, still blocked.

**The project is fully human-gated. An unattended session cannot advance it.** Phase 1 orient
should therefore be short: check DECISION_LOG.md's status on D-009/D-012; if both are still
`Proposed`, log "no completable item" here and in CHANGELOG.md and stop. Do not force a drive-by
task, and do not re-derive this conclusion at length — session 33's entry has the full audit.

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
