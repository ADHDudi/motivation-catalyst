import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  // API key removed - now handled securely via Cloud Functions
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
