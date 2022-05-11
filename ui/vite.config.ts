import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteSVG } from 'rollup-plugin-svelte-svg'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), svelteSVG({ svgo: {}, enforce: 'pre' })],
  server: {
    host: '0.0.0.0',
    port: 4000,
  },
})
