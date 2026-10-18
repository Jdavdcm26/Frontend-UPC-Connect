import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // react(): permite usar JSX/TSX. tailwindcss(): procesa las clases de Tailwind.
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // "@/algo" se resuelve a "src/algo" (mismo alias que en tsconfig)
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})