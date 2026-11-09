/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

// GitHub Pages serves this project at https://<user>.github.io/<repo>/,
// so every asset URL must be prefixed with the repository name.
const REPO_NAME = 'ElliviaWaitlist'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? `/${REPO_NAME}/` : '/',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        privacy: resolve(import.meta.dirname, 'privacy/index.html'),
        notFound: resolve(import.meta.dirname, '404.html'),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.ts'],
    env: {
      VITE_SUPABASE_URL: 'https://example.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test',
      VITE_WAITLIST_FUNCTION_URL: 'https://example.supabase.co/functions/v1/join-waitlist',
      // Cloudflare's documented "always passes" test site key.
      VITE_TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
    },
  },
}))
