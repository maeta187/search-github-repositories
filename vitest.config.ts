import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    include: ['src/**/*.unit.{test,spec}.{ts,tsx}'],
    watch: false,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
});
