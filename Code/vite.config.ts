import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      handlebars: 'handlebars/dist/handlebars.js',
    },
  },
  optimizeDeps: {
    include: ['handlebars'],
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
  },
});
