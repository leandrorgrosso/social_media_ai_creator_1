import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente do diretório atual
  const env = loadEnv(mode, process.cwd(), '');

  // Tenta pegar a chave de API de múltiplas fontes possíveis para garantir que funcione
  const apiKey = env.API_KEY || env.VITE_GEMINI_API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Define a variável globalmente
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  }
})