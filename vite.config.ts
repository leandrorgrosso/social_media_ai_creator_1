import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente do diretório atual
  // Cast process to any to avoid TypeScript error: Property 'cwd' does not exist on type 'Process'
  const env = loadEnv(mode, (process as any).cwd(), '');

  // Tenta pegar a chave de API de múltiplas fontes possíveis para garantir que funcione
  const apiKey = env.API_KEY || env.VITE_GEMINI_API_KEY || '';

  return {
    plugins: [react({ jsxRuntime: 'classic' })],
    define: {
      // Define a variável globalmente
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  }
})