import { getViteConfig } from 'astro/config';

// Implements TECH_STACK.md — Vitest + Testing Library for component/unit tests.
export default getViteConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    // Component and unit tests live beside their source under src/. tests/unit/
    // is for tests that have no source file to sit beside — BUG-008's guard over
    // .github/workflows/deploy.yml is the first. tests/e2e/ stays with Playwright
    // and is deliberately not matched here.
    include: ['src/**/*.test.{ts,tsx}', 'tests/unit/**/*.test.ts'],
  },
});
