---
title: Tech Stack
status: Active
authority: Engineering
owner: Engineering
dependencies:
  - ARCHITECTURE.md
  - PERFORMANCE_BUDGET.md
review_cycle: Quarterly
---

# Tech Stack

Chosen per PRINCIPLES.md P4 (boring technology). Substituting any Runtime-tier item is a Tier 3 decision; Tooling-tier is Tier 2.

## Runtime

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Astro** (static output) with React islands only where interactivity is required (/book flow, contact form, mobile menu, accordion) | Ships ~zero JS on content pages → performance budget is achievable by default; islands give React DX where needed; content collections give typed content files (NFR-007) |
| Language | TypeScript, strict mode | Catch content-schema and props errors at build |
| Styling | CSS custom properties from DESIGN_TOKENS.md + scoped component styles. No Tailwind, no CSS-in-JS runtime | Tokens are the design contract; zero styling runtime cost |
| Content | Astro content collections: markdown + zod-validated frontmatter for services/providers/conditions/faq/legal | Typed, buildable, diff-able, CMS-ready later |
| Contact handler | Serverless function on the hosting platform + transactional email API (e.g. Postmark/Resend) | Only dynamic need; no server to maintain |
| Hosting | Netlify or Vercel (pick once at project start, record Tier 2 decision) — static + functions + preview deploys | Free tier fits BG-005; preview URLs enable review |
| Analytics | Privacy-focused, cookieless (Plausible or self-hosted equivalent) per ANALYTICS_PLAN.md | NFR-004: no ad trackers, no cookie banner complexity |

Fallback note: if a genuinely blocking Astro limitation is hit, the approved alternative is Next.js static export — via Tier 3 decision only.

## Tooling

| Purpose | Choice |
|---|---|
| Package manager | pnpm |
| Lint/format | ESLint + Prettier, config committed; a11y lint (eslint-plugin-jsx-a11y) on islands |
| Unit/component tests | Vitest + Testing Library |
| E2E | Playwright (Flows 1–2, mobile + desktop projects) |
| A11y automation | axe-core via Playwright on every route |
| Performance CI | Lighthouse CI with budgets from PERFORMANCE_BUDGET.md |
| Readability check | textstat-style script in CI over /src/content (UX-002) |
| CI/CD | GitHub Actions: lint → typecheck → unit → build → e2e/axe/LHCI → deploy preview; main → production |

## Versioning Rules
- Node LTS, pinned via .nvmrc. Lockfile committed.
- Dependency updates: patch = Tier 1, minor = Tier 2, major = Tier 3.
- No dependency with < 1 year of maintenance history for runtime code.
