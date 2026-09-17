import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    exclude: ['tests/e2e/**', 'node_modules/**'],
    coverage: { include: ['src/app.js', 'src/data.js'], reporter: ['text'], thresholds: { lines: 80, functions: 80, statements: 80 } }
  }
})
