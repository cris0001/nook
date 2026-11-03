import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

// Unit tests run in Node; component tests opt into jsdom per file with
// `// @vitest-environment jsdom` and import `@/test/setup-dom`.
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
