import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import InputForm from './components/InputForm';
import PostResult from './components/PostResult';
import ImageGenerator from './components/ImageGenerator';
import LoginScreen from './components/LoginScreen';
import UpdatePasswordScreen from './components/UpdatePasswordScreen';
import { SocialPostInput, GeneratedPostContent } from './types';
import { generatePostContent } from './services/geminiService';

export function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [content, setContent] = useState<GeneratedPostContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Estado do Tema (Dark Mode)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme as 'light' | 'dark';
      // Verifica preferência do sistema
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  // Efeito para aplicar a classe 'dark' ao HTML e salvar no localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoadingSession(false);
    });

    // Ouvir mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event); // Debug log para produção
      setSession(session);
      
      if (event === 'PASSWORD_RECOVERY') {
        console.log('Modo de recuperação ativado');
        setIsRecoveryMode(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsRecoveryMode(false);
  };

  const handlePasswordUpdated = () => {
    setIsRecoveryMode(false);
    // O usuário já está logado após o update, então apenas removemos o modo de recuperação
  };

  const handleFormSubmit = async (inputData: SocialPostInput) => {
    setIsGenerating(true);
    setError(null);
    setContent(null);

    try {
      const result = await generatePostContent(inputData);
      setContent(result);
    } catch (err: any) {
      console.error(err);
      let errorMsg = "Falha ao gerar conteúdo. Verifique se sua chave de API é válida e tente novamente.";
      
      if (err.message && (err.message.includes('429') || err.message.includes('RESOURCE_EXHAUSTED'))) {
         errorMsg = "O limite gratuito da API foi atingido temporariamente (Erro 429). Por favor, aguarde alguns segundos antes de tentar novamente.";
      }

      setError(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoadingSession) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] dark:bg-gray-900 transition-colors">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
    );
  }

  // Passamos o tema atual e a função de toggle para as telas de login/update se necessário,
  // ou apenas deixamos elas herdarem o contexto global de classe 'dark'
  if (isRecoveryMode) {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
         <UpdatePasswordScreen onPasswordUpdated={handlePasswordUpdated} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <LoginScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 pb-20 animate-in fade-in duration-700 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
              AI
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              Criador de Posts
            </h1>
          </div>
          <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400 hidden sm:inline-block dark:text-gray-500">{session.user.email}</span>
              
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                title={theme === 'light' ? "Mudar para Modo Escuro" : "Mudar para Modo Claro"}
              >
                {theme === 'light' ? (
                  // Moon Icon
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  // Sun Icon
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>

              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

              <button 
                onClick={handleLogout}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
              >
                Sair
              </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
             <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Defina seu Post</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">Preencha os detalhes abaixo para deixar o Gemini criar o conteúdo perfeito para suas redes sociais.</p>
             </div>
            <InputForm onSubmit={handleFormSubmit} isLoading={isGenerating} />
            {error && (
                <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 rounded-md animate-in fade-in slide-in-from-top-2">
                    <p className="font-bold text-sm uppercase mb-1">Atenção</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8">
             {!content && !isGenerating && (
                <div className="flex flex-col items-center justify-center h-[500px] bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-center p-8 transition-colors">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 transition-colors">
                        <span className="text-4xl">✨</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 transition-colors">Pronto para Criar?</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md transition-colors">Digite seu tópico à esquerda e veja a IA gerar títulos, legendas e conceitos visuais prontos para engajamento.</p>
                </div>
             )}

             {isGenerating && (
                 <div className="flex flex-col items-center justify-center h-[500px] space-y-4">
                    <div className="w-12 h-12 border-4 border-purple-200 dark:border-purple-900/50 border-t-purple-600 dark:border-t-purple-500 rounded-full animate-spin"></div>
                    <p className="text-purple-600 dark:text-purple-400 font-medium animate-pulse">
                      Analisando tendências e criando o texto...
                      <span className="block text-xs text-gray-400 dark:text-gray-500 mt-2 font-normal">(Isso pode levar alguns segundos se a IA estiver ocupada)</span>
                    </p>
                 </div>
             )}

            {content && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="h-full">
                  <PostResult content={content} />
                </div>
                <div className="h-full">
                  <ImageGenerator initialPrompt={content.visual_prompt} />
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}