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
      setSession(session);
      
      if (event === 'PASSWORD_RECOVERY') {
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
        <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6]">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
    );
  }

  // Se estiver em modo de recuperação de senha, mostra a tela de atualização de senha
  if (isRecoveryMode) {
    return <UpdatePasswordScreen onPasswordUpdated={handlePasswordUpdated} />;
  }

  if (!session) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              AI
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              Criador de Posts
            </h1>
          </div>
          <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400 hidden sm:inline-block">{session.user.email}</span>
              <button 
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-purple-600 font-medium transition-colors"
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Defina seu Post</h2>
                <p className="text-gray-500 text-sm">Preencha os detalhes abaixo para deixar o Gemini criar o conteúdo perfeito para suas redes sociais.</p>
             </div>
            <InputForm onSubmit={handleFormSubmit} isLoading={isGenerating} />
            {error && (
                <div className="mt-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md animate-in fade-in slide-in-from-top-2">
                    <p className="font-bold text-sm uppercase mb-1">Atenção</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8">
             {!content && !isGenerating && (
                <div className="flex flex-col items-center justify-center h-[500px] bg-white rounded-3xl border-2 border-dashed border-gray-200 text-center p-8">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <span className="text-4xl">✨</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Pronto para Criar?</h3>
                    <p className="text-gray-500 max-w-md">Digite seu tópico à esquerda e veja a IA gerar títulos, legendas e conceitos visuais prontos para engajamento.</p>
                </div>
             )}

             {isGenerating && (
                 <div className="flex flex-col items-center justify-center h-[500px] space-y-4">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    <p className="text-purple-600 font-medium animate-pulse">
                      Analisando tendências e criando o texto...
                      <span className="block text-xs text-gray-400 mt-2 font-normal">(Isso pode levar alguns segundos se a IA estiver ocupada)</span>
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