import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Systeme_de_Telemedecine_et_de_Diagnostic_par_Intelligence_Artificielle/',
  server: {
    port: 5174,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
