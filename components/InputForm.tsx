import React, { useState, useRef, useEffect } from 'react';
import { SocialPostInput, SavedPost } from '../types';

interface InputFormProps {
  onSubmit: (data: SocialPostInput) => void;
  isLoading: boolean;
  savedPosts?: SavedPost[];
}

// Sugestões padrão para quando não houver histórico
const SUGGESTIONS = {
  nicho: ["Marketing Digital", "Saúde & Bem-estar", "Tecnologia", "Moda & Estilo", "Finanças", "Desenvolvimento Pessoal", "Gastronomia"],
  publico: ["Empreendedores", "Estudantes", "Profissionais Liberais", "Pais e Mães", "Jovens Adultos", "Iniciantes", "Especialistas"],
  objetivo: ["Aumentar Engajamento", "Gerar Vendas", "Expandir Alcance", "Educar Seguidores", "Reconhecimento de Marca", "Gerar Leads"],
  tom: ["Motivacional", "Profissional", "Bem-humorado", "Educacional", "Urgente", "Empático", "Descontraído", "Autoritário"]
};

const STORAGE_KEY = 'social_post_input_history';

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, savedPosts = [] }) => {
  const [formData, setFormData] = useState<SocialPostInput>({
    tema: '',
    nicho: '',
    publico: '',
    objetivo: '',
    tom: '',
  });

  // Estado para controlar qual dropdown está aberto
  const [activeField, setActiveField] = useState<keyof SocialPostInput | null>(null);
  
  // Estado para histórico local (Nicho, Público, Objetivo, Tom)
  const [localHistory, setLocalHistory] = useState<Record<string, string[]>>({
    nicho: [],
    publico: [],
    objetivo: [],
    tom: []
  });

  const formRef = useRef<HTMLFormElement>(null);

  // Carregar histórico do localStorage ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setLocalHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar histórico local", e);
      }
    }
  }, []);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setActiveField(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Extrair tópicos recentes do DB (para o campo Tema)
  const dbTopics = React.useMemo(() => {
    const topics = savedPosts.map(p => p.topic).filter(Boolean);
    return Array.from(new Set(topics)).slice(0, 5);
  }, [savedPosts]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocus = (field: keyof SocialPostInput) => {
    setActiveField(field);
  };

  const handleSelectOption = (field: keyof SocialPostInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setActiveField(null);
  };

  const saveToHistory = (data: SocialPostInput) => {
    const newHistory = { ...localHistory };
    const fields: (keyof typeof localHistory)[] = ['nicho', 'publico', 'objetivo', 'tom'];

    fields.forEach(field => {
      const val = data[field as keyof SocialPostInput].trim();
      if (val) {
        // Adiciona ao início e remove duplicatas
        const currentList = newHistory[field] || [];
        const updatedList = [val, ...currentList.filter(item => item !== val)].slice(0, 5); // Manter apenas os 5 últimos
        newHistory[field] = updatedList;
      }
    });

    setLocalHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveToHistory(formData);
    onSubmit(formData);
    setActiveField(null);
  };

  // Helper para obter sugestões combinadas (Histórico + Populares)
  const getSuggestionsForField = (field: keyof SocialPostInput) => {
    if (field === 'tema') return dbTopics;
    
    const history = localHistory[field as keyof typeof localHistory] || [];
    const defaults = SUGGESTIONS[field as keyof typeof SUGGESTIONS] || [];
    
    // Filtra defaults que já estão no histórico para não duplicar visualmente
    const filteredDefaults = defaults.filter(d => !history.includes(d));
    
    return { history, defaults: filteredDefaults };
  };

  // Estilos compartilhados refatorados
  // Label: Uppercase, tracking wide, menor e mais negrito para melhor hierarquia
  const labelClasses = "block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 ml-1 transition-colors";
  
  // Input: Altura consistente, padding confortável, transições suaves
  const inputBaseClasses = "w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 outline-none appearance-none shadow-sm";
  
  // Estados interativos do Input
  const inputStateClasses = "focus:bg-white dark:focus:bg-gray-700 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 dark:focus:ring-purple-500/20 hover:border-purple-300 dark:hover:border-purple-500/50";
  
  const inputClasses = `${inputBaseClasses} ${inputStateClasses}`;

  // Renderizador de Campo Genérico
  const renderField = (
    field: keyof SocialPostInput, 
    label: string, 
    placeholder: string
  ) => {
    const isTopic = field === 'tema';
    const suggestionsData = getSuggestionsForField(field);
    
    // Normaliza a estrutura de dados para renderização
    const hasHistory = isTopic 
      ? (suggestionsData as string[]).length > 0 
      : (suggestionsData as { history: string[] }).history.length > 0;
      
    const hasDefaults = !isTopic && (suggestionsData as { defaults: string[] }).defaults.length > 0;
    
    const showDropdown = activeField === field && (hasHistory || hasDefaults);

    return (
      <div className="group relative w-full">
        <div className="flex justify-between items-end mb-2 px-1">
          <label className={labelClasses.replace('mb-2', 'mb-0')}>{label}</label>
          
          {/* Botão de "Recentes" para abrir o dropdown manualmente se fechado */}
          {hasHistory && activeField !== field && (
            <button
              type="button"
              onClick={() => setActiveField(activeField === field ? null : field)}
              className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center gap-1 transition-colors px-2 py-0.5 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/30 -mr-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Histórico</span>
            </button>
          )}
        </div>
        
        <div className="relative">
          <input
            type="text"
            name={field}
            required
            placeholder={placeholder}
            className={`${inputClasses} pr-10`} // Espaço para ícone de seta
            value={formData[field]}
            onChange={handleChange}
            onFocus={() => handleFocus(field)}
            autoComplete="off"
          />
          
          {/* Ícone indicador de dropdown */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500 transition-colors">
             {(hasHistory || hasDefaults) ? (
               <svg className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180 text-purple-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
               </svg>
             ) : null}
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl shadow-purple-900/10 dark:shadow-black/40 z-30 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden max-h-64 overflow-y-auto custom-scrollbar">
              <div className="py-1">
                {/* Seção Histórico */}
                {hasHistory && (
                  <>
                    <div className="px-4 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider bg-gray-50/80 dark:bg-gray-700/50 flex items-center gap-2 backdrop-blur-sm sticky top-0 z-10">
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Recentes
                    </div>
                    {(isTopic ? (suggestionsData as string[]) : (suggestionsData as any).history).map((item: string, idx: number) => (
                      <button
                        key={`hist-${idx}`}
                        type="button"
                        onClick={() => handleSelectOption(field, item)}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 transition-colors flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-300 dark:bg-purple-600 group-hover:bg-purple-500 dark:group-hover:bg-purple-400 transition-colors flex-shrink-0"></span>
                        <span className="truncate">{item}</span>
                      </button>
                    ))}
                  </>
                )}

                {/* Seção Sugestões */}
                {hasDefaults && (
                  <>
                    <div className="px-4 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider bg-gray-50/80 dark:bg-gray-700/50 flex items-center gap-2 border-t border-gray-100 dark:border-gray-700 sticky top-0 z-10 backdrop-blur-sm">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Sugestões
                    </div>
                    {(suggestionsData as any).defaults.map((item: string, idx: number) => (
                      <button
                        key={`def-${idx}`}
                        type="button"
                        onClick={() => handleSelectOption(field, item)}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-2"
                      >
                         <span className="text-gray-300 dark:text-gray-600 text-xs">#</span>
                        <span className="truncate">{item}</span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-xl shadow-purple-900/5 dark:shadow-none rounded-3xl p-6 sm:p-8 w-full border border-white/50 dark:border-gray-700 relative overflow-visible flex flex-col h-full transition-colors">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-t-3xl"></div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3 transition-colors">
          <span className="text-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 p-2.5 rounded-xl shadow-inner border border-white/50 dark:border-white/10">✨</span> 
          <span>Crie Conteúdo</span>
        </h2>
      </div>
      
      <div className="space-y-6 flex-grow">
        
        {/* Full width row: Tema */}
        <div className="w-full">
           {renderField('tema', 'Tema / Tópico', 'ex: 5 dicas para vender mais')}
        </div>

        {/* Two columns row: Nicho & Público */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
           {renderField('nicho', 'Nicho', 'ex: Marketing')}
           {renderField('publico', 'Público Alvo', 'ex: Iniciantes')}
        </div>

        {/* Two columns row: Objetivo & Tom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
           {renderField('objetivo', 'Objetivo', 'ex: Engajamento')}
           {renderField('tom', 'Tom de Voz', 'ex: Descontraído')}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg shadow-purple-500/20 dark:shadow-purple-900/30 hover:shadow-purple-500/40 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-3 ${
            isLoading ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Gerando...</span>
            </>
          ) : (
            <>
              <span>Gerar Conteúdo</span>
              <svg className="w-5 h-5 text-purple-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default InputForm;