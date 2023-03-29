import { defineConfig } from 'astro/config';

// https://astro.build/config
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
import solid from '@astrojs/solid-js';

// https://astro.build/config
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [solid(), tailwind()],
  output: 'server',
  server: {
    port: 9999
  },
  adapter: vercel()
});