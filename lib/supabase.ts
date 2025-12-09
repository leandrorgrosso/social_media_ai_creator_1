import { createClient } from '@supabase/supabase-js';

// Chaves do Supabase fornecidas
const DEFAULT_SUPABASE_URL = "https://soipisfvwadmxyenrvaw.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvaXBpc2Z2d2FkbXh5ZW5ydmF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODI4ODEsImV4cCI6MjA4MDg1ODg4MX0.03vi8L1-tCmql91pc_cnoxJCzqmP5B8cV5DQ1i1GJbY";

// Função helper para acessar variáveis de ambiente com segurança
// Evita o erro "Cannot read properties of undefined" se import.meta.env não existir
const getEnvVar = (key: string, defaultValue: string) => {
  try {
    // Verifica se import.meta.env existe antes de tentar acessar
    // Usamos cast para any para evitar erros de tipagem caso os tipos do Vite não estejam carregados
    const meta = import.meta as any;
    if (meta && meta.env && meta.env[key]) {
      return meta.env[key];
    }
  } catch (e) {
    // Ignora erros de acesso e retorna o padrão
  }
  return defaultValue;
};

// Tenta pegar do .env (Vite), se falhar usa as chaves hardcoded
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', DEFAULT_SUPABASE_URL);
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', DEFAULT_SUPABASE_ANON_KEY);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Configuração do Supabase incompleta.');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);