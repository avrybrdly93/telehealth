import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',
  site: 'https://avrybrdly93.github.io',
  base: '/telehealth',
  integrations: [react()],
});
