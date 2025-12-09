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

  // Classes padronizadas para garantir consistência visual perfeita
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2 ml-1";
  const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-200 outline-none hover:border-purple-200";

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-xl shadow-purple-900/5 rounded-2xl p-6 md:p-8 w-full max-w-2xl mx-auto border border-white/50 relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"></div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <span className="text-3xl bg-purple-100 p-2 rounded-lg">✨</span> 
          <span>Crie Conteúdo Mágico</span>
        </h2>
      </div>
      
      <div className="space-y-6">
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

        {/* Two columns row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Two columns row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="group">
            <label className={labelClasses}>Objetivo</label>
            <div className="relative">
              <select
                name="objetivo"
                required
                className={`${inputClasses} appearance-none cursor-pointer`}
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
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="group">
            <label className={labelClasses}>Tom</label>
            <div className="relative">
              <select
                name="tom"
                required
                className={`${inputClasses} appearance-none cursor-pointer`}
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
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-50">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 transform active:scale-[0.98] ${
            isLoading ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
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