import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Implements ARCHITECTURE.md — static-first output, React islands only where needed.
export default defineConfig({
  output: 'static',
  integrations: [react()],
});
