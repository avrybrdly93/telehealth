import { getViteConfig } from 'astro/config';

// Implements TECH_STACK.md — Vitest + Testing Library for component/unit tests.
export default getViteConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
