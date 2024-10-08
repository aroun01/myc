import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import fs from 'fs'
export default defineConfig({
plugins: [react()],
  server: {
      hmr: {
          host: "myclient.ru",
          protocol: "wss",
          clientPort: 5173
      },
      host: "myclient.ru",
      watch: {
          usePolling: true,
      },
      https: {
          key: fs.readFileSync('/code/ssl/privkey.pem'),
          cert: fs.readFileSync('/code/ssl/fullchain.pem'),
      }
  }
})
