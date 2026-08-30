import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    // The token tests read packages/tokens/dist, so the build has to have run.
    // `npm test` depends on `npm run build` for exactly that reason.
    environment: 'node',
    reporters: 'default',
  },
});
