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
- **Phase**: M1 Foundation — done (BL-001–BL-007). M2 Content Pages — done (BL-012/BL-015 content
  Needs Human Review). M3 Booking & Contact — underway: BL-022 In Progress (blocked on D-009,
  human input), BL-023 Done. M4 SEO & Launch — underway: BL-030/BL-031/**BL-018 Done**; BL-032
  Needs Human Review. BUG-005 and BUG-006 both Done.
- **Last session**: 2026-08-03 (session 26) — checked D-009 first (still Proposed, unchanged, BL-022
  stays blocked), so claimed **BL-033** (security headers + smoke tests + uptime monitoring), the
  topmost `Ready` item with Deps Done. WebSearched GitHub Pages' header capabilities before writing
  any code (D-012): confirmed it has no HTTP-response-header delivery mechanism at all, so
  `X-Content-Type-Options`/`X-Frame-Options`/`Permissions-Policy`/HSTS have no meta-tag equivalent
  and can't ship on this deployment without a CDN/proxy or hosting migration (a human decision,
  same shape as D-009). Shipped what's achievable without a new vendor/platform commitment: a
  same-origin `Content-Security-Policy` `<meta>` tag (`'unsafe-inline'` required for the existing
  inline mobile-menu script + Astro CSS-module styles; `frame-ancestors` deliberately omitted since
  meta-delivered CSP silently ignores it — no clickjacking protection from this) and a
  `Referrer-Policy` `<meta name="referrer">` tag (full equivalent, no gap) in `BaseLayout.astro`;
  `tests/e2e/security-headers.spec.ts` (80 new assertions, 20 routes × 2 checks × 2 viewports); a
  post-deploy smoke job in `deploy.yml` covering the two things that exist today (homepage 200,
  `sitemap.xml` reachable) with the plan's other two checks (`/book`, contact-function healthcheck)
  commented as blocked rather than faked. Uptime-monitor vendor selection is untouched — no vendor
  evaluated or assumed, per D-012. BL-033 ships **In Progress**, not Done.
- **Build status**: green — `pnpm lint`/`pnpm typecheck`/`pnpm format` all clean (same pre-existing
  34 `z`-deprecated hints), `pnpm test` **97/97**, `pnpm build` (20 pages, clean),
  `check:readability` 16 passed/0 failed/2 skipped (unchanged, no content touched),
  `pnpm exec playwright test` (both viewports): **252 passed** (172 baseline + 80 new
  security-headers assertions), 2 correctly skipped (same baseline). `lhci autorun`: all 20 URLs
  passed every budget assertion (the new meta tags' byte cost didn't trip any budget). **Not
  verified**: actual GitHub Actions hosted-runner behavior of the new `smoke` job in `deploy.yml`
  (curl against a real deployed `page_url`) — that requires a real deploy to observe; confirm on
  the next `deploy.yml` run.
- **Deployed**: this session's 6 commits are on `claude/modest-meitner-up239g`, pushed directly to
  `main` (kept in sync with the branch, this repo's established convention). Confirm the next
  `deploy.yml` run actually exercises the new `smoke` job successfully. Still outstanding, carried
  forward again: the Google Rich Results Test against deployed BL-031 structured data.

## Current Focus
Milestone M3 — Booking & Contact: BL-020 claimed In Progress (2026-08-03 session 27) — this is a
grooming/split pass only (BACKLOG.md's own "L→split at grooming" sizing), no booking-flow code
this session. BL-022 still In Progress, still gated on D-009 — do not re-attempt until
DECISION_LOG.md shows it resolved. M4 — SEO & Launch: BL-030/BL-031/BL-018 Done; BL-032 Needs
Human Review (code/tests done, clinical content review pending, Tier 3 hard gate per
CONTENT_STRATEGY.md); BL-033 In Progress (blocked on D-012, a human header-delivery-mechanism +
uptime-monitor-vendor decision).

## In Progress
| Item | Next step |
|---|---|
| BL-022 | D-009 (DECISION_LOG.md, Tier 3, Proposed) needs a human to name a hosting platform + email vendor for `/api/contact`. Once resolved: stand up the function against `ContactForm.client.ts`'s existing `fetch('/api/contact', {method:'POST', ...})` call (no client-side rework expected), add server-side rate limiting, verify real delivery, then flip BL-022 to Done. Everything else (page, form UI, validation, honeypot, success/failure states, and client-side analytics on submit outcomes) is shipped and tested. Still Proposed as of this session — do not re-attempt the backend until this changes. |
| BL-033 | D-012 (DECISION_LOG.md, Tier 3, Proposed) needs a human to pick a header-delivery mechanism (CDN/proxy in front of GitHub Pages, a hosting migration that also resolves D-009, or explicitly accept the gap as documented residual risk) and an uptime-monitor vendor. Once resolved: wire the chosen mechanism to deliver the still-missing `X-Content-Type-Options`/`X-Frame-Options`/`Permissions-Policy`/HSTS headers, stand up the monitor with alerting on `/` (and `/book` once it exists), then flip BL-033 to Done. CSP + Referrer-Policy meta tags, e2e coverage, and the homepage/sitemap smoke job are already shipped and tested. Do not re-attempt the vendor/platform pieces until D-012 changes. |

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
BL-022 stays In Progress until a human resolves D-009; BL-033 stays In Progress until a human
resolves D-012 — check DECISION_LOG.md's status on both first before touching either again. Run
the Google Rich Results Test against the deployed `/`, `/providers/dr-md`, and `/faq` URLs once a
session's branch merges/deploys, to close out BL-031's acceptance criteria fully (still not done,
carried forward several sessions now). If both D-009 and D-012 are still Proposed: BL-020 (booking
flow) still needs a grooming/split pass before it's startable (L→split) — that grooming pass itself
could be a session's work if no other Ready+unblocked item exists next time. BL-021 depends on
BL-020. Once BL-020/BL-021 ship `/book`, wire the still-unwired `booking_step_view`/
`booking_service_selected`/`booking_provider_selected`/`booking_handoff` events from
`src/lib/analytics.ts` into that flow — the schema and `trackEvent()` are already there. Also
confirm this session's push to `main` actually triggered `deploy.yml`/`ci.yml` (including the new
`smoke` job) and both went green.

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
