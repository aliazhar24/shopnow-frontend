import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
     tailwindcss()
  ],
   server: {
    allowedHosts: [
      "jamey-soggy-nonnattily.ngrok-free.dev", // your tunnel URL (no https://)
      "localhost",
    ]
  }
})

