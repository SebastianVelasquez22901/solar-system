import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/solar-system/",
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-three': ['three'],
          'vendor-fiber': ['@react-three/fiber', '@react-three/drei'],
          'vendor-gsap': ['gsap'],
        },
      },
    },
  },
})
