import React, { useState } from 'react';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    title: "Bem-vindo ao Criador de Posts!",
    description: "Sua nova ferramenta de IA para criar conteúdo viral no Instagram e TikTok em segundos. Vamos fazer um tour rápido?",
    icon: (
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 mb-4">
        <span className="text-3xl">👋</span>
      </div>
    )
  },
  {
    title: "1. Defina seu Conteúdo",
    description: "No painel esquerdo, preencha o formulário com o Tema, Nicho e Público. Quanto mais detalhes, melhor o resultado da IA.",
    icon: (
      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </div>
    )
  },
  {
    title: "2. Estúdio Criativo",
    description: "A IA gera legendas, hashtags e sugestões visuais. Use o 'Estúdio de IA' à direita para gerar imagens reais em 1K, 2K ou 4K.",
    icon: (
      <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/40 rounded-2xl flex items-center justify-center text-pink-600 dark:text-pink-400 mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    )
  },
  {
    title: "3. Salve e Organize",
    description: "Gostou do resultado? Clique em 'Salvar' para guardar no seu Histórico. Acesse seus posts antigos a qualquer momento no menu.",
    icon: (
      <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </div>
    )
  }
];

const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop com Blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20 dark:border-gray-700">
        
        {/* Decorative Background Circles */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Step Icon with Animation */}
          <div key={`icon-${currentStep}`} className="animate-in zoom-in fade-in duration-300">
            {STEPS[currentStep].icon}
          </div>

          <h3 key={`title-${currentStep}`} className="text-2xl font-bold text-gray-900 dark:text-white mb-3 animate-in slide-in-from-bottom-2 fade-in duration-300">
            {STEPS[currentStep].title}
          </h3>
          
          <p key={`desc-${currentStep}`} className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed animate-in slide-in-from-bottom-4 fade-in duration-300">
            {STEPS[currentStep].description}
          </p>

          {/* Progress Indicators */}
          <div className="flex gap-2 mb-8">
            {STEPS.map((_, idx) => (
              <div 
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep 
                    ? "w-8 bg-purple-600 dark:bg-purple-500" 
                    : "w-2 bg-gray-200 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex w-full gap-3">
             {currentStep > 0 ? (
               <button
                 onClick={handlePrev}
                 className="flex-1 py-3 px-4 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
               >
                 Anterior
               </button>
             ) : (
               <button
                 onClick={onClose}
                 className="flex-1 py-3 px-4 rounded-xl font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
               >
                 Pular
               </button>
             )}
             
             <button
               onClick={handleNext}
               className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/25 transition-all transform active:scale-95"
             >
               {currentStep === STEPS.length - 1 ? "Começar!" : "Próximo"}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;