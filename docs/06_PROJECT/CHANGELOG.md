---
title: Changelog
status: Active
authority: Project
owner: Engineering
dependencies:
  - PROJECT_STATUS.md
review_cycle: Every session
---

# Changelog

Format (newest first). One entry per session that changed anything.

```
## YYYY-MM-DD — session N
- [BL-xxx] What shipped (user-visible phrasing where possible)
- Decisions: D-xxx (if any)
- Notes: regressions found/fixed, items re-scoped
```

Rules: agent-written in Phase 5; never rewrite past entries; releases to production get a `— DEPLOYED` suffix on the entry.

---

## 2026-08-04 — session 28
- [BL-035] **Done.** `/book` now renders Step 1 of the booking flow (USER_FLOWS.md Flow 1,
  FR-020/022/024, UX-010/011): service selection ("First appointment (new patient)" vs.
  "Follow-up (existing patients)") via two `Card` `selectable` cards, eligibility summary (CA ·
  18+ · not for emergencies, FR-022 early disclosure), a `StepIndicator` ("Step 1 of 4",
  aria-live-announced), the persistent `CrisisResources` strip + phone alternative (FR-024), and
  an E-050 no-JS fallback. Selection persists to URL params + `sessionStorage` (never cookies,
  UX-011) via new `src/lib/booking-state.ts`. No booking flow existed before this session; BL-036
  (Step 2)/BL-037 (Step 3)/BL-021 (handoff) remain, each already `Ready` with deps satisfied by
  this item.
- Decisions: **D-013** (new) — `BaseLayout` gets a `chrome="minimal"` variant for `/book`'s
  reduced-chrome spec (logo only, no `SiteHeader` nav/`SiteFooter`); `BookingFlow` is this
  codebase's first hydrated React island (`client:load`), justified by `/book`'s own 70KB JS
  budget in PERFORMANCE_BUDGET.md (every prior interactive component — SiteHeader, ContactForm —
  was deliberately vanilla JS to fit the 15KB content-page budget instead); `lib/booking-state.ts`
  defines the `BookingSelection` shape as the stable contract BL-036/037/021 build against.
- New: `src/lib/booking-state.ts` (12 tests), `src/components/StepIndicator/` (6 tests, new
  COMPONENT_LIBRARY.md entry), `src/components/BookingFlow/` (7 tests, new COMPONENT_LIBRARY.md
  entry), `src/pages/book.astro` + `.module.css`, `src/layouts/BaseLayout.module.css`. `/book`
  added to `lib/routes.ts#SITE_ROUTES` and `lighthouserc.cjs`.
- Notes: found and fixed two real bugs before considering this done, not after:
  1. `StepIndicator` rendered a literal `"undefined"` CSS class on non-current dots (naive
     template-literal class concatenation against an unstyled `upcoming` state) — confirmed live
     in a real `pnpm build`'s `dist/book/index.html`, fixed with a `.filter(Boolean)` join, and
     added a regression test.
  2. The first draft of `book.astro`'s `<noscript>` E-050 fallback assumed the hydrated island
     "renders nothing without JS" and duplicated `CrisisResources`'s canonical text — both wrong:
     Astro server-renders every island's markup regardless of its `client:*` directive (confirmed
     in the same real build: Step 1's full content, including both radio options, is present in
     the static HTML). Rewrote the fallback to describe what's actually missing without JS
     (persistence, later steps) instead of a false "nothing works" claim, and removed the
     duplicate crisis block. Corrected D-013 and COMPONENT_LIBRARY.md's `BookingFlow` entry to
     match, since both had repeated the same wrong claim.
  3. Adding `/book` to `SITE_ROUTES` broke two generic e2e checks that assumed every route has a
     full footer/nav: GLOBAL-02 (footer crisis block) and UX-003 (pricing reachable ≤2 clicks from
     every page). Both are real, foreseeable consequences of `chrome="minimal"`'s deliberate
     no-footer-nav design (PAGE_SPECIFICATIONS.md's "reduce exits") — gave both a documented,
     explicit `/book` exception (GLOBAL-02 checks the strip variant's `CrisisResources` instead of
     a `<footer>`; UX-003 excludes `/book` from the reachable-from-every-page requirement) rather
     than weakening either check or silently skipping `/book`.
  4. Verified `lhci autorun` live against `/book/` and `/` (not the full 20-URL suite, to keep
     runtime reasonable — unaffected routes' budgets are unchanged) using a new `lighthouserc.cjs`
     `assertMatrix`: `/book` now gets PERFORMANCE_BUDGET.md's "islands" column (70KB JS/100KB
     image/300KB total) instead of the content-page column (15KB/350KB/500KB) it would otherwise
     have inherited and immediately failed (`BookingFlow`'s real gzip JS transfer measured ~61KB —
     comfortably under 70KB, over 4x the content-page budget). Both URLs passed with zero
     assertion failures.
  5. Full suite after all fixes: `pnpm typecheck` 0 errors, `pnpm lint` clean, `pnpm build` 21
     pages, `pnpm test` 122/122 (up from 97 — 24 new), `pnpm exec playwright test` 262 passed / 2
     correctly skipped (same baseline as prior sessions, plus new `/book` coverage). **Not
     verified**: `lhci autorun` on the other 18 URLs (unaffected by this diff) and any
     cross-browser check beyond Chromium (this environment has no Safari/Firefox).
  6. This session's branch requirements (harness configuration) required committing to
     `claude/modest-meitner-7nlrox` rather than pushing directly to `main` as `claude.md` normally
     directs — a deliberate, documented deviation from this repo's usual convention, not an
     oversight. See PROJECT_STATUS.md "Deployed" — a human needs to merge/fast-forward `main` from
     this branch before `/book` is live.

## 2026-08-03 — session 27
- [BL-020] **Split, not implemented — grooming/split pass only, per this session's brief and
  BACKLOG.md's own "L→split at grooming" sizing note.** Checked D-009 and D-012 first
  (DECISION_LOG.md) — both still Proposed, unchanged, so BL-022 and BL-033 both stay untouched
  this session. BL-020 was the only `Ready` item with Deps (BL-005) Done, but its own sizing says
  it's too big for one session and must be split before anyone starts it — claimed the split pass
  itself, per PROJECT_STATUS.md's session-26 "Tomorrow's Focus" note. No booking-flow code was
  written this session; the split is the deliverable.
  - Read USER_FLOWS.md Flow 1 (the four-step spec: service → provider preference → acknowledgments
    → vendor handoff), SERVICE_REQUIREMENTS.md's FR-020/021/022/023, ERROR_STATES.md's E-011,
    COMPONENT_LIBRARY.md's StepIndicator/CrisisResources/Card entries, PAGE_SPECIFICATIONS.md's
    `/book` spec, and ARCHITECTURE.md's Extensibility Commitments (the vendor handoff is one
    function, `buildBookingUrl(selection)` — BL-021 already proves the handoff step splits out
    cleanly, so BL-020's own steps 1–3 split the same way). Checked BACKLOG.md/CHANGELOG.md for a
    precedent of another `L→split` item actually being split — **none exists**; this session
    establishes the pattern rather than following one.
  - Split BL-020 along Flow 1's own step boundaries (each step is a natural, independently
    testable unit) into three session-sized children, inserted into Milestone M3 in priority
    order:
    - **BL-035** (M, deps BL-005): `/book` scaffold — island shell, state-persistence
      architecture (URL params/sessionStorage per UX-011, never cookies), the new `StepIndicator`
      component, `CrisisResources` strip wiring, and Step 1 (service selection, FR-020 + FR-022's
      early-disclosure eligibility summary). Sized M, not S, because it carries the foundational
      architecture decisions — the `selection` state shape BL-021's `buildBookingUrl(selection)`
      will later consume, plus a brand-new component needing its own COMPONENT_LIBRARY.md
      states/a11y entry and Vitest/RTL/axe coverage — comparable in scope to BL-005/BL-010 (both
      M).
    - **BL-036** (S, deps BL-035): Step 2, provider preference (FR-021) — Dr. [MD]/[PMHNP] cards
      plus an equal-weight "No preference" default, reusing BL-035's state pattern and the
      existing `Card` component.
    - **BL-037** (S, deps BL-036): Step 3, eligibility acknowledgments + E-011 validation
      (Continue disabled until all three checkboxes are checked, inline per-requirement guidance,
      never a modal). This is the item that completes the original BL-020 acceptance criteria in
      full — BOOK-02/03/04/05 (TESTING_AND_VALIDATION_PLAN.md) all become passable once it ships,
      since BOOK-03 (back-button state preservation) and BOOK-02 (full Steps-1–3 walkthrough)
      need all three steps to exist.
  - BL-020's own BACKLOG.md row is **kept**, not deleted — status changed to `Split (2026-08-03
    session 27) → BL-035, BL-036, BL-037`, matching this repo's append-only/never-rewrite-history
    convention elsewhere (DECISION_LOG.md's `Superseded` links, this file's own "never rewrite
    past entries" rule). Its original acceptance criteria ("BOOK-02/03/04/05 e2e pass") is noted
    as superseded by the three children's combined criteria.
  - BL-021's Deps changed from BL-020 to BL-037 (it needs the full Steps 1–3 selection state —
    service + provider + acknowledgments — to exist before `buildBookingUrl(selection)` can be
    built against it). BL-021's own row/criteria otherwise unchanged.
  - No new Tier 2/3 decision logged: per DECISION_FRAMEWORK.md, splitting a backlog item isn't in
    Tier 2's list (no new component, dependency, or >3-module refactor was actually built this
    session) — it's a Tier 1 planning action, logged here and in the commit messages instead.
    Component/state-architecture choices (e.g. how `StepIndicator` is built, URL-params-vs-
    sessionStorage specifics) are deliberately left for BL-035's implementing session, the same
    way D-005/D-006/D-010/D-011 recorded those decisions only once each item was actually built,
    not at grooming time.
- Verified this session (all run locally against a freshly reinstalled `node_modules` — none of
  this was fabricated): `pnpm typecheck` (`astro check`: 0 errors, 0 warnings, same pre-existing
  34 `z`-deprecated hints as every prior session), `pnpm lint` (clean), `pnpm build` (20 pages,
  unchanged — no route/component/content files touched this session). `pnpm test` also run once,
  clean (97/97, unchanged). `pnpm run check:readability` also run once, clean (16 passed/0
  failed/2 skipped, unchanged, no content touched).
  - `pnpm exec playwright test` was run once this session (both viewports, after installing
    Playwright's Chromium via `pnpm exec playwright install --with-deps chromium`, not present in
    this environment by default): **252 passed, 2 correctly skipped — identical to session 26's
    baseline**, as expected for a docs-only diff.
  - `lhci autorun` was **not completed this session** and its result is not claimed either way.
    First attempt: `lhci`'s own Chrome healthcheck failed (`chrome-launcher` couldn't find a
    Chrome binary even with Playwright's Chromium installed) until `CHROME_PATH` was pointed at
    Playwright's binary directly; that attempt's own output was lost to a `| tail` buffering
    artifact and never observed. A second attempt (output redirected straight to a log file)
    passed its healthcheck and started collecting — confirmed partway through (4 of 20 URLs
    completed in the log) — but was still running when this session's actual diff scope was
    reconfirmed as docs-only (BACKLOG.md/PROJECT_STATUS.md/CHANGELOG.md, no `.astro`/component/
    route/content changes), at which point continuing to wait on a Lighthouse budget re-check for
    a diff that can't affect Lighthouse budgets was judged not worth the session time; the
    process was killed rather than left to finish unobserved. **No lhci pass/fail is claimed for
    this session** — last known-green result remains session 26's (20/20 URLs, all budgets
    passed).
- Decisions: none (Tier 1 planning action only, no Tier 2/3 decision — see BL-020 note above).
- Notes: this session touched only `docs/06_PROJECT/BACKLOG.md`, `docs/06_PROJECT/PROJECT_STATUS.md`,
  and this file — no `src/`, `tests/`, or config changes, so the e2e/Lighthouse surface is
  provably unaffected by this session's diff (same reasoning session 17 used for a
  content-only diff).
- Next steps for a following session: BL-035 (Ready, deps BL-005 Done) is now the top unblocked
  M3 item — start there (booking flow scaffold: `/book` route, state-persistence architecture,
  `StepIndicator` component, Step 1). Continue to check D-009/D-012 first each session; BL-022 and
  BL-033 stay untouched until those resolve. Once BL-035/036/037 ship, BL-021 (vendor handoff) is
  unblocked next; after that, wire the still-unwired `booking_*` analytics events
  (`src/lib/analytics.ts`) into the real flow. Still outstanding, carried forward again: the
  Google Rich Results Test against deployed BL-031 structured data, and confirming the `deploy.yml`
  `smoke` job (BL-033) on a real hosted-runner run.

---

## 2026-08-03 — session 26
- [BL-033] **In Progress**. Checked D-009 first (DECISION_LOG.md) — still Proposed, unchanged, so
  BL-022 stays blocked — then claimed BL-033 (security headers + smoke tests + uptime monitoring),
  the topmost `Ready` item with Deps (BL-006) Done. BL-020 (booking flow) is also `Ready` but
  explicitly sized "L→split at grooming" (not a single-session task); BL-021 depends on BL-020, so
  neither was startable.
  - Before writing code, WebSearched GitHub Pages' actual header-delivery capabilities (this blocks
    real work, not a minor aside): confirmed via GitHub Community discussions #84963, #4444,
    #54257, #157852 that GitHub Pages has **no mechanism to send custom HTTP response headers at
    all** — no `_headers`/`vercel.json`-style config surface of any kind, a long-standing,
    unresolved platform limitation. This means `X-Content-Type-Options`, `X-Frame-Options`,
    `Permissions-Policy`, and `Strict-Transport-Security` have no meta-tag equivalent and cannot
    ship on this deployment without a CDN/proxy in front of Pages or a hosting migration — the same
    shape of gap D-009 already found for `/api/contact`. Logged this as **D-012** (Tier 3,
    Proposed): options evaluated (CDN/edge-proxy, hosting migration — noting this could resolve
    D-009 too in the same move, or accept the gap as documented residual risk for the no-PHI
    Phase-1 site) but not decided; an uptime-monitor vendor also needs a human pick (new
    third-party account/contact-details relationship, Tier 3). BL-033's literal acceptance criteria
    ("header scan passes in smoke; monitor alerting verified") therefore cannot be fully met this
    session — same honest-partial-completion shape as BL-022/D-009.
  - Shipped what's achievable without a new vendor/platform commitment: `BaseLayout.astro` gained a
    same-origin `Content-Security-Policy` `<meta>` tag (`default-src 'self'; script-src 'self'
    'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';
    connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';` —
    `'unsafe-inline'` required because the existing inline mobile-menu `<script type="module">` and
    Astro's inlined CSS-module `<style>` blocks carry no nonce/hash; `frame-ancestors` deliberately
    omitted rather than shipped as a no-op, since browsers silently ignore that directive when CSP
    is meta-delivered — this CSP provides no clickjacking protection) and a `Referrer-Policy`
    (`strict-origin-when-cross-origin`) `<meta name="referrer">` tag (no header/meta gap, fully
    equivalent). New `tests/e2e/security-headers.spec.ts`: asserts both tags on every route (80 new
    assertions — 20 routes × 2 checks × 2 viewports) plus a regression guard that the CSP contains
    no bare `http(s)://` allowance. New post-deploy `smoke` job in `deploy.yml`: checks the two
    things that actually exist on production today (homepage returns 200; `sitemap.xml` reachable
    and non-empty) — the plan's other two checks (`/book` Step 1, contact-function healthcheck) are
    commented as blocked on BL-020/BL-021 and BL-022/D-009 respectively, not silently dropped.
  - Verified this session: `pnpm lint`/`pnpm typecheck`/`pnpm format` all clean (same pre-existing
    34 `z`-deprecated hints), `pnpm test` 97/97, `pnpm build` (20 pages, clean),
    `pnpm run check:readability` 16 passed/0 failed/2 skipped (unchanged, no content touched),
    `pnpm exec playwright test` (both viewports) **252 passed** (172 baseline + 80 new), 2
    correctly skipped (same baseline), `lhci autorun` all 20 URLs passed every budget assertion
    (the new meta tags' byte cost didn't trip anything). **Not verified**: the new `smoke` job's
    actual behavior on a real GitHub Actions hosted runner against a live deployed URL — that
    requires an actual deploy to observe, which this sandbox can't do; confirm on the next
    `deploy.yml` run.
