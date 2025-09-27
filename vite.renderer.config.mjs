import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  server: {
    // Development server configuration
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      // Proxy API requests to backend during development
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  },
  build: {
    // Production build configuration
    outDir: '.vite/renderer',
    rollupOptions: {
      external: ['electron']
    }
  },
  define: {
    // Define environment variables for frontend
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '2.1.0'),
    __API_BASE_URL__: JSON.stringify(process.env.API_BASE_URL || 'http://localhost:3001/api')
  }
});
