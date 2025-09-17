
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from 'vite-plugin-pwa';
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg}']
      },
      manifest: {
        name: 'RespiraZen 🧘‍♀️ - Respiração Guiada',
        short_name: 'RespiraZen 🧘‍♀️',
        description: 'Transforme sua vida com respiração guiada e meditação mindfulness',
        theme_color: '#22c55e',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
