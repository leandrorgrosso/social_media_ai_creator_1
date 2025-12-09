import React, { useState } from 'react';
import { SocialPostInput } from '../types';

interface InputFormProps {
  onSubmit: (data: SocialPostInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<SocialPostInput>({
    tema: '',
    nicho: '',
    publico: '',
    objetivo: '',
    tom: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Constantes de estilo para padronização rigorosa
  // py-3.5 garante uma altura de toque confortável em mobile e alinhamento perfeito
  const labelClasses = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1 tracking-wide transition-colors";
  // Adicionado 'text-base' para garantir 16px e evitar zoom automático no iOS em inputs
  // Dark mode: fundo mais escuro que o card, texto branco, borda sutil
  const inputBaseClasses = "w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 outline-none appearance-none";
  const inputStateClasses = "focus:bg-white dark:focus:bg-gray-600 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:focus:ring-purple-500/20 hover:border-purple-300 dark:hover:border-purple-400";
  const inputClasses = `${inputBaseClasses} ${inputStateClasses}`;

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-xl shadow-purple-900/5 dark:shadow-none rounded-2xl p-5 sm:p-6 md:p-8 w-full max-w-2xl mx-auto border border-white/50 dark:border-gray-700 relative overflow-hidden flex flex-col h-full transition-colors">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"></div>

      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3 transition-colors">
          <span className="text-2xl md:text-3xl bg-purple-100 dark:bg-purple-900/30 p-2.5 rounded-xl shadow-sm">✨</span> 
          <span>Crie Conteúdo Mágico</span>
        </h2>
      </div>
      
      <div className="space-y-5 md:space-y-8 flex-grow">
        {/* Full width row */}
        <div className="group">
          <label className={labelClasses}>Tema / Tópico</label>
          <input
            type="text"
            name="tema"
            required
            placeholder="ex: Como vender mais no Instagram"
            className={inputClasses}
            value={formData.tema}
            onChange={handleChange}
          />
        </div>

        {/* Two columns row - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
          <div className="group">
            <label className={labelClasses}>Nicho</label>
            <input
              type="text"
              name="nicho"
              required
              placeholder="ex: Marketing Digital"
              className={inputClasses}
              value={formData.nicho}
              onChange={handleChange}
            />
          </div>
          <div className="group">
            <label className={labelClasses}>Público Alvo</label>
            <input
              type="text"
              name="publico"
              required
              placeholder="ex: Pequenos empresários"
              className={inputClasses}
              value={formData.publico}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Two columns row - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
           <div className="group relative">
            <label className={labelClasses}>Objetivo</label>
            <div className="relative">
              <select
                name="objetivo"
                required
                className={`${inputClasses} pr-10 cursor-pointer`}
                value={formData.objetivo}
                onChange={handleChange}
              >
                <option value="" disabled>Selecione um objetivo...</option>
                <option value="Engagement">Aumentar Engajamento</option>
                <option value="Sales">Gerar Vendas</option>
                <option value="Reach">Expandir Alcance</option>
                <option value="Education">Educar Seguidores</option>
                <option value="Brand Awareness">Reconhecimento de Marca</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 dark:text-gray-400">
                <svg className="h-5 w-5 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="group relative">
            <label className={labelClasses}>Tom</label>
            <div className="relative">
              <select
                name="tom"
                required
                className={`${inputClasses} pr-10 cursor-pointer`}
                value={formData.tom}
                onChange={handleChange}
              >
                <option value="" disabled>Selecione um tom...</option>
                <option value="Motivational">Motivacional</option>
                <option value="Professional">Profissional</option>
                <option value="Humorous">Bem-humorado</option>
                <option value="Educational">Educacional</option>
                <option value="Urgent">Urgente</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 dark:text-gray-400">
                <svg className="h-5 w-5 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 md:mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg shadow-purple-500/20 dark:shadow-purple-900/30 hover:shadow-purple-500/40 transition-all duration-300 transform active:scale-[0.98] ${
            isLoading ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Criando Mágica...
            </span>
          ) : (
            'Gerar Conteúdo'
          )}
        </button>
      </div>
    </form>
  );
};

export default InputForm;