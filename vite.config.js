// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Memo App',
        short_name: 'MemoApp',
        description: 'Memo Application',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        start_url: '/',
        display: 'standalone',
        icons: [
          {
            src: '/icons/icon.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        // 必要に応じてキャッシュの設定を行います
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
