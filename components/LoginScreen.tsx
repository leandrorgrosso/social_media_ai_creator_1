import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface LoginScreenProps {
  onLogin?: () => void; // Mantido para compatibilidade, mas o App agora observa a sessão
}

const LoginScreen: React.FC<LoginScreenProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Alternar entre Login e Cadastro
  const [isResetPassword, setIsResetPassword] = useState(false); // Alternar para Recuperação de Senha
  const [message, setMessage] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setMessage('Se o e-mail estiver cadastrado, você receberá um link de recuperação em instantes.');
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar email de recuperação.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        setMessage('Verifique seu e-mail para confirmar o cadastro!');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        // O redirecionamento acontece automaticamente via onAuthStateChange no App.tsx
      }
    } catch (err: any) {
      // Tradução amigável de erros comuns
      if (err.message === 'Invalid login credentials') {
        setError('E-mail ou senha incorretos.');
      } else {
        setError(err.message || 'Ocorreu um erro na autenticação.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Determina qual função chamar no submit baseada no modo atual
  const handleSubmit = (e: React.FormEvent) => {
    if (isResetPassword) {
      handleResetPassword(e);
    } else {
      handleAuth(e);
    }
  };

  // Renderização dinâmica do título
  const getTitle = () => {
    if (isResetPassword) return 'Recuperar Senha';
    if (isSignUp) return 'Criar Conta';
    return 'Bem-vindo de volta';
  };

  // Renderização dinâmica do subtítulo
  const getSubtitle = () => {
    if (isResetPassword) return 'Digite seu e-mail para receber o link';
    if (isSignUp) return 'Comece a criar posts incríveis';
    return 'Acesse seu estúdio criativo';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border border-white/50">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-purple-500/30">
            AI
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {getTitle()}
          </h2>
          <p className="text-gray-500 mt-2">
            {getSubtitle()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all"
              placeholder="seu@email.com"
              required
            />
          </div>

          {/* Campo de Senha - Esconder se estiver resetando a senha */}
          {!isResetPassword && (
            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-sm font-semibold text-gray-700">Senha</label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetPassword(true);
                      setError('');
                      setMessage('');
                    }}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-700"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium border border-red-100 animate-pulse">
              {error}
            </div>
          )}

          {message && (
            <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg text-center font-medium border border-green-100">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all duration-300 transform active:scale-[0.98] ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/25 hover:shadow-purple-500/40'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </span>
            ) : (
              isResetPassword ? 'Enviar Link de Recuperação' : (isSignUp ? 'Criar Conta' : 'Entrar')
            )}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-500">
          {isResetPassword ? (
            <button 
              type="button"
              onClick={() => {
                setIsResetPassword(false);
                setError('');
                setMessage('');
              }}
              className="text-gray-600 font-bold hover:text-gray-800 flex items-center justify-center gap-2 mx-auto focus:outline-none"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Voltar para Login
            </button>
          ) : (
            <>
              {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
              <button 
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setMessage('');
                }}
                className="text-purple-600 font-bold hover:underline focus:outline-none"
              >
                {isSignUp ? 'Fazer Login' : 'Criar conta'}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;