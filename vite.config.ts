import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente baseadas no modo atual (development/production)
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Isso permite que o código 'process.env.API_KEY' funcione no navegador
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})