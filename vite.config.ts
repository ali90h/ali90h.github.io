import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        work: resolve(__dirname, 'work.html'),
        log: resolve(__dirname, 'log.html'),
        about: resolve(__dirname, 'about.html'),
        404: resolve(__dirname, '404.html'),
      },
    },
  },
  // @ts-expect-error -- Vitest config is not in the default Vite type
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['src/lib/**/*.ts', 'src/scripts/app.ts'],
      exclude: ['**/*.d.ts', '**/main.ts'],
      all: true,
      lines: 90,
      functions: 90,
      branches: 90,
      statements: 90,
    },
  },
})
