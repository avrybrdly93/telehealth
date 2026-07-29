# CLAUDE.md

Pointer doc. Full protocol: docs/04_ENGINEERING/CLAUDE_DEVELOPMENT_PROTOCOL.md

Read docs/06_PROJECT/PROJECT_STATUS.md and docs/06_PROJECT/BACKLOG.md first.
Resume any In-Progress item; otherwise take the top unblocked Ready item.
Follow docs/00_AI_OPERATING_SYSTEM/EXECUTION_LOOP.md exactly, including Phase 5
close-out. You may be cut off by usage limits at any time — checkpoint
accordingly.

## Commands
- Install: `pnpm install`
- Dev server: `pnpm dev`
- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck`
- Format check: `pnpm format`
- Build: `pnpm build`

## Absolute Rules
1. Never add a form field, tracking call, or stored datum beyond
   docs/05_SECURITY/DATA_BOUNDARIES.md. Propose via DECISION_LOG.md instead.
2. Never edit crisis-resource copy, pricing values, provider credentials, or
   legal pages without a human-approved Tier 3 decision.
3. End every session with Phase 5 close-out even if work is incomplete.