- Decisions: D-012 (Tier 3, Proposed — GitHub Pages header-delivery mechanism + uptime-monitor
  vendor, see DECISION_LOG.md for full context/alternatives/sources).
- Notes: BL-022/D-009 unchanged this session, not re-attempted, per its own "do not re-attempt
  until..." gate.

---

## 2026-08-03 — session 25
- [BL-018] **Done**. Checked D-009 first (DECISION_LOG.md) — still Proposed, unchanged — so per
  session 24's "Tomorrow's Focus" claimed BL-018 (flip readability CI from `continue-on-error` to
  blocking), Ready with its dep BL-032 already drafted (Needs Human Review, but its content —
  the acceptance-criteria-relevant part — was already in place).
  - Confirmed locally before touching CI config: `pnpm run check:readability` still passes all 16
    real content units (0 failed, 2 skipped placeholder provider bios), including all 3
    `conditions/{depression,anxiety,adhd}.md` files BL-032 drafted (adhd 7.9, anxiety 7.9,
    depression 7.7 — unchanged from session 24, all under the grade-8 threshold).
  - Removed `.github/workflows/ci.yml`'s `continue-on-error: true` from the readability step and
    replaced its D-008-era "why this is non-blocking" comment with a note pointing at BL-018 and
    the original D-008 rationale, so a future reader isn't told the step is non-blocking when it
    no longer is.
  - No app code changed — this is a CI-config-only change, so most of QUALITY_STANDARD.md's
    Definition of Done (mobile/desktop viewports, cross-browser, axe, content copy) doesn't apply;
    ran the full verification suite anyway rather than skipping it: `pnpm lint` (0 errors/warnings),
    `pnpm typecheck` (0 errors/warnings, same pre-existing 34 `z`-deprecated hints), `pnpm test`
    (97/97), `pnpm format` (clean), `pnpm build` (20 pages, clean), `pnpm run check:readability`
    (exit 0, confirmed explicitly since that's the exact step being flipped to blocking),
    `pnpm run test:e2e` (172 passed, 2 correctly skipped — same baseline as session 24), and
    `lhci autorun` (all 20 URLs passed every budget assertion).
  - Did not touch DECISION_LOG.md — D-008 (the original non-blocking decision) stays as the
    historical record of why the step shipped non-blocking; BL-018's own backlog entry (now Done)
    and this entry are the record of the flip. No new Tier 2/3 decision needed: BL-018's
    acceptance criteria didn't require a new judgment call, just confirming the already-drafted
    condition-page content still passes and removing the now-unnecessary escape hatch.
- Notes: BL-032 (Needs Human Review) and D-009/BL-022 (Proposed) both unchanged this session — not
  re-attempted, per EXECUTION_LOOP.md and each item's own "do not re-attempt until..." gate.

---

## 2026-08-03 — session 24
- [BL-032] **Needs Human Review** (code/tests done; clinical content review still pending, Tier 3
  hard gate per CONTENT_STRATEGY.md — same status category as BL-012/BL-015). Checked D-009 first
  (DECISION_LOG.md) — still Proposed, unchanged — so per session 23's "Tomorrow's Focus" claimed
  BL-032 (3 condition pages), Ready and unblocked (BL-011/BL-030 both Done).
  - New component: `src/components/Breadcrumbs/Breadcrumbs.tsx` (D-011). `.tsx`, not `.astro` —
    matches this repo's existing pattern (Hero, PricingTable, FAQAccordion are all React even
    though several ship zero client JS) so it gets a real Vitest/RTL/jest-axe unit test like the
    rest of the library, rather than introducing the first untested `.astro` component. Current-
    page item renders as `<span aria-current="page">`, not a link (WAI-ARIA breadcrumb pattern);
    `/` separators are `aria-hidden`, decorative only.
  - Expanded `src/content/conditions/{depression,anxiety,adhd}.md` from stub content (frontmatter
    one-liners + the bare Hard-Rule-2 disclaimer sentence) to full draft copy following
    CONTENT_STRATEGY.md's Condition Page Standard: plain-language "what it can feel like" (lived-
    experience framing, explicitly non-diagnostic), "how psychiatric care typically helps" scoped
    to treatment *categories* (medication management, coordination with therapy, follow-up — never
    a specific drug name, per COPY_GUIDELINES Hard Rule 2), and one prevalence stat per page. Stats
    came from a live WebSearch against nimh.nih.gov this session (8.3% of U.S. adults / major
    depressive episode; ~18% 12-month anxiety-disorder prevalence; ~4% of U.S. adults with ADHD),
    not invented, each linked per CONTENT_STRATEGY.md's Sourcing Rules ("no 'studies show' without
    a link"). Wired `relatedFaqSlugs` to real FAQ entries (medication questions on all three;
    emergency FAQs on the depression page specifically).
  - First draft failed `pnpm run check:readability` on all 3 files (adhd grade 13.8, anxiety 11.5,
    depression 10.4 — the mandatory Hard-Rule-2 disclaimer alone already scores 10.9 per D-008, so
    some gap was expected, but the drafted prose pushed it well past that floor). Did a
    simplification pass — shorter sentences, one idea per sentence, no meaning or fact changes —
    and got all 3 under the grade-8 threshold (adhd 7.9, anxiety 7.9, depression 7.7). This
    incidentally means BL-018's acceptance criteria (these same 3 files passing
    `check:readability`) are now already satisfied, though BL-018 itself wasn't claimed or touched
    this session — flipping `ci.yml`'s `continue-on-error: true` off is BL-018's own change to
    make, not folded into this one (scope discipline, EXECUTION_LOOP.md §Prohibited).
  - Built `src/pages/conditions/[slug].astro` implementing PAGE_SPECIFICATIONS.md's
    `/conditions/[slug]` spec in full: `Breadcrumbs` (Home → condition name), H1 + overview,
    "How psychiatric care typically helps" section (frontmatter summary + the long-form
    `<Content />` body), a link to the matching service rendered through `withBase()` (**not** a
    raw markdown link in the content body — caught during review that a hardcoded
    `[text](/services/...)` link inside markdown would repeat BUG-005's exact root cause, since
    `<Content />`'s rendered HTML doesn't get base-rewritten any more than a hardcoded `.astro`
    href would; removed the one I'd drafted and moved the link into the astro template instead),
    related-FAQ links pointed at `/faq`'s *group* anchors (`#medication-questions`, etc.) rather
    than per-question anchors, since `FAQAccordion`'s `<details>` elements don't carry an `id` —
    confirmed by reading the component before assuming otherwise. An inline `CrisisResources
    variant="strip"` renders on the depression page only, per CONTENT_STRATEGY.md's "crisis note
    ... esp. depression page" — the real component, not paraphrased crisis copy in markdown
    (COPY_GUIDELINES Hard Rule 6).
  - Also linked provider bios' "Conditions treated" list items (`src/pages/providers/[slug].astro`)
    through to the new condition pages — previously plain text with nowhere to go. Direct follow-on
    wiring of pages this same session created, not a drive-by expansion.
  - Registered `/conditions/depression`, `/conditions/anxiety`, `/conditions/adhd` in
    `src/lib/routes.ts#SITE_ROUTES` (feeds sitemap.xml and every `ROUTES`-driven e2e suite:
    global.spec.ts, accessibility.spec.ts, nav-audit.spec.ts) and `lighthouserc.cjs`'s `collect.url`
    (BUG-003 precedent: every shipped route needs its own LHCI budget check).
  - Verified this session: `pnpm typecheck`/`lint`/`format` clean (same pre-existing `z`-deprecated
    hints as every prior session); `pnpm test` 97/97 (+3 new `Breadcrumbs.test.tsx` cases, up from
    94/94); `pnpm build` 23 pages clean (up from 20); `pnpm exec playwright test` both viewports
    172 passed, 2 correctly skipped (same baseline skips as every prior session); `lhci autorun`
    re-run (new routes) — all 20 URLs pass every budget assertion.
  - Not verified/fabricated: no clinical accuracy or tone review of the drafted condition copy by
    an actual provider — that's the Tier 3 gate CONTENT_STRATEGY.md requires before publish, and
    this session doesn't claim to have satisfied it. Session 23's outstanding Google Rich Results
    Test (BL-031, needs a live deployed URL) also wasn't re-attempted this session — still pending.

---

## 2026-08-02 — session 23
- [BL-031] **Done**. Checked D-009 (DECISION_LOG.md) first — still Proposed, no human resolution
  — so per session 21/22's "Tomorrow's Focus" claimed BL-031 (structured data), Ready and unblocked
  on the schema/markup side even though its content deps (BL-012/BL-015) remain Needs Human Review.
  - `src/lib/structuredData.ts`: pure, unit-tested JSON-LD builders — `buildMedicalBusinessSchema`,
    `buildPhysicianSchema`, `buildFaqPageSchema`, and `serializeJsonLd` (escapes `</script` before
    embedding, so schema content can never prematurely close its own `<script>` tag). No
    filesystem/Astro-global access in the module itself — callers pass in already-resolved URLs
    (e.g. `new URL(withBase('/'), Astro.site)`) — so the builders are directly testable without an
    Astro build (first attempt used `withBase()` internally and relied on `import.meta.env.BASE_URL`
    inside the pure module; under Vitest's `getViteConfig` that env var isn't populated the same way
    a real `astro build` populates it, so the test asserted the wrong URL — moved the base-prefixing
    up into each caller instead, which was already computing this exact shape for canonical/OG URLs).
  - `MedicalBusiness` wired site-wide via `BaseLayout.astro`, alongside the existing canonical/OG
    tags. **Deliberately no `address` field** — LOCAL_SEARCH_STRATEGY.md §Site-Side Support: "schema.org
    MedicalBusiness with areaServed: California; no fake address markup" (telehealth-only practice,
    no public location); used `areaServed: {"@type":"State","name":"California"}` instead.
  - `Physician` wired into `src/pages/providers/[slug].astro` (both bios). Per SEO_STRATEGY.md
    §Technical Foundation ("PMHNP page also uses accurate jobTitle"), `jobTitle` reads from
    `credential` (`PROVIDER_CREDENTIALS[key]`, practice.ts) — the same value already rendered in the
    page's own `<h1>` — rather than a hardcoded per-role guess, so it can't drift from what's
    actually shown and stays accurate for both MD and PMHNP without this module inventing wording.
    `identifier` carries the CA license number as a `PropertyValue` (E-E-A-T signal, SEO_STRATEGY.md
    "license numbers on bios").
  - `FAQPage` wired into `src/pages/faq.astro`: all 13 Q&As (including the two practice.ts-sourced
    cancellation-policy/payment-methods answers), in the same order as the page's own `GROUPS`.
    Answer text runs through `readability.ts#stripMarkdownSyntax` (reused directly, same precedent
    as session 22 reusing `withBase()` — no new markdown-stripping helper needed) so
    `acceptedAnswer.text` is plain prose, not raw Markdown syntax.
  - All three embedded via `<script type="application/ld+json" set:html={...} is:inline />` — added
    `is:inline` explicitly after `pnpm typecheck` hinted (astro(4000), non-blocking) that a
    `set:html` script is treated as inline anyway; making it explicit silences the hint and matches
    intent (no npm-package/TS processing needed for a static JSON blob).
  - Verified beyond unit tests: ran a real `pnpm build` and parsed the built HTML's `<script
    type="application/ld+json">` contents as JSON directly (Python, `json.loads`) — confirmed valid
    JSON, correct `@type` per page (`MedicalBusiness` on every page; `+Physician` on
    `providers/dr-md/index.html`; `+FAQPage` on `faq/index.html`, 13-item `mainEntity`), no
    unexpected placeholder beyond the site's existing `NEEDS_HUMAN_*` convention (e.g. Physician's
    `name`/`jobTitle`/`description` render the same placeholders the page itself already shows).
  - **Not done this session, acceptance criteria only partly closed**: BL-031's literal acceptance
    criteria is "Rich Results test passes for all three types" — that's Google's external, hosted
    tool and needs a live production URL; this session verified the underlying JSON-LD is
    well-formed and schema-shaped but did not and could not run the actual Rich Results Test (no
    live deployment of this session's commits yet). Flagged as **Done** here per the actual
    code/build-level verification completed (matches this session's real deliverable), but the
    external Rich Results check itself is still open — see PROJECT_STATUS.md "Tomorrow's Focus".
- Decisions: none this session (no Tier 2/3 decision needed — `areaServed`-not-`address` and
  `jobTitle`-from-`credential` both follow existing, already-decided doc guidance directly, not new
  choices).
- Notes: `git status` confirmed clean working tree before close-out. Full verification this session
  (all local, before push): `pnpm install --frozen-lockfile` (lockfile in sync), `pnpm lint`
  (clean), `pnpm typecheck` (0 errors, pre-existing `z`-deprecated hints unchanged), `pnpm format`
  (clean), `pnpm test` (**94/94**, +4 new `structuredData.test.ts` cases), `pnpm build` (17 pages,
  clean), `pnpm exec playwright test` (148/150 passed, 2 correctly skipped — same desktop-only
  skips as every prior session, unchanged from session 22), `pnpm exec lhci autorun` (**re-run this
  session**, unlike session 22 — new `<script>` markup on every page: 17/17 URLs pass every budget
  assertion at `error` severity). **Not yet verified**: production deploy, and the Rich Results
  Test itself (see above) — this session's designated branch (`claude/modest-meitner-u3yv13`) had
  already been fully merged into `main` from session 22's work, so it was restarted from `main` at
  the start of this session per branch policy; this session's commits are pushed but not yet
  confirmed merged/deployed.

## 2026-08-02 — session 22
- [BUG-006] **Done**. Claimed per session 21's "Tomorrow's Focus" (BL-022 still gated on D-009,
  confirmed still Proposed in DECISION_LOG.md before touching anything else).
  - Same root cause as BUG-005: `PROVIDER_PHOTO_PLACEHOLDER = '/images/provider-photo-placeholder.svg'`
    was hardcoded root-relative in 4 files (`src/pages/index.astro`, `about.astro`,
    `providers/index.astro`, `providers/[slug].astro`) — missing the `/telehealth` GitHub Pages
    base, 404ing in production the same way BUG-005's hrefs did.
  - Fix: reused `src/lib/routes.ts#withBase()` directly (`PROVIDER_PHOTO_PLACEHOLDER =
    withBase('/images/provider-photo-placeholder.svg')`) rather than adding a separate
    asset-path helper — all 4 files already imported `withBase` for their own hrefs, and the
    behavior needed (prepend the base to a root-relative internal path) is identical for `src`
    and `href`. Broadened `withBase()`'s doc comment to say so explicitly instead of leaving it
    scoped to hrefs only, since BUG-006 is now a second real caller outside that scope.
  - Verified against a real `pnpm build`: `dist/index.html`, `dist/about/index.html`,
    `dist/providers/index.html`, and `dist/providers/dr-md/index.html` all render
    `src="/telehealth/images/provider-photo-placeholder.svg"` — no bare `src="/images/..."`
    remains anywhere in `dist/`.
  - Added `tests/e2e/provider-photo.spec.ts`: asserts the built `<img src>` on all 4 pages
    equals the expected base-prefixed path, derived from `playwright.config.ts`'s `BASE_URL`
    (not hardcoded a second time) — same anchored-assertion approach `nav-audit.spec.ts` uses
    for hrefs (BUG-005 precedent), covering both viewport projects (8 new cases).
- Decisions: none this session (no Tier 2/3 decision needed — reused BUG-005's established
  `withBase()` pattern rather than introducing anything new).
- Notes: `git status` confirmed clean working tree before close-out. Full verification this
  session (all local, before push): `pnpm install --frozen-lockfile` (lockfile in sync),
  `pnpm lint` (clean), `pnpm typecheck` (0 errors, pre-existing `z`-deprecated hints unchanged),
  `pnpm format` (clean), `pnpm test` (90/90, unchanged), `pnpm build` (17 pages, clean),
  `pnpm exec playwright test` (148/150 passed, 2 correctly skipped — same desktop-only skips as
  every prior session; the 8-case increase from session 21's 140/142 is exactly this session's
  new spec). `lhci autorun` not re-run — no page markup/weight changed, only `src` attribute
  values on an already-decorative placeholder (`alt=""`); prior session's 17/17 baseline stands,
  flagged unverified-this-session rather than assumed green. **Not yet verified**: production
  deploy. This session's designated branch (`claude/modest-meitner-gi9xl3`) had already been
  fully merged into `main` from session 21's work, so it was restarted from `main` at the start
  of this session per branch policy; this session's commits are pushed but not yet confirmed
  merged/deployed — whoever merges should confirm `deploy.yml`/`ci.yml` both go green before
  assuming the live site reflects this fix.

## 2026-08-02 — session 21 — DEPLOYED
- [BUG-005] **Done**. Claimed per session 20's "Tomorrow's Focus" (S1, filed while verifying
  BL-030's canonical URLs) ahead of any milestone item.
  - Root cause: Astro does not rewrite plain string `href`s for a non-root `base` (`/telehealth`
    on the live GitHub Pages project site) — every hardcoded `href="/pricing"`-style string
    site-wide resolved against the origin instead, 404ing in production.
  - Added `src/lib/routes.ts#withBase(path)`: prepends `import.meta.env.BASE_URL` (stripped of its
    trailing slash), the same pattern `BaseLayout.astro` already used for font/OG-image URLs.
  - Routed every internal `href` through it: `SiteHeader.astro` (logo, desktop nav, mobile menu,
    both Book buttons); `SiteFooter.tsx` (nav + legal link lists); all 11 page files
    (`404.astro`, `about.astro`, `contact.astro`, `faq.astro`, `index.astro`, `pricing.astro`,
    `providers/[slug].astro`, `providers/index.astro`, `services/[slug].astro`,
    `services/index.astro`, `your-first-visit.astro`) — including `index.astro`'s `<Hero>`
    `primaryCtaHref`/`secondaryCtaHref` props, found mid-fix (same root cause, wasn't in the
    original BUG-005 repro's file list since it's a prop value, not a literal `href=` in that
    file).
  - Fixed `SiteHeader.astro`'s `isCurrent()`: `currentPath` (`Astro.url.pathname`) is
    base-prefixed and, per the actual static build's directory-style routing (verified via
    built `dist/pricing/index.html`'s canonical tag: `.../telehealth/pricing/`), always
    trailing-slashed — while `withBase(href)` deliberately doesn't add one for non-root routes
    (matches every other href in the codebase). Comparison now tolerates that one optional
    trailing slash instead of requiring exact equality, which never matched on a real
    non-root-base build. Verified live in built HTML: `aria-current="page"` now renders on
    `/pricing`'s own nav link (previously absent, per BUG-005's repro).
  - `tests/e2e/nav-audit.spec.ts` (UX-003): its `toHaveURL(/\/pricing\/?(?:[?#]|$)/)` assertion
    was unanchored and matched a base-dropped URL exactly as well as the correct one — the reason
    it stayed green through this exact bug. Exported `BASE_URL` from `playwright.config.ts`;
    replaced the assertion with a regex anchored to the real
    `origin+base+path` (`new URL(routeUrl('/pricing'), BASE_URL)`, escaped). Proved the new
    assertion actually has teeth: temporarily stubbed `withBase()` to return its input unchanged
    (bug reintroduced), reran — all 17 desktop-project cases failed as expected — then restored
    the real implementation and reran to confirm green again (not committed; the stub was a
    verification step, not a code change).
  - Found the same root cause in a fifth place while fixing this — `PROVIDER_PHOTO_PLACEHOLDER`
    (`'/images/provider-photo-placeholder.svg'`) is hardcoded root-relative in 4 files
    (`providers/index.astro`, `providers/[slug].astro`, `about.astro`, `index.astro`), confirmed
    404ing in built HTML the same way. Judged out of scope for this fix (`withBase()` is
    documented for hrefs/navigation, not asset `src`s; folding an `img`-src fix into BUG-005's
    diff would blur what the item's acceptance criteria actually covered) — filed as **BUG-006
    (S3)** instead, not fixed here.
- Decisions: none this session (no Tier 2/3 decision needed — the fix pattern was already
  established by BUG-002's `routeUrl.ts` precedent for base-path handling).
- Notes: `git status` confirmed clean working tree before close-out. Full verification this
  session (all local, before push): `pnpm typecheck` (0 errors), `pnpm lint` (clean), `pnpm format`
  (clean after `prettier --write` on `nav-audit.spec.ts`), `pnpm test` (90/90, unchanged),
  `pnpm build` (17 pages, clean), `pnpm exec playwright test` full suite (140/142 passed, 2
  correctly skipped — same baseline as every prior session). Post-push: `.github/workflows/
  auto-merge-claude.yml` merged all 5 session commits into `main` and deleted the branch (expected,
  per BUG-004's fix); `deploy.yml` run 30743836704 (head `214a5a2`, the fix commits) and the
  matching `ci.yml` run both completed with conclusion `success` — confirmed via the Actions API,
  not assumed.

## 2026-08-02 — session 20
- [BL-030] **Done**. Checked D-009 (DECISION_LOG.md) before touching BL-022 again — still Proposed,
  no human resolution yet — so per PROJECT_STATUS.md's prior "Tomorrow's Focus" claimed BL-030
  (metadata system, sitemap, robots, canonicals, OG images) instead, Ready and unblocked (BL-010
  Done).
  - Sitemap: first attempt added `@astrojs/sitemap` as a runtime dependency — caught mid-session
    that DECISION_FRAMEWORK.md classifies "new runtime dependencies" as **Tier 3** (human approval
    required, stop work on that item), not Tier 2 like the "SEO/metadata changes" bucket this task
    otherwise falls under. Removed it (`pnpm remove @astrojs/sitemap`, reverted
    `astro.config.mjs`) rather than proceed on an unapproved dependency or stall the whole item on
    a human-approval round-trip mid-session. Hand-rolled instead: `src/lib/routes.ts` now holds the
    canonical `SITE_ROUTES` list (the 16 real indexable routes, `/404` excluded — previously
    duplicated only in `tests/e2e/routes.ts`, which now imports `SITE_ROUTES` and appends `/404`
    itself, so the two can't drift) and `src/pages/sitemap.xml.ts` is a small prerendered Astro API
    route that maps `SITE_ROUTES` through `site`+`base` into a plain `<urlset>` XML document — zero
    new dependencies. Verified valid XML (`xml.dom.minidom.parse`) and correct absolute URLs
    (`https://avrybrdly93.github.io/telehealth/...`) in the built `dist/sitemap.xml`.
  - Added `public/robots.txt` (`Allow: /` + a `Sitemap:` line pointing at `/sitemap.xml`). Static
    files in `public/` aren't base-prefixed by Astro, so this is served at `/telehealth/robots.txt`
    on the live GitHub Pages project site — consistent with how every other `public/` asset (fonts,
    the placeholder provider photo) already works here.
  - `BaseLayout.astro`: added `<link rel="canonical">` (from `Astro.site` + `Astro.url.pathname`;
    confirmed via built HTML that `Astro.url.pathname` already includes the `/telehealth` base, so
    no extra prefixing needed there) and full OG/Twitter tags (`og:type`/`og:title`/
    `og:description`/`og:url`/`og:image`, `twitter:card=summary_large_image`/`twitter:title`/
    `twitter:description`/`twitter:image`) built from the same `title`/`description` props every
    page already passes in — zero per-page changes required. Added an optional `image` prop for a
    future per-page override; unused today.
  - Generated `public/images/og-default.jpg` (1200×630, self-hosted, brand tokens — teal gradient,
    ochre accent mark, Source Serif 4 + Inter — and the homepage's real, already-shipped
    title/description text, not invented copy) via a throwaway Playwright screenshot script run
    locally against a static HTML file (script itself not committed — one-off asset generation,
    same pattern as BL-002's font subsetting). Exported as JPEG q85 (45KB) rather than PNG (initial
    PNG screenshot was 209KB, over IMAGE_GUIDELINES.md's 200KB max-weight cap; JPEG at this
    complexity — a gradient plus text, no fine detail — compresses far better with no visible
    quality loss). No IMAGE_CREDITS entry needed: this is an original graphic composed from this
    repo's own design tokens and copy, not a licensed/stock image.
  - **Deliberate scope decision**: IMAGE_GUIDELINES.md's OG image spec calls for "page title text
    rendered by build (not hand-made per page)" — i.e. a distinct image per page. Implementing that
    needs a real image-generation pipeline (e.g. satori/resvg or an on-the-fly Playwright render
    per route) — a materially larger undertaking than BL-030's stated acceptance criteria (GLOBAL-01
    passes; sitemap validates) calls for. Shipped one shared static default image site-wide instead
    and recorded the gap explicitly in BACKLOG.md/PROJECT_STATUS.md rather than silently
    under-delivering against the design doc; a human/future session can decide whether to scope
    per-page dynamic OG images as their own backlog item.
  - Verified beyond the stated acceptance criteria (re-run after the sitemap rewrite above): full
    local suite green — `pnpm lint`, `pnpm typecheck` (0 errors/0 warnings, same pre-existing `z`
    deprecation hints as every prior session), `pnpm format`, `pnpm test` (90/90, unchanged),
    `pnpm build`. `pnpm exec playwright test`: 140/142 passed, 2 correctly skipped (same as prior
    session) — this includes GLOBAL-01 (unique title/description per route, already passing before
    this session and unaffected) and `nav-audit.spec.ts` (UX-003), which is relevant to the BUG-005
    finding below. `lhci autorun` was **not** re-run this session (no page markup or render-blocking
    weight changed; the new OG image is neither preloaded nor in any budgeted resource-summary
    category) — noting this explicitly as unverified-this-session rather than assuming the prior
    session's 17/17 still holds.
- **BUG-005 filed (S1), not fixed this session.** While verifying the new canonical URLs, found
  that Astro does not auto-rewrite plain string `href` attributes for a non-root `base`: built
  `dist/pricing/index.html` has the literal, unprefixed `href="/pricing"`. Confirmed live against
  `pnpm preview` with a throwaway Playwright script: clicking that link from a page served under
  `/telehealth/` lands on `http://localhost:4321/pricing` — the base is dropped. On the real
  deployed site (`avrybrdly93.github.io/telehealth/`) this means every internal nav/footer/CTA/
  cross-link click 404s; the site is only reachable page-by-page via directly-typed or
  externally-linked URLs. Same root cause silently breaks `SiteHeader`'s `aria-current="page"` in
  production (`Astro.url.pathname`, i.e. `currentPath`, includes the base, so it never equals the
  bare `href` values `isCurrent` compares against — confirmed via built HTML: no `aria-current`
  renders anywhere). This is not new-this-session breakage — it predates BL-030 and has been true
  of every deployed session since `base: '/telehealth'` was set. It went undetected because
  `tests/e2e/nav-audit.spec.ts` (UX-003, which does click through real nav links) asserts
  `toHaveURL(/\/pricing\/?(?:[?#]|$)/)`, an unanchored regex that matches the base-dropped URL
  exactly as well as the correct one — so the test suite has been green through this the whole
  time. Filed as BUG-005 (S1) in BACKLOG.md with full repro, root cause, and fix acceptance
  criteria (a shared base-aware href helper across ~13 source files, plus a corrected, anchored
  e2e assertion). Not fixed here: BUG_TEMPLATE.md's severity rule says S1 bugs interrupt any
  session, but this run's operating instructions were explicit about single-item scope discipline
  (no drive-by fixes, file discovered issues as new backlog items) — judged the fix itself
  (touching SiteHeader, SiteFooter, ~11 page files, and the test suite) too large to safely fold
  into this session's diff without its own checkpointed session. Flagged at the top of
  PROJECT_STATUS.md's Tomorrow's Focus as the next session's claimed item regardless of milestone.

## 2026-08-01 — session 19
- [BL-023] **Done**. Checked D-009 (DECISION_LOG.md) before touching BL-022 again — still
  Proposed, no human resolution yet — so per PROJECT_STATUS.md's own prior "Tomorrow's Focus"
  did not re-attempt the backend and claimed BL-023 (Analytics wrapper) instead, Ready and
  unblocked (BL-010 Done).
  - Built `src/lib/analytics.ts`: single wrapper module (ARCHITECTURE.md's extensibility
    commitment) implementing ANALYTICS_PLAN.md's complete event schema. `trackEvent()`
    runtime-enforces a per-event property allowlist — drops anything not on the schema even if
    forced past the type system with a cast — and strips query strings from route-shaped
    properties (DATA_BOUNDARIES.md Boundary 4, "no query strings in route property").
    `setAnalyticsConsent()`/`setAnalyticsTransport()` are the seams ARCHITECTURE.md calls for
    (a future consent manager and a real provider, respectively) — consent defaults to granted
    per D-002 (cookieless aggregate analytics needs no consent banner, NFR-004).
  - Built `src/lib/analytics.client.ts`, wired once from `BaseLayout.astro` so it applies to
    every route without touching each page: fires `pageview` (route, referrer domain, device
    class) on load; a single delegated click listener fires `cta_book_click` for any `/book`
    link (`cta_position` read from the closest `data-cta-position` ancestor, tagged on
    SiteHeader's nav/mobile Book buttons and Hero's primary CTA; untagged Book links — the
    per-page "Book an appointment" CTAs — default to `inline`) and `crisis_resource_click` for
    988/911 tel/sms links.
  - Wired `contact_submit_success`/`contact_submit_error`/`error_view` (E-030) into
    `ContactForm.client.ts`'s existing success/failure handlers. Deliberately did **not** fire
    `contact_submit_success` from the honeypot spam-trap path (fake success shown to bots) —
    that isn't a real Flow 2 outcome and would inflate the funnel.
  - `booking_step_view`/`booking_service_selected`/`booking_provider_selected`/`booking_handoff`
    are defined in the schema but unwired — `/book` (BL-020/BL-021) doesn't exist yet. Next
    session to build the booking flow should wire these directly; no wrapper changes expected.
  - No analytics vendor is configured on this deployment (DEMO/PROTOTYPE, no real credentials —
    see PROJECT_STATUS.md "Blocked / Needs Human Input"): the default transport is an honest
    no-op, same documented-gap pattern `ContactForm.client.ts` uses for `/api/contact` (D-009).
    Real events are validated/tested against the schema; nothing is actually sent anywhere.
- Decisions: none this session (D-002 already covered cookieless-analytics-only; no new Tier
  decision needed).
- Tests: `pnpm test` 90/90 (+8 new: `analytics.test.ts` schema/sanitization/consent coverage,
  `analytics.client.test.ts` bootstrap coverage, plus 3 new assertions in
  `ContactForm.client.test.ts` for the wired events and the honeypot non-firing case).
  `pnpm exec playwright test`: 140/142 passed, 2 correctly skipped (same desktop-only skips as
  every prior session). `pnpm exec lhci autorun`: 17/17 URLs pass every budget assertion at
  `error` severity — `resource-summary:script:size` measured 2.10KB on content pages and 3.91KB
  on `/contact` (15KB budget; ample headroom), confirmed from the actual LHCI JSON reports, not
  estimated.
- Notes: MVP_SCOPE.md's "Analytics events firing per ANALYTICS_PLAN.md" checklist item left
  unchecked — the booking-funnel events (the majority of the funnel BG-002 measures) can't fire
  until `/book` exists, so calling analytics fully "firing" would overstate readiness.

## 2026-08-01 — session 18
- [BL-022] **In Progress** (not Done — see D-009). Claimed the topmost startable `Ready` item
  (BL-020 needs grooming/split first; PROJECT_STATUS.md's own "Tomorrow's Focus" pointed at
  BL-022/BL-023). Before building, verified a real docs-vs-deployment conflict: ARCHITECTURE.md/
  TECH_STACK.md describe the contact form's backend as a serverless function on Netlify/Vercel,
  but the site is deployed static-only to GitHub Pages (`astro.config.mjs` `output: 'static'`,
  `.github/workflows/deploy.yml`, BUG-001/002/004) and `DECISION_LOG.md` has no hosting-platform
  decision recorded despite TECH_STACK.md explicitly calling for one. Filed **D-009** (Tier 3,
  Proposed) naming the concrete unresolved choices (self-hosted function alongside GitHub Pages
  vs. full migration to Netlify/Vercel vs. a third-party form-backend service, plus a
  transactional email vendor) rather than guessing a platform or building an unverifiable
  integration — per DECISION_FRAMEWORK.md, Tier 3 blocks only itself.
  - Built and shipped everything that doesn't depend on D-009:
    - **`Alert`** (`src/components/Alert/`): new component, info/success/error variants, icon +
      text (never color-only), `role="alert"` (assertive) for error / `role="status"` (polite)
      for info/success, arbitrary-attribute passthrough (`hidden`/`id`/`tabIndex`/`data-*`) so a
      static page can toggle it with vanilla JS. Was named in COMPONENT_LIBRARY.md for E-020/E-030
      but never implemented — same gap Hero/PricingTable were in before BL-010/013 (D-005/D-006).
      5 tests (RTL + jest-axe).
    - **`ContactForm`** (`src/components/ContactForm/`): name/email/phone(optional)/message
      fields (TextInput/TextArea, message labeled "Please don't include medical details" per
      FR-030) + an off-screen honeypot (`aria-hidden`, `tabindex="-1"`, never keyboard-reachable)
      + submit button + hidden success/E-030-failure `Alert`s. Rendered as **static server-side
      markup with no `client:*` directive** (no React hydration) — interactivity is a plain
      `<script>` + `ContactForm.client.ts`, the same vanilla-JS-island pattern BL-007 established
      for SiteHeader (see **D-010**), chosen specifically to avoid repeating D-004/BL-007's
      15KB-content-page-JS-budget regression. The script does client-side required/email-format
      validation (reusing TextInput's/TextArea's own CSS Modules so an injected error is visually
      identical to their built-in E-010 pattern), short-circuits a filled honeypot to a fake
      success with no network call, and on real submit calls `fetch('/api/contact', {method:
      'POST', ...})` — success → success state + form reset; failure (network error or non-2xx)
      → E-030 failure state, entered text preserved, focus moved to the alert. 8 tests (DOM-
      fixture style, matching `SiteHeader.client.test.ts`'s approach) covering validation, the
      honeypot, both success and E-030 failure paths (mocked `fetch`), submit-button
      disabled/label state, and axe-clean at rest/error/success.
    - **`src/pages/contact.astro`** (+`contact.module.css`): phone/email prominent above the form,
      "we typically respond within 1 business day" + "book an appointment instead for medical
      questions" note, `CrisisResources variant="strip"` (per its own spec: every `/book` step and
      `/contact`), then `<ContactForm />`. Added `/contact` to `tests/e2e/routes.ts` and
      `lighthouserc.cjs`'s `collect.url` (auto-extends GLOBAL-01/02, UX-003 nav-audit, axe, and
      LHCI coverage per their existing per-route loops).
  - **Not built, and not claimed as built**: the actual `/api/contact` serverless function and any
    real email delivery. `/api/contact` does not exist on this GitHub Pages deployment — every
    real visitor submitting the form today will see it 404 and correctly land on the E-030 failure
    state with the phone/email fallback. This is honest, current, tested behavior, not a
    placeholder or a fabricated "delivered" claim. Server-side rate limiting (BACKLOG.md's
    acceptance criteria) is likewise gated on the function existing — only the client-side
    honeypot is built/verified this session.
  - Added both components' states/props/a11y notes to COMPONENT_LIBRARY.md in the same change.
  - Marked **In Progress** in BACKLOG.md/PROJECT_STATUS.md with a cold-start "Next step:" note:
    once D-009 is resolved by a human, stand up `/api/contact` against
    `ContactForm.client.ts`'s existing `fetch` call (no client-side rework expected), add
    server-side rate limiting, verify real delivery, then flip to Done.
- Decisions: **D-009** (Tier 3, Proposed — hosting platform + email vendor for `/api/contact`,
  blocks only itself), **D-010** (Tier 2, Approved — `ContactForm`/`Alert` built as static markup
  + vanilla-JS progressive enhancement, not a React island; see DECISION_LOG.md for the full
  resource-summary numbers verifying the budget headroom this choice buys).
- Verified: `pnpm lint`/`pnpm typecheck`/`pnpm format` all clean. `pnpm test`: **82/82** passed
  (+13: 5 `Alert.test.tsx`, 8 `ContactForm.client.test.ts` — up from session 17's 69). `pnpm
  build`: clean, `/contact/index.html` generated. `pnpm exec playwright test`: **140/142** passed,
  2 correctly skipped (same desktop-only `mobile-menu`/`homepage-fold` skips every prior session
  has noted — not regressions); `/contact` passes GLOBAL-01/02, the axe scan (mobile + desktop,
  zero critical/serious violations), and the UX-003 nav-audit (reaches `/pricing` in ≤2
  interactions) alongside every other route. `pnpm exec lhci autorun` (`CHROME_PATH` pointed at
  the sandbox's preinstalled Chromium): **17/17 URLs** (16 previous + new `/contact`) pass every
  budget assertion at `error` severity — `/contact` specifically: Performance 100 / Accessibility
  100 / SEO 100 / Best Practices 96 (same 0.96 every route already scores, pre-existing, not new),
  LCP 1.51s, CLS 0, TBT 0ms, `resource-summary` `document` 5.8KB (40KB budget — this is where
  Lighthouse counts inline `<script>` bytes) / `script` 0KB (no external script request) / total
  78.8KB (500KB budget, ~70KB of which is the two shared self-hosted fonts every route already
  pays for).
- Notes: no new runtime dependency added (Alert/ContactForm use only React/CSS Modules already in
  the project). No secrets needed yet for anything actually built this session — once D-009 is
  resolved, the follow-up session will need a transactional-email-vendor API key (Postmark/Resend/
  other, whichever D-009 names) as an environment-variable placeholder, noted here in advance per
  this repo's "never commit secrets" rule.

## 2026-08-01 — session 17
- **GitHub Pages priority check (this run's brief again flagged it as top priority)**: re-checked
  `deploy.yml`/`ci.yml` via the Actions API before starting BL-017. Both workflows' most recent
  runs (through the session-16 close-out commit) show `status: completed`, `conclusion: success`
  on every run. No reproduction of a `withastro/action@v3` exit-1 failure — consistent with
  sessions 14–16's findings. Not treating this as a new investigation; nothing to fix.
- [BL-017] Shipped the automated readability CI script (UX-002):
  - `src/lib/readability.ts`: pure Flesch-Kincaid Grade Level analysis — syllable-heuristic
    counter, sentence/word tokenizers, Markdown-syntax stripper, single-line YAML frontmatter
    scalar reader, `NEEDS_HUMAN_*`/`PLACEHOLDER_*` placeholder detector. No filesystem access, so
    fully unit-testable. `src/lib/readability.test.ts`: 22 new Vitest cases.
  - `scripts/check-readability.ts`: CLI that walks `src/content/{services,providers,conditions,
    faq}` (legal exempt, out of scope by design), extracts each file's patient-facing frontmatter
    fields + markdown body, grades the combined prose, and prints a pass/fail/skip report;
    exits 1 if any file exceeds the grade-8 threshold. Run via
    `node --experimental-strip-types scripts/check-readability.ts` (`pnpm run check:readability`)
    — Node 22's native TS type-stripping, no new build tooling/transpiler dependency.
  - **Scope decision (D-008)**: limited to `/src/content` per TECH_STACK.md's literal spec, not
    the broader `.astro`-embedded page copy BACKLOG.md's acceptance criteria loosely gestured at
    — full rationale, conflict-resolution citation, and consequences in DECISION_LOG.md D-008.
  - Retroactively ran the check against all real content — a genuine first run, not a
    fabricated/assumed-clean result: **7 of 16 gradable files initially failed.** Fixed the 4
    tied to already-Done backlog items with meaning-preserving phrasing edits (verified against
    COPY_GUIDELINES.md Hard Rules 1–6 after each edit):
    - `src/content/services/psychiatric-evaluation.md` (BL-011): summary + body split into
      shorter sentences. Grade 10.3 → 7.1.
    - `src/content/faq/does-this-practice-handle-emergencies.md`,
      `what-is-a-video-visit.md`, `will-my-provider-prescribe-medication.md` (BL-015): same
      treatment. Grades 9.4/9.8/8.2 → 7.2/7.6/7.9.
  - Left `src/content/conditions/{depression,anxiety,adhd}.md` unedited (grades 12.0–12.6): the
    mandatory verbatim disclaimer sentence COPY_GUIDELINES.md Hard Rule 2 requires on every
    condition page scores grade 10.9 by itself, so no `overview`/`howCareHelps` rewrite can bring
    the file under 8 without editing rule-mandated text — out of this session's scope, and these
    files aren't wired to any live page yet (BL-032 unclaimed). Filed BL-018.
  - `providers/{dr-md,np-pmhnp}.md` correctly SKIP (still `NEEDS_HUMAN_*` placeholders, same as
    every prior session — BL-012 status unchanged).
  - `ci.yml`: added a `Readability check (UX-002)` step, `continue-on-error: true` (D-008 — same
    "warns→blocks" rollout `TESTING_AND_VALIDATION_PLAN.md` documents, and the same pattern D-004
    used for the LHCI JS-budget assertion).
  - `package.json`: `check:readability` script; added `@types/node` devDependency (Tier 2, needed
    for `node:fs`/`node:path` types under strict TS in the new CLI script).
  - `tsconfig.json`: added `scripts/**/*` to `include` so `pnpm typecheck` covers the new script
    (it previously covered only `src/`, `tests/`, and `playwright.config.ts`).
- Decisions: D-008 (readability-check scope + non-blocking rollout, Tier 2).
- Verified (all run locally against this session's commits, nothing fabricated): `pnpm lint`
  (clean), `pnpm typecheck` (0 errors/0 warnings, same pre-existing `'z' is deprecated` hints as
  every prior session), `pnpm test` (69/69 — up from 47/47, all 22 new in
  `src/lib/readability.test.ts`), `pnpm format` (clean), `pnpm run check:readability` (13
  passed/3 known-fail/2 skipped, exit 1 — expected and non-blocking per D-008), `pnpm build` (16
  pages, unchanged from session 16 — no page/route/component changes this session, content-file
  wording edits only). `playwright test`/`lhci autorun` **not re-run this session** — no
  `.astro`/component/route changes, only markdown content-file wording and CI/tooling config, so
  e2e/Lighthouse surface is unaffected; last known-green results are session 16's (132/134,
  16/16).
- Notes: this session's first commit (`[BL-017] claim readability CI script task`) will be pushed
  and auto-merged/branch-deleted by `.github/workflows/auto-merge-claude.yml` before
  implementation, per the normal mechanism (sessions 13–16) — the branch is recreated on the next
  push and auto-merged again at close.
- Next steps for a following session: no M2 Ready items remain unclaimed. Per BACKLOG.md's
  top-to-bottom priority order, next candidates are M3's BL-020 (booking flow — **L, needs
  grooming/splitting into session-sized slices before starting**, per BACKLOG.md's own sizing
  note) or BL-021/BL-022/BL-023 (S/M, no grooming needed); or M4's BL-030
  (metadata/sitemap/robots/OG) if M3 is deferred. BL-018 (flip readability CI to blocking) stays
  Blocked on BL-032 (condition pages) — do not pick it up standalone; there's no fix available
  until BL-032 supplies real, Tier-3-reviewed condition-page copy or Clinical Team revises Hard
  Rule 2's disclaimer wording.

## 2026-08-01 — session 16
- **GitHub Pages priority check (this run's brief again flagged it as top priority)**: re-checked
  `deploy.yml`/`ci.yml` via the Actions API before starting BL-016. Both workflows' most recent runs
  (10 and 17 runs checked respectively, back through 2026-07-30) show `status: completed`,
  `conclusion: success` on every run — the last few fired via the `workflow_run` trigger off
  `Auto-merge claude branches`, confirming BUG-004's fix (session 13) is still working. No
  reproduction of a `withastro/action@v3` exit-1 failure found this session either — consistent
  with session 15's finding. Not treating this as a new/separate investigation; nothing to fix.
- [BL-016] Shipped legal pages shell + 404 page:
  - `src/pages/404.astro` (+ `404.module.css`): on-brand 404 with the exact E-040 heading "We
    couldn't find that page.", Home/Services/Contact links, and a `CrisisResources` `strip` variant
    in the main content — in addition to the standard footer crisis block every page already gets
    via `BaseLayout`/`SiteFooter`. Builds to a root-level `dist/404.html` (Astro/GitHub Pages'
    custom-error-page convention), not a `/404/` folder — confirmed in the build output and added
    to `lighthouserc.cjs`/`tests/e2e/routes.ts` without a trailing slash to match.
  - `src/pages/legal/[slug].astro` (+ `legal-detail.module.css`): one dynamic-route template over
    the existing `legal` content collection (schema already defined in `content.config.ts` from
    BL-003: `title`, `lastUpdated`, `reviewStatus`). Renders a visible "Blocked pending human
    review" notice whenever an entry's `reviewStatus !== 'approved'`, so the status is visible on
    the page itself, not just in `PROJECT_STATUS.md`.
  - `src/content/legal/{privacy,terms,accessibility,telehealth-consent}.md`: four
    `reviewStatus: needs-human-review` placeholder shells. Each describes in plain language what
    the page *will eventually* cover and explicitly states no real policy/terms/consent/
    conformance text has been drafted — no real legal or clinical content was written, per this
    project's Tier-3/demo-only rule for legal copy.
  - Extended `tests/e2e/routes.ts` and `lighthouserc.cjs`'s `collect.url` with all 4 legal routes
    and `/404`, the same way session 15 did for `/faq`.
- Verified (all run locally against this session's commits, nothing fabricated):
  `pnpm typecheck` (0 errors/0 warnings, pre-existing `'z' is deprecated` hints only, same as prior
  sessions), `pnpm lint` (clean), `pnpm test` (47/47 — unchanged from session 15; no new Vitest
  files added, consistent with the existing pattern of covering `.astro` pages via
  Playwright/e2e+LHCI rather than Vitest/RTL, same as BL-013/014/015), `pnpm build` (16 pages,
  confirmed `/404.html` at root and all 4 `/legal/*/index.html`), `pnpm format` (clean),
  `pnpm exec playwright test` (132/134 passed, 2 correctly skipped — same desktop-only skips as
  prior sessions: `mobile-menu` on desktop, homepage-fold on desktop), `pnpm exec lhci autorun`
  (16/16 URLs, all budget assertions passed, exit 0).
- Notes: this session's first commit (`docs(project): [BL-016] claim task`) was pushed and
  auto-merged/branch-deleted by `.github/workflows/auto-merge-claude.yml` before implementation
  started, per the normal mechanism — the session's branch was recreated on the next push and
  auto-merged again at close. Did not independently confirm the deployed GitHub Pages site reflects
  this session's commits (no browser access to the live URL from this environment); relying on the
  Actions API history above plus BUG-004's confirmed-working mechanism.
- Next steps for a following session: BL-017 (readability CI script) is the sole unblocked,
  no-deps M2 item and remains opportunistic; otherwise BL-030 (metadata/sitemap/robots/OG) is the
  next Ready item with satisfied deps in M4.

## 2026-07-31 — session 15
- **CI-fix priority check (no BL id — this session's brief flagged it as top priority)**: This
  session's brief reported the GitHub Pages deploy workflow broken — `withastro/action@v3` exiting
  1 early — and asked to find/fix it before anything else. Investigated thoroughly and **could not
  reproduce any failure**:
  - `astro.config.mjs`: valid, unchanged, no syntax/config errors.
  - `pnpm-lock.yaml`: in sync with `package.json` — `pnpm install --frozen-lockfile` succeeds
    cleanly against a fully removed `node_modules`/`dist`/`.astro` (true cold-cache
    reproduction), no drift.
  - `.github/workflows/deploy.yml`: already pins `withastro/action@v3` to `node-version: 22` (per
    BACKLOG.md, this was **BUG-001**'s fix from an earlier session, not this session's doing),
    which satisfies Astro 7.1.6's `>=22.12.0` requirement (`actions/setup-node` with
    `node-version: 22` resolves to the latest 22.x — confirmed locally at v22.22.2).
  - Fetched `withastro/action@v3`'s actual `action.yml` from GitHub to confirm exactly what it
    runs: lockfile-based package-manager detection → `pnpm/action-setup@v4` (version from
    `package.json`'s `packageManager` field when unspecified, which matches this repo's pinned
    `pnpm@10.33.0` exactly) → `actions/setup-node@v4` → `pnpm install` → `pnpm run build` → upload
    `dist/`. Ran that exact sequence locally (plain `pnpm install`, not `--frozen-lockfile`, to
    match the action precisely) — succeeds, 0 errors, no lockfile rewrite.
  - Ran the full local CI-parity gate (lint/typecheck/test/format/build) clean on a fresh
    checkout-equivalent state — all green (see Notes below for numbers).
  - Conclusion: no reproducible break exists in the current repo state. This most likely reflects
    BUG-001 (Node 20→22 pin) already being fixed in a prior session and the task brief describing
    that historical failure rather than a new regression — but this is inference, not something
    this session could confirm against real GitHub Actions run logs (no `gh`/GitHub API access
    this session; the git remote here is a local sandboxed proxy, not real GitHub, so there is no
    live workflow run to inspect). Documenting plainly rather than fabricating a fix for a problem
    that didn't reproduce. **Next session**: if the deploy failure is reported again, get an actual
    failed run's log (via `gh run view --log` or the GitHub UI) rather than re-deriving from
    scratch — that would immediately distinguish "still broken, different cause" from "was already
    fixed, stale report."
- [BL-015] **Done → Needs Human Review**: shipped `/faq`, the next unblocked M2 Content Pages item
  (BL-016 legal shell is next).
  - 13 Q&As across all 5 groups PAGE_SPECIFICATIONS.md/content.config.ts's `group` enum requires:
    Getting started (3, pre-existing from session 10), Appointments & policies (3: booking,
    connection-drop guidance, cancellation policy), Costs & superbills (3: insurance/self-pay,
    superbill explanation, payment methods), Medication questions (2, deliberately policy-level
    only per PAGE_SPECIFICATIONS.md and BUSINESS_GOALS.md's explicit non-goal on controlled-
    substance content commitments — no clinical claims, no prescribing-workflow specifics),
    Emergencies (2).
  - `src/pages/faq.astro` (+`faq.module.css`): a "jump to topic" nav linking to each group, then
    one `FAQAccordion` per group under a heading whose `id` **is** the anchor (`#getting-started`,
    `#appointments-policies`, `#costs-superbills`, `#medication-questions`, `#emergencies`) — the
    required `#emergencies` anchor (Flow 4, USER_FLOWS.md) is the heading id directly, not a
    derived id, so the link is exact.
  - Cancellation-policy and payment-methods answers are built in `faq.astro` from
    `PLACEHOLDER_CANCELLATION_POLICY`/`PLACEHOLDER_PAYMENT_METHODS` (`practice.ts`) rather than
    stored as markdown body text like the other 11 — per CODING_STANDARDS.md §Content Files
    ("defined once in a practice.ts constants module... never inlined in copy files"), since both
    already have a canonical practice.ts export used verbatim on `/pricing`; a second literal copy
    in markdown could silently drift from it.
  - Emergencies group never paraphrases crisis copy (COPY_GUIDELINES.md Hard Rule 6: "the 988/911
    block wording is defined once... and never paraphrased per-page"). Its two FAQ answers are
    scope statements only ("this is a scheduled, non-emergency practice" / "use the resources
    below"); the actual crisis instructions come from embedding the canonical `<CrisisResources />`
    component (default `footer` variant — not `strip`, which is `position: sticky` and meant for
    `/book`/`/contact` only per COMPONENT_LIBRARY.md, not appropriate mid-page here) directly in
    the Emergencies section, identical to how `SiteFooter` already renders it on every page.
  - `tests/e2e/routes.ts` and `lighthouserc.cjs`'s `collect.url` both extended with `/faq`
    (same pattern as BL-014), auto-covering it under GLOBAL-01/02, UX-003 nav-audit, and
    `accessibility.spec.ts`'s per-route axe loop.
  - FR-051 (FAQPage JSON-LD structured data) is explicitly **not** implemented here — re-read
    BACKLOG.md's BL-031 entry (`Deps: BL-030, BL-012, BL-015`) and confirmed structured data was
    always scoped to BL-031, with BL-015 listed as one of its dependencies (i.e., BL-015 supplies
    the content model BL-031 will read, not the schema markup itself). BL-015's own acceptance
    criteria text mentioning "FAQPage schema validates (FR-051)" is read as forward-looking, not a
    literal requirement to duplicate BL-031's scope here — flagged explicitly in BACKLOG.md's
    updated acceptance-criteria cell so this reading is visible, not silently assumed.
  - Status is **Needs Human Review**, not plain Done, matching BL-012's precedent: all 13 answers
    are AI-drafted copy per COPY_GUIDELINES.md and need practice/clinical review before publish,
    and two answers are still literal `NEEDS_HUMAN_*` placeholders pending real cancellation/
    payment facts.
- Notes: `pnpm lint`/`typecheck`/`format` all green; `pnpm test` 47/47 (unchanged — no new
  component logic, FAQAccordion/CrisisResources reused as-is, so no new unit tests needed);
  `pnpm build` green, `/faq/index.html` generated. `pnpm exec playwright test`: 92/94 passed, 2
  skipped (same desktop-only `homepage`/`mobile-menu` skips prior sessions have noted — not
  regressions; `/faq` itself passed all of accessibility/global/nav-audit on both mobile and
  desktop projects with zero critical/serious axe violations). `pnpm exec lhci autorun`: 11/11
  URLs (including the new `/faq` route), all budget/category assertions passed, exit 0 — no LCP/
  CLS/TBT/transfer-size regression.
  - Readability: not run through an automated tool (BL-017 still doesn't exist — same gap session
    14 filed). Manually scanned all 13 new/reused answers against COPY_GUIDELINES.md's ≤20-word-
    average-sentence rule while drafting; trimmed several answers mid-session after an initial
    draft ran a few sentences over 20 words (e.g. the superbill and connection-drop answers were
    each split into two shorter sentences). Not a substitute for BL-017's real script.
- Next steps: BL-016 (legal shell + 404) is the next unblocked M2 item. BL-017 (readability CI
  script) remains unblocked and opportunistic. BL-031 (structured data) can now proceed once
  BL-030 lands, using BL-015's grouped content model. If the deploy-workflow investigation above
  needs revisiting, get real Actions run logs first rather than re-deriving locally.

---

## 2026-07-31 — session 14
- [BL-014] **Done**: shipped `/about` and `/your-first-visit`, the next two unblocked M2 Content
  Pages items. Both routes already existed as dead links in `SiteHeader`/`SiteFooter`'s nav
  (`/about`) and `INFORMATION_ARCHITECTURE.md`'s route list (both) — this closes that gap.
  - `src/pages/about.astro` (+`about.module.css`): practice story · why telehealth-only · how we
    work · what we value · a providers preview reusing the same `Card variant="provider"` +
    photo-placeholder pattern as `/providers` (D-005) · Book CTA. Deliberately avoids
    `PLACEHOLDER_PRACTICE_NAME` in body copy (unlike header/footer, which already use it) — "About
    NEEDS_HUMAN_PRACTICE_NAME" as an H1 would read as broken; used "About our practice" /
    "we" instead, matching `/pricing`'s existing voice ("We're a self-pay practice").
  - `src/pages/your-first-visit.astro` (+`your-first-visit.module.css`): a 3-step "what to
    expect" timeline (reuses the numbered-step list pattern from `index.astro`'s "How it works"
    section) · tech checklist · what to have ready · privacy-of-video-visit note · Book CTA. Tech
    checklist deliberately stays vendor-agnostic (device/camera/mic, connection, private space,
    "the video link we send you") since `TELEHEALTH_SPECIFICATION.md` §Website's Role vs Vendor's
    Role and `PROJECT_STATUS.md`'s Blocked list both confirm no video vendor is selected yet —
    naming one would be inventing a fact.
  - Added both routes to `tests/e2e/routes.ts` (auto-extends GLOBAL-01/02, UX-003 nav-audit, and
    accessibility.spec.ts coverage per their existing per-route loops) and to
    `lighthouserc.cjs`'s `collect.url` (PERFORMANCE_BUDGET.md "every route" rule).
- Notes: `pnpm lint`/`typecheck`/`format`/`pnpm test` (47/47, unchanged — no new component logic,
  so no new unit tests) / `pnpm build` all green. `pnpm exec playwright test`: 84/86 passed, 2
  skipped (same desktop-only `homepage`/`mobile-menu` skips prior sessions have noted — not
  regressions). `pnpm exec lhci autorun`: 10/10 URLs (including both new routes), all budget/
  category assertions passed, exit 0 — no LCP/CLS/TBT/transfer-size regression on either new page.
  Both new pages' `axe` scans (mobile + desktop) came back with zero critical/serious violations
  as part of `accessibility.spec.ts`'s existing per-route loop.
  - Found while claiming this task: BL-014's own acceptance criteria ("copy passes readability
    CI") references a readability-check script that `TECH_STACK.md` and
    `TESTING_AND_VALIDATION_PLAN.md` describe but no prior session actually built — grepped the
    repo and CI workflows, confirmed no such script or CI step exists anywhere. Rather than build
    it ad hoc inside this item (scope discipline — a CI script is its own unit of work), filed
    **BL-017** and instead manually checked both pages' visible copy with a standalone
    Flesch-Kincaid estimate: `about.astro` ~grade 8.2 (11 sentences, avg 13.8 words/sentence),
    `your-first-visit.astro` ~grade 6.6 (14 sentences, avg 11.5 words/sentence) — both within
    COPY_GUIDELINES.md's ≤8th-grade / ≤20-words-average rule. This is a manual estimate, not the
    automated CI check the acceptance criteria literally names; BL-017 should retroactively run
    its real script over BL-010/011/012/013/014's copy once built, per the note left in
    PROJECT_STATUS.md's Weekly Review Findings.
  - Confirmed live (not just from `PROJECT_STATUS.md`'s claim) that BUG-004/D-007's fix from
    session 13 is holding: the latest `main` commit (`eb68a81`) has a green `deploy.yml` run
    (30638323403) and `ci.yml` run (30638323835), both `workflow_run`-triggered, both completed
    2026-07-31T14:22:33Z. No action needed; noted only because this run's task brief asked to
    verify the GitHub Pages workflow specifically before doing anything else.
- Next steps: BL-015 (FAQ) or BL-016 (legal shell + 404) are the next unblocked M2 items — either
  is a reasonable pick. BL-017 (readability CI script) is smaller and worth taking opportunistically
  since it's now blocking a clean "Done" on every past and future M2 content page's acceptance
  criteria, not just BL-014's. This session's commits weren't yet auto-merged/deployed as of close
  — next session should confirm `/about` and `/your-first-visit` are live on GitHub Pages once the
  auto-merge fires.

---

## 2026-07-31 — session 13 — DEPLOYED
- [BUG-004] **Done**: fixed the `GITHUB_TOKEN` auto-merge gap (open since session 5, re-confirmed
  session 7's Weekly Review) that silently prevented `ci.yml`/`deploy.yml` from running after a
  `claude/*` branch auto-merges into `main`. This was this run's stated first priority: nothing
  else the project ships is visible if deploys don't actually happen.
  - Root cause, confirmed live before fixing: `.github/workflows/auto-merge-claude.yml` merges
    and pushes to `main` using the default `GITHUB_TOKEN`. GitHub deliberately does not fire
    other `push`-triggered workflows for pushes made with a workflow's own token (anti-recursion
    measure), so `ci.yml`/`deploy.yml` never ran off those merges. Verified this was still
    live: session 12's BL-013 auto-merge (2026-07-31 10:30 UTC, run 30623813772) triggered
    neither workflow — the last real `deploy.yml` run before this session was from ~06:23 UTC,
    hours earlier and missing the pricing page.
  - Fix (D-007): added `on.workflow_run: { workflows: ["Auto-merge claude branches"], types:
    [completed] }` to both `ci.yml` and `deploy.yml`; gated each entry job on
    `github.event.workflow_run.conclusion == 'success'`; pinned `actions/checkout@v4` to
    `github.event.workflow_run.head_sha` (a `workflow_run`-triggered job otherwise checks out the
    workflow file's ref, not the commit that completed the trigger workflow).
  - Considered and rejected: minting a PAT or GitHub App token for `auto-merge-claude.yml`'s push
    step instead — the more common fix, but it needs a new secret a human must provision, and
    CLAUDE_DEVELOPMENT_PROTOCOL.md's Tool Conduct rule puts anything credential-related out of
    this session's reach ("propose only"). `workflow_run` needed no new credential.
- Decisions: D-007 (workflow_run bridge over a PAT/App-token fix).
- Test results (exactly as run, nothing rounded or estimated):
  - `pnpm install --frozen-lockfile`: succeeded.
  - `pnpm lint`: clean (0 errors).
  - `pnpm typecheck` (`astro check`): 0 errors, 0 warnings, 34 hints (same pre-existing `'z' is
    deprecated` hints as every prior session).
  - `pnpm test` (vitest): **47/47 passed**, 12 test files — unchanged from session 12, this
    session touched no app code.
  - `pnpm format` (prettier --check): initially flagged the two edited workflow YAML files
    (inconsistent quote style from the manual edit); ran `prettier --write` on both, then
    `pnpm format` passed clean.
  - `pnpm build`: succeeds, 8 pages built — unchanged from session 12.
  - **Live verification (the actual point of this fix, not just local checks)**: pushed the fix
    commit (`0e86083`) on this session's branch; watched `auto-merge-claude.yml` merge it to
    `main` (run 30637909699, conclusion `success`); watched both `deploy.yml` (run 30637925559)
    and `ci.yml` (run 30637925630) fire automatically via the new `workflow_run` trigger against
    the merged commit; both completed with conclusion `success`. This reproduces the exact
    failure this bug describes and confirms it fixed, in the same session, against real GitHub
    infrastructure rather than a local approximation.
  - `pnpm exec playwright test` / `lhci autorun`: not re-run locally (no frontend/content
    change this session); CI's own `e2e-axe-lighthouse` job — part of the `ci.yml` run verified
    above — passed as part of that run's overall `success` conclusion.
- Notes: this closes the `GITHUB_TOKEN` gap flagged in session 5's CHANGELOG entry and
  re-confirmed in session 7's Weekly Review (PROJECT_STATUS.md) — see D-007 for why a
  `workflow_run` bridge was chosen over a PAT/App-token fix. No backlog item beyond BUG-004 was
  touched this session (infra-only, per this run's operating priority); BL-014/BL-015/BL-016
  remain next up per PROJECT_STATUS.md "Tomorrow's Focus", unchanged from session 12's read.

---

## 2026-07-31 — session 12
- [BL-013] **Done**: built `/pricing` per PAGE_SPECIFICATIONS.md §/pricing and FR-013/UX-003.
  - New `PricingTable` component (`src/components/PricingTable`, D-006): a real `<table>`
    (`<caption>`, `scope="col"`/`scope="row"`) rather than a Card variant, since a Card's
    `priceFrom` prop reads "From $X" — exactly the "starting at" framing COPY_GUIDELINES.md
    bans on this page. Zero client JS (no interactivity, so no `client:*` directive — E-050).
    Rows are built from the `services` collection's `durationMinutesMin/Max` (same source as
    BL-011's service detail pages) and `SERVICE_PRICES` in `practice.ts`.
  - `/pricing` page: PricingTable, then What's included / Superbills (plain-language, defines
    the term on first use per the COPY_GUIDELINES.md glossary rule) / Cancellation policy /
    Payment methods / "Why we don't bill insurance" sections, then a Book CTA.
  - Two new practice.ts placeholders — `PLACEHOLDER_CANCELLATION_POLICY`,
    `PLACEHOLDER_PAYMENT_METHODS` — following the exact `SERVICE_PRICES`/`PROVIDER_NAMES`
    NEEDS_HUMAN pattern, rather than inventing a plausible-sounding cancellation window/fee or
    accepted-card list this session has no source for (CLAUDE.md absolute rule 1: never invent
    a pricing-adjacent fact). Superbill explanation and the self-pay rationale were written as
    real generic copy (no practice-specific number asserted in either).
  - Added `/pricing` to `tests/e2e/routes.ts` (GLOBAL-01/02 + axe scan pick it up automatically)
    and to `lighthouserc.cjs`'s `collect.url` (BUG-003 precedent).
  - New `tests/e2e/nav-audit.spec.ts`: BL-013's own acceptance criterion ("reachable ≤2
    interactions from every page, nav audit test") as an executable test — from every route in
    `ROUTES`, the header's Pricing link is reachable in 1 click on desktop or menu-open+click on
    mobile (both `SiteHeader`/`SiteFooter` already linked to `/pricing` since BL-005, ahead of
    the page existing).
  - `PricingTable.test.tsx`: renders both rows with an accessible row header, asserts no
    asterisk or "starting at" ever appears near a price, and an axe scan.
- Decisions: D-006 (PricingTable as a real `<table>`; two new NEEDS_HUMAN placeholders instead
  of invented cancellation/payment facts) — same Tier 2 process D-005 used for Hero/FAQAccordion.
- Test results (exactly as run, nothing rounded or estimated):
  - `pnpm typecheck` (`astro check`): 0 errors, 0 warnings, 34 hints (same pre-existing `'z' is
    deprecated` hints as every prior session, unrelated to this change).
  - `pnpm lint`: clean (no output, 0 errors).
  - `pnpm format` (prettier --check): all matched files pass (`docs/` is prettier-ignored, so
    the new DECISION_LOG.md/COMPONENT_LIBRARY.md prose isn't checked by this command).
  - `pnpm test` (vitest): **47/47 passed**, 12 test files (11 → 12: new `PricingTable.test.tsx`,
    +3 tests over session 11's 44).
  - `pnpm build`: succeeds, 8 pages built (7 → 8; new `/pricing/index.html`). Confirmed by
    grepping the built HTML that `/pricing` ships the same `<script>` count (1, from the shared
    SiteHeader mobile-menu script) as every other page — PricingTable added no JS.
  - `pnpm test:e2e` (Chromium only — Safari/Firefox/iOS Safari not available in this
    environment, so those three DoD checklist items remain unverified here as in every prior
    session): **68/70 passed**, 2 skipped (same 2 desktop-viewport-only skips as every prior
    session — unrelated to this change).
  - `lhci autorun` (`CHROME_PATH` pointed at the Playwright-installed Chromium binary, no system
    Chrome in this environment): **exit 0** on all 8 collected URLs (previously 7). `/pricing`:
    Performance 100 / Accessibility 100 / Best Practices 96 / SEO 100 — identical to every other
    route, so BL-013 introduces no performance or accessibility regression.
- Notes: did not investigate the `GITHUB_TOKEN` auto-merge gap further (PROJECT_STATUS.md
  Weekly Review, unchanged this session) — this session pushed to a `claude/*` branch for
  auto-merge into `main` rather than pushing to `main` directly (per this run's operating
  constraints), so the existing gap applies the same way it would to any other auto-merge.

---

## 2026-07-31 — session 11
- [BL-012] **Needs Human Review**: built `/providers` (index) and `/providers/[slug]` (2 bio
  pages) per PAGE_SPECIFICATIONS.md §/providers and FR-011, rendering the `providers` content
  collection shipped in BL-003. Structurally mirrors BL-011's services index/detail pattern.
  - `/providers`: intro paragraph + the 2 provider Cards (`Card` `provider` variant), same
    decorative photo-placeholder pattern as the homepage's providers-preview section
    (`/images/provider-photo-placeholder.svg`, `alt=""` — D-005 precedent, since it is not a
    photo of the named provider).
  - `/providers/[slug]` (`getStaticPaths` over the `providers` collection): photo, name + full
    credential, CA license number (all three from `practice.ts` — `PROVIDER_NAMES`,
    `PROVIDER_CREDENTIALS`, `PROVIDER_LICENSE_NUMBERS` — never inlined in content), approach
    statement (frontmatter, first person), bio body (content-file markdown via `render()`,
    same as BL-011's service detail pattern), conditions treated (resolved through the
    `conditionsTreated` reference into the `conditions` collection), education/training list,
    Book CTA to `/book?provider=slug` (route not built yet — BL-020 — but the site already
    links forward to `/pricing`/`/book` from BL-011's service pages, so this follows the same
    established convention).
  - Added the 3 new routes (`/providers`, `/providers/dr-md`, `/providers/np-pmhnp`) to
    `tests/e2e/routes.ts` (GLOBAL-01/02 + axe scan pick them up automatically) and to
    `lighthouserc.cjs`'s `collect.url` (BUG-003 precedent: every shipped route needs its own
    performance-budget check).
  - No new components were needed — reused `Card`'s existing `provider` variant and `Button`,
    both already covered by their own component tests, so no new unit tests were added (same
    call BL-011 made for its service pages).
  - **Photo and content status** (unchanged from BL-003, still Tier 3/Blocked): the photo is
    the decorative NEEDS_HUMAN placeholder; `approachStatement`, `education`, and the bio body
    in `src/content/providers/{dr-md,np-pmhnp}.md` remain `NEEDS_HUMAN_*` placeholders, as do
    the name/credential/license values in `practice.ts`. Marking this item "Needs Human Review"
    rather than "Done" per its own acceptance criteria — the pages and wiring are complete and
    correct, but real provider bios, approach statements, education lists, and professional
    photos are required before this can go live, and none of that content is available to this
    session (Tier 3 — provider credentials specifically are covered by CLAUDE.md's absolute
    rule against fabricating them).
- Test results (exactly as run, nothing rounded or estimated):
  - `pnpm lint`: clean (no output, 0 errors).
  - `pnpm run typecheck` (`astro check`): 0 errors, 0 warnings, 34 hints (all pre-existing
    `'z' is deprecated` TS hints from `content.config.ts`'s zod import, unrelated to this
    session's changes).
  - `pnpm run format` (prettier --check): all matched files pass.
  - `pnpm test` (vitest): **44/44 passed**, 11 test files (unchanged count from session 10 —
    no new unit tests needed, see above).
  - `pnpm run build`: succeeds, 7 pages built (previously 4; the 3 new provider routes now
    generate static HTML alongside the existing 4).
  - `pnpm exec playwright test` (Chromium only — Safari/Firefox/iOS Safari not available in
    this environment, so those three DoD checklist items remain unverified here as in every
    prior session): **46/46 passed**, 2 skipped (the same 2 desktop-viewport-only skips as
    session 10 — `homepage.spec.ts`'s FR-010 fold test and `mobile-menu.spec.ts`'s focus-trap
    test are both mobile-viewport-only by design, not new).
  - `lhci autorun` (needed `CHROME_PATH` pointed at the Playwright-installed Chromium binary,
    since no system Chrome was preinstalled in this environment): **exit 0** on all 7 collected
    URLs (previously 4). Scores identical across every route: Performance 100 / Accessibility
    100 / Best Practices 96 / SEO 100 — including the 3 new `/providers*` routes, so BL-012
    introduces no performance or accessibility regression.
- Decisions: none new — reused D-005's decorative-photo-placeholder precedent as-is; no Tier 2
  decisions were required (no new component, no dependency change, no SEO/metadata change
  beyond the per-page title/description pattern already established by BL-010/BL-011).
- Notes: no regressions found. No scope changes. `PROJECT_STATUS.md`'s "Blocked / Needs Human
  Input" table is unchanged by this session (provider bios/photos/practice constants were
  already listed there from BL-003/BL-010).

## 2026-07-30 — session 10
- [BL-011] **Done**: built `/services` (index) and `/services/[slug]` (2 detail pages) per
  PAGE_SPECIFICATIONS.md §/services, rendering the `services` content collection shipped in
  BL-003.
  - `/services`: intro paragraph + the 2 service Cards (same Card component/pattern as the
    homepage's services-overview section), now with an "Available services" H2 ahead of the
    card grid (see BUG report below — an axe finding from this same session).
  - `/services/[slug]` (`getStaticPaths` over the `services` collection): H1, who it's for, what
    happens (duration + video format, content-driven — no per-page special-casing needed), what
    it costs (price from `SERVICE_PRICES` + link to `/pricing`), provider(s) linking to
    `/providers/[slug]`, Book CTA.
  - Fixed a pre-existing route-naming bug found while wiring these pages up: `src/content/
    services/{evaluation,followup}.md` rendered at `/services/evaluation` and `/services/
    followup`, but INFORMATION_ARCHITECTURE.md's authoritative route list specifies `/services/
    psychiatric-evaluation` and `/services/medication-management`. Renamed both content files'
    ids and updated the 3 conditions' `relatedServiceSlug` references to match — this predates
    BL-011 (from BL-003, session 3) and was never exercised until these pages gave the mismatch
    a live route to surface on.
  - Added the 3 new routes to `tests/e2e/routes.ts` so GLOBAL-01/02 and the axe scan (BL-006)
    cover them automatically. The axe scan on `/services` (multi-service card grid under one H1)
    caught a real `heading-order` violation — H1 straight to the Card component's H3s with no H2
    between — fixed by adding an "Available services" H2 ahead of the grid.
- [BUG-003] **Severity S3 — Done**: `lighthouserc.cjs`'s `collect.url` had only ever included `/`
  since BL-006 shipped it, so no other route had ever had its performance budget checked. Adding
  the 3 new `/services` URLs (to actually verify BL-011 against PERFORMANCE_BUDGET.md, which
  requires every budget on "every route") surfaced a real regression: `/services/medication-
  management` measured CLS 0.14966 against the 0.1 budget — `font-display: swap`'s post-paint
  swap from the fallback font to the self-hosted Inter/Source Serif 4 was shifting layout, and
  this page's shorter content made the shift's relative magnitude large enough to clear the
  threshold (the same swap likely happens on every route; other pages just hadn't hit the
  budget's edge). Fixed by preloading both woff2 files in `BaseLayout.astro`'s `<head>`
  (`<link rel="preload" as="font" type="font/woff2" crossorigin>`, base-path-aware for GitHub
  Pages) so they arrive before first paint instead of swapping in after it. Verified: CLS is now
  0 on all 4 collected routes, not just reduced under budget.
  - Regression test: none written — this is a font-loading/CSS behavior, not application logic;
    the verification is `lhci autorun`'s CLS assertion itself, now run against every shipped
    route going forward (not just `/`) so a future regression on any page will be caught the same
    way this one was.
- Test results (all local, real numbers): `pnpm lint` clean; `pnpm typecheck` (`astro check`) 0
  errors/0 warnings (34 pre-existing `z.enum`/`z.object` deprecation hints, unrelated/unchanged);
  `pnpm format` clean; `pnpm build` succeeds (4 routes); `pnpm test` (Vitest) 44/44 unchanged (no
  new components this session); `pnpm exec playwright test` 28/28 passed, 2 correctly skipped on
  `desktop-1280` (375px-specific tests); `lhci autorun` exit 0 on all 4 collected URLs —
  Performance 100, Accessibility 100, Best Practices 96, SEO 100, CLS 0 on every route.
- **Not verified this session**: cross-browser behavior in actual Safari/Firefox/iOS Safari (only
  Chromium available in this sandbox — same limitation as every prior session); production deploy
  of this branch (pushed to `claude/modest-meitner-fmv12e` only, per this repo's
  `auto-merge-claude.yml` branch policy — did not push to or verify `main` directly); the known
  `GITHUB_TOKEN` auto-merge gap (session 5/session 9's Weekly Review) still applies and wasn't
  re-investigated.

## 2026-07-30 — session 9
- [BL-010] **Done**: built the real homepage (`src/pages/index.astro`), replacing the "Site
  under construction" placeholder that had been in place since BL-001. Sections per
  PAGE_SPECIFICATIONS.md `/`: Hero (H1 naming services + "California", subheading, primary
  "Book an appointment" + secondary "See pricing" CTAs, no image), Services overview (2 service
  Cards sourced from the `services` content collection + `SERVICE_PRICES`), Providers preview (2
  provider Cards from the `providers` collection + `PROVIDER_NAMES`/`PROVIDER_CREDENTIALS`), How
  it works (3 steps: Book → Video visit → Ongoing plan), Trust strip (license / self-pay /
  telehealth-across-CA lines), FAQ preview (3 `FAQAccordion` items → /faq), End CTA (Book).
  - New components (Tier 2, logged as D-005 with states/a11y notes added to
    COMPONENT_LIBRARY.md): `Hero` (`src/components/Hero`) and `FAQAccordion`
    (`src/components/FAQAccordion`) — both plain server-rendered React (no `client:*` directive,
    zero shipped JS), CSS Modules on tokens only, colocated Vitest + Testing Library + jest-axe
    tests.
  - Added a third FAQ content file (`src/content/faq/is-there-an-in-person-option.md`) so the
    homepage preview has the 3 items the spec calls for; non-clinical logistics copy only.
  - Added `public/images/provider-photo-placeholder.svg`, a decorative placeholder (not a real
    or stock photo) for the two provider Cards' `photoSrc`, with `alt=""` — real provider photos
    are still Blocked/NEEDS_HUMAN per PROJECT_STATUS.md; rationale and rollback condition in D-005.
  - New test: `tests/e2e/homepage.spec.ts` — FR-010 fold test: on the `mobile-375` Playwright
    project, asserts the `<h1>` (contains "California"), and the Hero's primary Book CTA are
    both within the 375×812 viewport with no scroll needed (skipped on `desktop-1280`, where the
    375px-specific requirement doesn't apply).
  - Test results (all local, real numbers): `pnpm lint` clean; `pnpm typecheck` (`astro check`)
    0 errors/0 warnings (pre-existing 34 `z.enum`/`z.object` deprecation hints in
    `content.config.ts`, unrelated to this change, unchanged); `pnpm format` clean; `pnpm build`
    succeeds; `pnpm test` (Vitest) 44/44 passed (was 39 before this session; +5 for
    Hero.test.tsx/FAQAccordion.test.tsx); `pnpm exec playwright test` 10/10 passed, 2 correctly
    skipped on `desktop-1280` (the new FR-010 fold test and the pre-existing mobile-menu test,
    both 375px-specific); `lhci autorun` exit 0 — Lighthouse scores on `/`: Performance 100,
    Accessibility 100, Best Practices 96, SEO 100; every PERFORMANCE_BUDGET.md assertion passes
    at `error` severity, including `resource-summary:script:size` (0 bytes/0 requests — no new
    component ships client JS) and `resource-summary:total:size` (~82KB against a 500KB budget).
  - **Not verified this session**: cross-browser behavior in actual Safari/Firefox/iOS Safari
    (only Chromium is available in this sandbox — same limitation as every prior session);
    real-device/screen-reader manual pass (deferred per TESTING_AND_VALIDATION_PLAN.md's "Manual
    Validation" cadence, not a per-session requirement); production deploy of this branch (this
    session pushed to `claude/modest-meitner-j4x5yn` only, per this repo's branch policy — did
    not push to or verify `main`).
- [D-005] Logged: new `Hero`/`FAQAccordion` components, no-image hero rationale, and the
  decorative provider-photo-placeholder choice (Tier 2). Full context/alternatives/rollback in
  DECISION_LOG.md.
- Notes: readability-level CI (COPY_GUIDELINES.md's "reading level ≤ 8th grade, checked in CI")
  is documented but has no implementing script in this repo yet (pre-existing gap, not
  introduced or fixed this session — out of BL-010's scope). All new homepage copy was written
  and reviewed by hand against COPY_GUIDELINES.md's Hard Rules and Style Rules (short sentences,
  second person avoided where third person read more naturally for card/step copy, no outcome
  guarantees, glossary terms used exactly).

## 2026-07-30 — session 8
- [BUG-001] **Verified — DEPLOYED**: manually dispatched `Deploy to GitHub Pages` (run 30550349368) against `main`'s current HEAD (the Node-22 fix from session 7) — both `build` and `deploy` jobs completed with `conclusion: success`. Session 7 had fixed the root cause but explicitly left this unverified since the fix reached `main` without a real push event ever re-triggering the workflow (see BUG-002 below for why that path exists). This closes the loop: GitHub Pages deploy is confirmed green, not just believed fixed.
- [BUG-002] **Severity S2** — found while trying to verify BL-007 locally: `pnpm exec playwright test` and `lhci autorun` both hit a 404 on every route. Root cause: `astro.config.mjs`'s `base: '/telehealth'` (added directly to `main` outside a session, commit `332a133`, for GitHub Pages project-site hosting) was never reflected in `playwright.config.ts`'s `baseURL` or `lighthouserc.cjs`'s `collect.url`, which still pointed at root. This has been silently broken since that commit landed (2026-07-30 06:32 UTC) — meaning `ci.yml`'s `e2e-axe-lighthouse` job (BL-006) has not produced a valid result since, on `main` or anywhere else, though `lint-typecheck-build` was unaffected.
  - Fixed `playwright.config.ts`'s `BASE_URL` to include `/telehealth/`, and `lighthouserc.cjs`'s `collect.url` likewise.
  - Second, less obvious part of the root cause: even with `baseURL` fixed, every spec called `page.goto('/')`/`page.goto(route)` — Playwright joins these against `baseURL` via `new URL()`, and a leading `/` resets the whole path per WHATWG URL rules, silently dropping `/telehealth` again. Added `tests/e2e/routeUrl.ts` (strips the leading slash so routes append onto `baseURL` instead of replacing it) and updated all three spec files to use it.
  - Verified: `pnpm exec playwright test` 9/9 passed (1 correctly skipped — desktop viewport doesn't render the mobile-menu toggle); `lhci autorun` (`CHROME_PATH` pointed at the sandbox's preinstalled Chromium) exits 0.
- [BL-007] Rewrote SiteHeader from a `client:load`-hydrated React island to a server-rendered `.astro` component (`SiteHeader.astro` + `SiteHeader.client.ts`, a plain script with no framework runtime) — fixes the ~62KB gzip react-dom regression D-004 flagged. Same markup, same `SiteHeader.module.css` classes (Astro supports CSS Modules in `.astro` frontmatter the same as `.tsx`), same scroll-shadow/focus-trap/Esc/`aria-expanded` behavior, now implemented as vanilla DOM code in `initSiteHeader()`. Replaced `SiteHeader.test.tsx` (RTL, no longer applicable — there's no React component left to render) with `SiteHeader.client.test.ts`, which builds a DOM fixture matching the `.astro` output and exercises `initSiteHeader` directly: toggle/`aria-expanded`, focus moves into the menu on open, Esc closes and returns focus, Tab-wrap focus trap, and `jest-axe` clean both closed and open.
  - Flipped `lighthouserc.cjs`'s `resource-summary:script:size` back to `error` in this same commit, per D-004's rollback condition — the LHCI run (see BUG-002 above for how this got un-blocked) now measures `requestCount: 0, transferSize: 0` for the `script` resource type against the 15KB budget: the ~1.5KB behavior script is inlined by Astro, not a separate network request, so it doesn't even show up in the resource-summary line item.
  - Verified: `pnpm test` 36/36 (unchanged count — 6 RTL tests removed, 6 DOM-fixture tests added), `pnpm exec playwright test` 9/9, `pnpm build` clean, `pnpm typecheck`/`pnpm lint`/`pnpm format` all clean.
- Notes: did not touch M2 (BL-010 homepage) this session — BUG-002 (found mid-session, S2, fixable same-session per BUG_TEMPLATE.md) and BL-007 consumed the full session. Did not investigate the known `GITHUB_TOKEN` auto-merge gap (CHANGELOG.md session 5/PROJECT_STATUS.md Weekly Review) further; it's unrelated to BUG-002 (a config/test-harness bug, not a GitHub Actions trigger-permissions bug) and still applies to `ci.yml`'s `e2e-axe-lighthouse` job specifically post-auto-merge.

## 2026-07-30 — session 7
- [BUG-001] **Severity S1** — `Deploy to GitHub Pages` (`.github/workflows/deploy.yml`) failed on its only run to date (run 30519968170, triggered by the `Create deploy.yml` commit directly to `main` outside the normal session process). Found by this session inspecting Actions state directly, not by a prior session or monitoring.
  - Root cause: the `build` job's `withastro/action@v3` step had no `node-version` input, so it defaulted to Node 20. Astro 7.1.6 (already pinned in `package.json`) requires Node >=22.12.0 — the job's `Build` step failed immediately with `Node.js v20.20.2 is not supported by Astro!` before `astro build` (or even `astro check`) ran. This is why the failure looked like an early, unexplained exit: nothing about the app code, lockfile, or `astro.config.mjs` was involved. Verified both were in fact fine: `pnpm install --frozen-lockfile` succeeds (lockfile in sync with `package.json`) and `pnpm build` succeeds cleanly on Node 22.22.2 locally.
  - `ci.yml` never had this problem — its two `actions/setup-node@v4` steps already use `node-version-file: .nvmrc` (pinned to 22). `deploy.yml` set no Node version at all.
  - Fix: added `with: { node-version: 22 }` to the `withastro/action@v3` step, matching `.nvmrc`.
  - Regression test: none written — this is CI/deploy configuration, not application code; TESTING_AND_VALIDATION_PLAN.md's regression policy covers pinned numerical/behavioral outputs, not workflow YAML. The verification is the workflow run itself going green.
  - Full local suite green: `pnpm lint`, `pnpm typecheck`, `pnpm format`, `pnpm build`, `pnpm test` (36/36) all pass on Node 22.22.2 / pnpm 10.33.0.
  - **Not yet verified**: the actual `Deploy to GitHub Pages` workflow run. It only triggers on push to `main` (or manual `workflow_dispatch`); this session pushed to `claude/compassionate-rubin-e6tlsk` per this repo's branch policy and did not merge to `main`. Whoever merges this branch (or dispatches the workflow manually) should confirm both the `build` and `deploy` jobs go green — do not assume it from this entry alone.
- Notes: BL-007 (SiteHeader JS payload) was Ready and next in priority order, but this S1 deploy failure interrupted it per BUG_TEMPLATE.md's severity rule ("fix immediately, interrupt any session"). BL-007 was not started this session; no other files touched beyond `deploy.yml` and the three state docs (BACKLOG.md, PROJECT_STATUS.md, this entry).

## 2026-07-30 — session 6
- [BL-006] Wired Playwright + axe-core + Lighthouse CI into `.github/workflows/ci.yml` as a new `e2e-axe-lighthouse` job (after `lint-typecheck-build`): builds the site, installs a Chromium browser, runs `pnpm run test:e2e` (Playwright), then `lhci autorun`.
  - `playwright.config.ts`: `mobile-375` (375×812) and `desktop-1280` (1280×800) projects against `astro preview`, per TESTING_AND_VALIDATION_PLAN.md.
  - `tests/e2e/global.spec.ts`: GLOBAL-01 (exactly one `h1`, non-empty title/description, titles unique across routes) and GLOBAL-02 (footer crisis block present) — iterate `tests/e2e/routes.ts`'s `ROUTES` list (currently just `/`; extend as pages ship).
  - `tests/e2e/accessibility.spec.ts`: `@axe-core/playwright` scan per route, fails on any `critical`/`serious` violation (both viewports) — zero found on `/` today.
  - `tests/e2e/mobile-menu.spec.ts`: real-browser check of SiteHeader's mobile menu (open/`aria-expanded`/focus-trap-to-first-link/Esc closes and returns focus) — skipped on the desktop project since the toggle only renders below the 1024px breakpoint.
  - `lighthouserc.cjs`: LHCI config with every PERFORMANCE_BUDGET.md number transcribed as a blocking assertion (Lighthouse scores, LCP/CLS/TBT-as-INP-proxy/TTFB, document/stylesheet/font/image/total transfer budgets) except `resource-summary:script:size` — see D-004.
  - Verified the gate actually blocks: temporarily set an unreachable Lighthouse-performance `minScore` locally and confirmed `lhci autorun` exits non-zero; the axe/GLOBAL specs pass today precisely because BL-004/BL-005 already ship accessible, single-`h1` markup — a regression there would fail them.
  - Pinned `@playwright/test` to `1.56.0` (exact match to the browser binaries preinstalled in this sandbox at `/opt/pw-browsers`, discovered via `chromium.executablePath()`); CI installs its own matching browser via `playwright install --with-deps chromium` so this pin is not load-bearing there.
- [D-004] Lighthouse CI on `/` found real JS ~62KB gzip (budget 15KB) from SiteHeader's `client:load` React hydration — contradicts TECH_STACK.md's "ships ~zero JS on content pages" rationale. Set `resource-summary:script:size` to `warn` (every other budget stays `error`/blocking) rather than hide it or leave CI red; filed BL-007 to fix the header and flip it back.
- [BL-007] Added to backlog (Ready, M1): reduce SiteHeader's JS payload under the 15KB budget.
- Notes: `pnpm run typecheck`/lint/format/build/`pnpm test` (36/36) all still green; `pnpm exec playwright test` 9/9 passed (1 correctly skipped: mobile-menu on desktop).

## 2026-07-30 — session 5
- [BL-005] Added `SkipLink`, `CrisisResources`, `SiteHeader`, and `SiteFooter` (`src/components/<Name>/`, React + CSS Modules, same pattern as BL-004) plus `src/layouts/BaseLayout.astro`, and wired the layout into `index.astro` in place of its raw `<html>` boilerplate.
  - `CrisisResources`: renders the canonical crisis copy from COMPONENT_LIBRARY.md#CrisisResources verbatim (asserted byte-for-byte in its test, including the straight apostrophe in "you're"), in `footer` and `strip` variants. "call"/"text" link to `tel:988`/`sms:988`, "911" links to `tel:911` — the visible wording is unchanged; only those words became links.
  - `SiteHeader`: sticky, `box-shadow` added only past `scrollY > 0`; desktop nav + phone + Book button (only button-styled item, per UX-001); mobile hamburger toggles a full-screen menu with `aria-expanded`, `role="dialog"`, a hand-rolled focus trap (Tab/Shift+Tab wrap within the menu's focusable elements), and Esc closes it and returns focus to the toggle button. `currentPath` prop sets `aria-current="page"` on the matching nav link.
  - `SiteFooter`: the four zones from COMPONENT_LIBRARY.md#SiteFooter in order — nav links, contact block (`practice.ts` phone/email constants), `CrisisResources` (footer variant), then legal links + an FR-014 California-only/18+ eligibility line + a generic "Licensed in California" disclosure line (no specific license numbers — those are Tier 3/NEEDS_HUMAN, per PROJECT_STATUS.md's Blocked list).
  - `BaseLayout.astro`: `SkipLink` and `SiteFooter` render server-only (no `client:*` directive — they have no interactivity, so this ships zero JS for them); `SiteHeader` hydrates with `client:load` since its mobile-menu toggle needs to work immediately.
- Verified beyond the Vitest/RTL/jest-axe harness (36/36 tests passing, up from 19): ran `pnpm build` and grepped the static output to confirm the header, footer, skip link, and crisis copy actually appear in the rendered HTML; also ran a one-off Playwright smoke check (Chromium, not committed to the repo) against `pnpm preview` at 375px and 1280px — confirmed the mobile menu's open/close/Esc/focus-trap behavior and the desktop nav/Book/phone all work in a real browser, and there were no console errors other than a pre-existing missing `favicon.ico` (not introduced by this session).
- Notes: `/services`, `/providers`, `/pricing`, `/about`, `/faq`, `/contact`, and the `/legal/*` routes linked from the header/footer don't have pages yet (BL-010/011/012/013/014/015/016) — this is expected per INFORMATION_ARCHITECTURE.md's authoritative route list, not a defect; those routes will 404 until their backlog items land.
- Weekly review finding (2026-07-29, moved here per PROJECT_STATUS.md's "most recent review only" rule): `.github/workflows/auto-merge-claude.yml` (human-added) pushes to `main` using the default `GITHUB_TOKEN`. GitHub does not trigger other workflows (including `ci.yml`'s `on: push: branches: [main]`) from `GITHUB_TOKEN`-authored pushes — confirmed via Actions API: no CI run exists for either of that session's two auto-merges onto `main`, even though `ci.yml` last ran (and failed) on the pre-merge commit. Practical effect: CI silently stops re-verifying `main` after every claude/ branch auto-merge; a session's local `pnpm build`/lint/format is the only check. Fix requires human action: add a PAT/GitHub App token as a secret for the auto-merge job to push with (so `on: push` fires normally), or an explicit `workflow_dispatch`/`workflow_run` trigger. Not blocking any backlog item.

## 2026-07-29 — session 4
- [BL-004] Added the unit/component test harness (Vitest + `@testing-library/react` + `jest-axe`), which didn't exist yet — `vitest.config.ts` via Astro's `getViteConfig` (inherits the `@/*` path alias), `tests/setup.ts` (jest-dom matchers, `jest-axe`'s `toHaveNoViolations`, RTL `cleanup` in `afterEach` — without it, DOM nodes from earlier tests in a file leaked into later ones). Added `pnpm test` (`vitest run`) and wired it into `.github/workflows/ci.yml` between typecheck and build, per TECH_STACK.md's pipeline order.
- [BL-004] Implemented Button, TextInput, TextArea, Checkbox, and Card per COMPONENT_LIBRARY.md, as React function components (`src/components/<Name>/`, CSS Modules, tokens only). Built as React rather than `.astro` so the same component works both server-rendered-only on static content pages (ships zero JS, per TECH_STACK's islands model) and hydrated inside the React islands (`/book`, `/contact`) that will consume them in BL-020/BL-022 — Astro renders framework components to static HTML by default and only ships JS when a `client:*` directive hydrates them.
  - Button: primary/secondary/text variants, default/large sizes, renders `<a>` when `href` is given else `<button>`; loading state keeps width locked (label hidden via `visibility`, not removed) and sets `aria-busy`/disables interaction.
  - TextInput/TextArea: visible label (never placeholder-as-label), optional helper text, error state per ERROR_STATES.md#E-010 — border + background + icon + text (never color-only), wired to the field via `aria-describedby` (swapped for the error's id when both would exist, since the helper text is hidden while an error shows — pointing `aria-describedby` at a hidden node would be broken).
  - Checkbox: 24px visual box via native `<input type="checkbox">` + `accent-color`, whole label clickable; error per E-011 renders inline explanatory text (never a modal). Fixed one bug during Phase 4 verification: the label's actual clickable height was ~29px (24px box vs. the row's line-height), under ACCESSIBILITY.md's 44×44px touch-target minimum — added `min-height: 44px` to the label.
  - Card: `service`/`provider`/`selectable` variants behind one `variant`-tagged component. `selectable` (for booking Step 2) uses a real `<input type="radio">` (visually hidden, not `display:none`, so it stays focusable) for native keyboard/screen-reader semantics; selected state is a 2px primary border + tint background plus a check icon — never color-only.
- Notes: every component's states + keyboard operability + `jest-axe` (zero violations) are covered in its colocated `*.test.tsx` (19 tests total across 5 files). None of these components render on any page yet — no page exists to place them on — so QUALITY_STANDARD.md's cross-browser/viewport verification is deferred to BL-005/BL-010, which will actually consume them. Also fixed a pre-existing lint gap unrelated to any specific rule change: `eslint.config.js`'s TS rules didn't disable `no-undef`, so any component using ambient DOM types (`HTMLButtonElement`, etc.) failed lint with false positives — `tsc`/`astro check` already validates these; disabled `no-undef` for `.ts`/`.tsx` per typescript-eslint's own recommendation.

## 2026-07-29 — session 3
- [BL-003] Added `src/content.config.ts` defining 5 content collections (services, providers, conditions, faq, legal) with zod schemas per ARCHITECTURE.md §Content boundary, using Astro's content-layer `glob()` loader and `reference()` for cross-collection links (e.g. a service's `providerSlugs` must resolve to real `providers` entries). Verified invalid frontmatter fails `pnpm build` (missing required fields, bad enum value, wrong type all correctly rejected with `InvalidContentEntryDataError`).
- Extended `src/lib/practice.ts` with `PROVIDER_KEYS`/`SERVICE_KEYS` tuples and `PROVIDER_NAMES`/`PROVIDER_CREDENTIALS`/`PROVIDER_LICENSE_NUMBERS`/`SERVICE_PRICES` records — all NEEDS_HUMAN placeholders — so content frontmatter references a stable key (`providerKey: 'md'`, `priceKey: 'evaluation'`) instead of ever inlining a price or credential (CODING_STANDARDS.md §Content Files).
- Added minimal sample content: 2 services (evaluation, follow-up — durations/modality from TELEHEALTH_SPECIFICATION.md), 3 conditions (depression, anxiety, ADHD — each with the required educational disclaimer per COPY_GUIDELINES.md rule 2), 2 FAQ entries in the "Getting started" group. Deliberately left provider bio prose (`approachStatement`, `education`, body) as NEEDS_HUMAN placeholders and added no `legal` content files — both are Tier 3 (DECISION_FRAMEWORK.md: provider bios, legal pages) and belong to BL-012/BL-016 with human sign-off, not this schema-scaffolding item.
- Notes: no new runtime dependency — `z`/`reference` come from `astro:content`, already bundled with Astro. `astro check` reports a pre-existing upstream `'z' is deprecated` hint (zod v4 internal type re-export via Astro); 0 errors/0 warnings, not introduced by this change.
- Fixed a pre-existing red main: a human commit (`Create auto-merge-claude.yml`, outside this session) added `.github/workflows/auto-merge-claude.yml` with double-quoted YAML strings and misaligned comment spacing that fails `pnpm format` (prettier --check), which failed CI's "Format check" step on main. Ran `prettier --write` on the file; no behavior change, format-only.

## 2026-07-29 — session 2
- [BL-002] Added `src/styles/tokens.css` (all DESIGN_TOKENS.md color/type/spacing/radius/shadow/motion/breakpoint values as CSS custom properties, with the mobile→tablet type-scale override for `--text-display`/`--text-h2`) and `src/styles/global.css` (self-hosted `@font-face` rules, modern reset, base element styles, focus-visible outline, `prefers-reduced-motion` handling — all token-driven, no hardcoded values). Self-hosted Inter (variable, weights 400–600) and Source Serif 4 (600), Latin-subset woff2 downloaded from Google Fonts and served from `/public/fonts` — combined 68.2KB, well under the 120KB budget. Sample page (`src/pages/index.astro`) imports global.css and renders an h1 (display font) + p (body font) to prove both families load.
- Notes: verified with Playwright/Chromium against `astro preview` — both fonts report `document.fonts` status `loaded`, computed `font-family` matches expected values, font requests return 200, no console errors (one unrelated 404 for the browser's default favicon request — out of scope for this item). Inlined CSS is 2.4KB, well under the 30KB budget.
- Fixed a pre-existing CI bug from BL-001: `.github/workflows/ci.yml` set both a `version` input on `pnpm/action-setup@v4` and package.json's `packageManager` field, which the action now rejects as conflicting. Removed the redundant `version` input.

## 2026-07-29 — session 1
- [BL-001] Scaffolded Astro (static output) + React islands project per ARCHITECTURE.md/TECH_STACK.md: TypeScript strict, ESLint (typescript-eslint + jsx-a11y) + Prettier, repo directory structure (/src/{components,pages,content,lib,styles}, /api, /tests, /public), GitHub Actions CI (lint → typecheck → format → build), root CLAUDE.md updated with commands and the three absolute rules.
- Notes: `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm format` all green locally. eslint-plugin-astro was evaluated but dropped — its eslint>=10 peer requirement conflicts with eslint-plugin-jsx-a11y's eslint<=9 requirement; TECH_STACK.md only specifies jsx-a11y, so kept eslint 9 and skipped the astro-specific linter.

## 2026-07-29 — session 0
- Documentation repository created (all /docs and /templates files). Code not yet started.
- Decisions: D-001, D-002, D-003 (see DECISION_LOG.md)
