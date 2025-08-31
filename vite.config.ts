import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  publicDir: 'public',
  // @ts-expect-error -- Vitest config is not in the default Vite type
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json', 'html'],
      reportsDirectory: '../coverage', // Output coverage reports to the project root
      include: ['src/scripts/app.ts'],
      all: true,
      clean: true,
      lines: 90,
      functions: 90,
      branches: 90,
      statements: 90,
    },
  },
});
