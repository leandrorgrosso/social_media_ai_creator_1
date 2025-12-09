import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente do diretório atual
  // O terceiro parâmetro '' permite carregar todas as variáveis, não apenas as com prefixo VITE_
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Define process.env.API_KEY globalmente para ser usado no código cliente
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})