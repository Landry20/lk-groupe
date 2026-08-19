import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const silentHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
}

const base = process.env.VITE_BASE ?? '/'

export default defineConfig({
  base,
  resolve: {
    dedupe: ['react', 'react-dom', 'three'],
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'apple-touch-icon.png',
        'logos/logo-light.jpeg',
        'logos/logo-dark.jpeg',
        'logos/brand-light.jpeg',
        'logos/brand-dark.jpeg',
        'manifest-client.webmanifest',
        'manifest-admin.webmanifest',
      ],
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpeg,webp,woff2,webmanifest}'],
        navigateFallback: `${base}index.html`.replace('//index.html', '/index.html'),
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'lk-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
    {
      name: 'spa-github-pages',
      closeBundle() {
        const index = resolve('dist/index.html')
        if (existsSync(index)) copyFileSync(index, resolve('dist/404.html'))
      },
    },
  ],
  server: {
    port: 5173,
    host: true,
    headers: silentHeaders,
  },
  preview: {
    port: 5173,
    host: true,
    headers: silentHeaders,
  },
})
