import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.unit.{test,spec}.ts'],
    watch: false,
    environment: 'jsdom',
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});
