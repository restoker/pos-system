import { resolve } from 'path';
import { defineConfig } from 'electron-vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

export default defineConfig({
  main: {},
  preload: {
    build: {
      rollupOptions: {
        external: [
          // Don't externalize @better-auth/electron so it gets bundled into preload
        ]
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [ 
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
      }),
      react(),
  ]
  }
})
