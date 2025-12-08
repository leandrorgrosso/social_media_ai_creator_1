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

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-6 md:p-8 w-full max-w-2xl mx-auto border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <span className="text-3xl">✨</span> Crie Conteúdo Mágico
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tema / Tópico</label>
          <input
            type="text"
            name="tema"
            required
            placeholder="ex: Como vender mais no Instagram"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
            value={formData.tema}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nicho</label>
            <input
              type="text"
              name="nicho"
              required
              placeholder="ex: Marketing Digital"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
              value={formData.nicho}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Público Alvo</label>
            <input
              type="text"
              name="publico"
              required
              placeholder="ex: Pequenos empresários"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
              value={formData.publico}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo</label>
            <select
              name="objetivo"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none bg-white"
              value={formData.objetivo}
              onChange={handleChange}
            >
              <option value="">Selecione um objetivo...</option>
              <option value="Engagement">Aumentar Engajamento</option>
              <option value="Sales">Gerar Vendas</option>
              <option value="Reach">Expandir Alcance</option>
              <option value="Education">Educar Seguidores</option>
              <option value="Brand Awareness">Reconhecimento de Marca</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tom</label>
            <select
              name="tom"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none bg-white"
              value={formData.tom}
              onChange={handleChange}
            >
              <option value="">Selecione um tom...</option>
              <option value="Motivational">Motivacional</option>
              <option value="Professional">Profissional</option>
              <option value="Humorous">Bem-humorado</option>
              <option value="Educational">Educacional</option>
              <option value="Urgent">Urgente</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`mt-8 w-full py-3.5 px-6 rounded-xl text-white font-semibold text-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
          isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Gerando Mágica...
          </span>
        ) : (
          'Gerar Conteúdo'
        )}
      </button>
    </form>
  );
};

export default InputForm;