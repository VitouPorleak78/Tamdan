import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'TamDan',
        short_name: 'TamDan',
        description: 'Daily routine and focus tracker',
        theme_color: '#09090b',
        background_color: '#09090b',
        display: 'standalone',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/906/906334.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})