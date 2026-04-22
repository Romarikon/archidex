import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',

  optimizeDeps: {
    entries: ['index.html'],
  },

  server: {
    port: 3000,
    open: true,
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        passes: 2,
      },
      mangle: {
        toplevel: true,
        properties: false,
      },
      format: {
        comments: false,
      },
    },
  },
});
