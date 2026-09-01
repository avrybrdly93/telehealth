---
title: SEO Strategy
status: Active
authority: Marketing
owner: Product
dependencies:
  - CONTENT_STRATEGY.md
  - LOCAL_SEARCH_STRATEGY.md
  - ../01_PRODUCT/SERVICE_REQUIREMENTS.md
review_cycle: Quarterly
---

# SEO Strategy

## Positioning Constraint
Health content is "Your Money or Your Life" territory: rankings depend on demonstrated expertise and trust. Our strategy is therefore identical to our product strategy — real clinicians, real credentials, honest content. No tricks; tricks are a compliance and brand risk here.

## Priority Keyword Set (BG-003 measurement basis)

| Cluster | Example queries | Target page |
|---|---|---|
| CA online psychiatry (head) | "online psychiatrist california", "telehealth psychiatry california" | Homepage, /services |
| Condition + CA (core) | "adhd psychiatrist california online", "anxiety psychiatrist telehealth california", "depression medication management california" | /conditions/* → /services |
| Self-pay/cost (intent) | "psychiatrist without insurance california", "how much does a psychiatrist cost self pay" | /pricing, FAQ |
| Provider-type (education) | "psychiatrist vs psychiatric nurse practitioner" | FAQ/condition content |
| Brand | practice + provider names | Home, bios |

Five tracked BG-003 queries chosen from the head + core clusters at launch; recorded in ANALYTICS_PLAN.md measurement section.

## Technical Foundation (implemented via FR-050/051, NFR-005)
- Unique title (≤ 60 chars) + meta description (≤ 155) per page, defined in content frontmatter.
- Canonicals, sitemap.xml, robots.txt at build; clean stable URLs (IA doc rules).
- **`robots.txt` is built and served, but is not read by crawlers on the current deployment**, and
  saying "robots.txt at build" without this line is how BL-041 went unnoticed. The protocol is
  origin-scoped: crawlers fetch `https://<origin>/robots.txt` only, and on a GitHub Pages *project*
  site that address belongs to the account's user site, not this repo — ours ships to
  `/telehealth/robots.txt`. Its `Sitemap:` line is therefore correct and inert. **The sitemap's real
  discovery path today is direct submission in Search Console** (see §Measurement); that submission
  is owner-side, has not been confirmed, and is tracked as BL-042. This resolves automatically if
  the site moves to its own origin. Decision and alternatives: D-016.
- Structured data: MedicalBusiness (org), Physician (both bios — type applies to the practice's clinicians; PMHNP page also uses accurate jobTitle), FAQPage. Validate in Rich Results test (BL-031).
- Core Web Vitals within PERFORMANCE_BUDGET.md — a ranking input and enforced anyway.

## E-E-A-T Signals
Author/reviewer attribution on condition pages ("Medically reviewed by [Provider, credential]" — only when actually reviewed, R-010); license numbers on bios; About page depth; accurate NAP (LOCAL_SEARCH_STRATEGY.md); HTTPS; no doorway pages.

## Prohibited
City-doorway page farms ("psychiatrist in [each CA city]" thin pages) · purchased links · AI-generated content published without provider review (R-010) · keyword-stuffed titles · review-gating (also illegal-ish and gross).

## Measurement
**Submit `sitemap.xml` directly in Search Console** — on the current project-site deployment this
is the sitemap's only working discovery path, not a belt-and-braces extra (D-016, BL-041).
Search Console + analytics: impressions/clicks/position for the tracked set monthly; organic landing→booking-start rate quarterly. Review in CONTINUOUS_IMPROVEMENT.md loop.
