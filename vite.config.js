import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.png', 'pwa-192x192.png', 'pwa-512x512.png', 'screenshots/*.png', 'logo192.png', 'logo512.png'],
      manifest: {
        name: 'Winco Official Platform',
        short_name: 'Winco',
        description: 'Winco Gaming & Sports Betting Platform. High odds, fast withdrawals, and exclusive promotions.',
        theme_color: '#E49C16',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'any',
        categories: ['games', 'entertainment', 'finance'],
        icons: [
          {
            src: 'logo192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'logo512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'logo512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],

        shortcuts: [
          {
            name: 'Quick Deposit',
            url: '/deposit',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'Active Promotions',
            url: '/promotion',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }]
          }
        ],
        prefer_related_applications: false,
        launch_handler: {
          client_mode: 'focus-existing'
        }
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Vite handles history API fallback automatically
  },
  preview: {
    // Vite handles history API fallback automatically
  },
})