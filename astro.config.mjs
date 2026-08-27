import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://gbibbo.github.io',
  integrations: [react(), tailwind({ applyBaseStyles: false })],
});
