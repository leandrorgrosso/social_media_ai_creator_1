import React, { useState } from 'react';
import { GeneratedPostContent } from '../types';

interface PostResultProps {
  content: GeneratedPostContent;
}

const PostResult: React.FC<PostResultProps> = ({ content }) => {
  // Estado para rastrear qual botão está exibindo o feedback de "Copiado!"
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    
    // Remove o feedback após 2 segundos
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const getFullContentText = () => {
    return `${content.title}

${content.caption}

Hashtags:
${content.hashtags.join(' ')}

---
Variações

Versão Curta:
${content.variations.short_version}

Versão Engraçada:
${content.variations.funny_version}`;
  };

  // Componente de botão reutilizável com feedback visual
  const CopyButton = ({ 
    text, 
    contentToCopy, 
    id, 
    colorClass = "bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-200" 
  }: { 
    text: string, 
    contentToCopy: string, 
    id: string, 
    colorClass?: string 
  }) => {
    const isCopied = copiedId === id;
    
    return (
      <button
        onClick={() => handleCopy(contentToCopy, id)}
        disabled={isCopied}
        className={`text-xs px-3 py-1.5 rounded-lg transition-all transform active:scale-95 font-medium flex items-center gap-1 border ${
          isCopied 
            ? "bg-green-100 text-green-700 border-green-200 cursor-default scale-100" 
            : colorClass
        }`}
        title="Copiar para área de transferência"
      >
        {isCopied ? (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        )}
        {isCopied ? "Copiado!" : text}
      </button>
    );
  };

  const isFullCopied = copiedId === 'full_content';

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 w-full border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span>📝</span> Post Gerado
        </h3>
        
        <button
          onClick={() => handleCopy(getFullContentText(), 'full_content')}
          disabled={isFullCopied}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2 border ${
            isFullCopied
              ? "bg-green-100 text-green-700 border-green-200"
              : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-100"
          }`}
          title="Copiar Post Completo (Título, Legenda, Tags e Variações)"
        >
          {isFullCopied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Copiado!</span>
            </>
          ) : (
             "Copiar Tudo"
          )}
        </button>
      </div>

      <div className="space-y-6 flex-grow overflow-y-auto pr-2 custom-scrollbar">
        {/* Título */}
        <div>
          <div className="flex justify-between items-end mb-1">
            <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Título</label>
            <CopyButton
              text="Copiar Título+Legenda"
              contentToCopy={`${content.title}\n\n${content.caption}`}
              id="title_caption"
            />
          </div>
          <p className="text-lg font-bold text-gray-900 leading-tight">{content.title}</p>
        </div>

        {/* Legenda */}
        <div>
          <label className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1 block">Legenda</label>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
            {content.caption}
          </div>
        </div>

        {/* Hashtags */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">Hashtags</label>
            <CopyButton 
              text="Copiar Tags" 
              contentToCopy={content.hashtags.join(' ')}
              id="hashtags"
              colorClass="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-100"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {content.hashtags.map((tag, idx) => (
              <span key={idx} className="bg-blue-50/50 text-blue-600 border border-blue-100 px-2 py-1 rounded-md text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Variações */}
        <div className="border-t border-gray-100 pt-6">
          <label className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-3 block">Variações</label>
          <div className="grid gap-4">
            {/* Versão Curta */}
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 transition-colors hover:border-amber-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Versão Curta</span>
                <CopyButton 
                  text="Copiar" 
                  contentToCopy={content.variations.short_version}
                  id="short_version"
                  colorClass="bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-200/50"
                />
              </div>
              <p className="text-sm text-gray-800 leading-relaxed">{content.variations.short_version}</p>
            </div>

            {/* Versão Engraçada */}
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 transition-colors hover:border-purple-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">Versão Engraçada</span>
                 <CopyButton 
                  text="Copiar" 
                  contentToCopy={content.variations.funny_version}
                  id="funny_version"
                  colorClass="bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-200/50"
                />
              </div>
              <p className="text-sm text-gray-800 leading-relaxed">{content.variations.funny_version}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostResult;