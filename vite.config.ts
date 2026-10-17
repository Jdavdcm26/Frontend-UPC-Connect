import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // react(): permite usar JSX/TSX. tailwindcss(): procesa las clases de Tailwind.
  plugins: [react(), tailwindcss()],
})