import path from 'path';
import { defineConfig, mergeConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { defineConfig as defineVitestConfig } from 'vitest/config';

const vitestConfig = defineVitestConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
});

export default mergeConfig(
  defineConfig({
    server: {
      port: 5173,
      host: '0.0.0.0',
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  }),
  vitestConfig,
);
