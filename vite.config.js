import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['cricket-lovers-logo.svg', 'icons/icon-192x192.svg', 'icons/icon-512x512.svg'],
      manifest: {
        name: 'Cricket Lovers Global - Fantasy Cricket',
        short_name: 'Cricket Lovers',
        description: 'Cricket Lovers Global - Create your fantasy cricket team and compete with friends. Passion Beyond Boundaries!',
        theme_color: '#fdc700',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '.',
        start_url: '.',
        icons: [
          {
            src: 'cricket-lovers-logo.svg',
            sizes: '32x32',
            type: 'image/svg+xml'
          },
          {
            src: 'icons/icon-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'icons/icon-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          },
          {
            src: 'icons/icon-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'icons/icon-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: null,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          },
          {
            urlPattern: /\.(?:js|css|html)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        suppressWarnings: true,
        navigateFallback: '/',
        type: 'module',
        disableDevLogs: true
      }
    })
  ],

  server: {
    host: true,
    port: 5173,
    strictPort: false
  },
  preview: {
    host: true,
    port: 4173
  }
})
