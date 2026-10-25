import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // During development, send /api requests to the Spring Boot app on port 8080
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  build: {
    // Put the built website inside the Spring Boot app, which serves it at "/"
    outDir: '../src/main/resources/static',
    emptyOutDir: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
});
