import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png', 'icon.svg'],
      manifestFilename: 'manifest.json',
      manifest: {
        name: 'みことばスイッチ',
        short_name: 'みことば',
        description: '金の領域で捉える視点で、日々みことばを黙想するアプリ',
        theme_color: '#c89b2b',
        background_color: '#0b0a08',
        display: 'standalone',
        start_url: './#/',
        scope: './',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firestore-cache',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 },
            },
          },
          {
            urlPattern: /^https:\/\/identitytoolkit\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firebase-auth-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 30 },
            },
          },
        ],
      },
    }),
  ],
})
