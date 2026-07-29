---
title: Architecture
status: Active
authority: Engineering
owner: Engineering
dependencies:
  - TECH_STACK.md
  - ../05_SECURITY/DATA_BOUNDARIES.md
  - ../01_PRODUCT/SERVICE_REQUIREMENTS.md
review_cycle: Quarterly
---

# Architecture

## Architectural Style

**Static-first marketing site with minimal server surface.** All content pages are statically generated at build time and served from a CDN (NFR-003). Interactive behavior (booking flow state, contact form) is progressive enhancement over working static HTML (E-050).

Rationale: maximum reliability and speed for anxious mobile users; minimal attack/privacy surface (no database, no sessions, no PHI possible by construction); cheap to run (BG-005).

## System Diagram (logical)

Browser → CDN (static pages, assets)
Browser → /api/contact (serverless function) → transactional email → practice inbox
Browser → vendor scheduling system (direct handoff from /book Step 4; their domain, their BAA)
Build pipeline: content files + components → static build → CDN deploy

## Key Boundaries

1. **PHI boundary**: this system stores no PHI, has no database, and writes no server logs containing form contents. The only user data in motion is the contact form payload, which passes through the serverless function to email and is not persisted by us (DATA_BOUNDARIES.md is normative).
2. **Vendor boundary**: scheduling, intake, payment, video all live in the vendor system. Integration = parameterized outbound URL only (FR-023). No vendor API calls from our backend in MVP.
3. **Content boundary**: page copy, service data, provider data, FAQ items, pricing live in typed content files (markdown/JSON) separate from components (NFR-007 — new service page = new content file only).

## Repository Structure

/src
  /components      per COMPONENT_LIBRARY.md, one dir per component with test
  /pages|/app      routes matching INFORMATION_ARCHITECTURE.md exactly
  /content         markdown/JSON content files (services, providers, faq, conditions, legal)
  /lib             schema validation, seo helpers, analytics wrapper
  /styles          tokens.css (from DESIGN_TOKENS.md) + global.css
/api or /functions contact form handler only
/tests             e2e specs
/docs              this documentation repo
/public            static assets, fonts, images

## Extensibility Commitments (NFR-008)
- Public routes never assume auth; a future portal mounts under /portal with its own auth boundary — no changes to existing routes.
- Content schema includes stable IDs so a future CMS/EHR mapping can reference them.
- Analytics wrapper is a single module so a consent-manager can gate it later without touching call sites.
- The vendor handoff is one function (`buildBookingUrl(selection)`) — swapping vendors touches one file + tests.

## Architectural Rules
- No database in MVP. Adding one is a Tier 3 decision.
- No client-side state library; flow state via URL params/sessionStorage (UX-011).
- No third-party scripts except analytics per ANALYTICS_PLAN.md. Each new third-party script is Tier 3 (privacy).
