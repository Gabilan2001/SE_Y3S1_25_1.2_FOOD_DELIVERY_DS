// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   server:{
//     https:{
//       key:'',
//       cert:'',
//     }
//   },
//   plugins: [
//     react(),
//     tailwindcss(),
//   ],
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('./localhost-key.pem'),  // Path to the private key
      cert: fs.readFileSync('./localhost.pem'),     // Path to the certificate
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
