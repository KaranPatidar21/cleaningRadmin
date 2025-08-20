import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5001,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    // Enable LAN access (optional)
    host: '0.0.0.0',
  },
  // Build settings for production
  build: {
    outDir: 'dist', // Output folder
    emptyOutDir: true, // Clear old files
    sourcemap: true, // Helpful for debugging
  },
  // Base path for deployment (if app is in subdirectory)
  base: '/', // Change to '/your-subfolder/' if needed
});