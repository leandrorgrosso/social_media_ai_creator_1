import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface UpdatePasswordScreenProps {
  onPasswordUpdated: () => void;
}

const UpdatePasswordScreen: React.FC<UpdatePasswordScreenProps> = ({ onPasswordUpdated }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      setMessage('Senha atualizada com sucesso! Redirecionando...');
      setTimeout(() => {
        onPasswordUpdated();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar senha.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
      {/* Background Decorativo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob transition-colors"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 transition-colors"></div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border border-white/50 dark:border-gray-700 transition-colors">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-purple-500/30">
            AI
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white transition-colors">
            Nova Senha
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 transition-colors">
            Digite sua nova senha abaixo para recuperar o acesso.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1 transition-colors">Nova Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1 transition-colors">Confirmar Senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-sm rounded-lg text-center font-medium border border-red-100 dark:border-red-800 animate-pulse transition-colors">
              {error}
            </div>
          )}

          {message && (
            <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 text-sm rounded-lg text-center font-medium border border-green-100 dark:border-green-800 transition-colors">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !!message}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all duration-300 transform active:scale-[0.98] ${
              isLoading || !!message
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/25 hover:shadow-purple-500/40'
            }`}
          >
            {isLoading ? 'Salvando...' : 'Redefinir Senha'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordScreen;