import React, { useState, useEffect } from 'react';
import { GeneratedPostContent } from '../types';

interface PostResultProps {
  content: GeneratedPostContent;
  onSave?: () => void;
  onContentUpdate?: (newContent: GeneratedPostContent) => void;
  isSaved?: boolean;
  isSaving?: boolean;
}

const PostResult: React.FC<PostResultProps> = ({ content, onSave, onContentUpdate, isSaved, isSaving }) => {
  // Estado para rastrear qual botão está exibindo o feedback de "Copiado!"
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Estados para Edição
  const [isEditing, setIsEditing] = useState(false);
  const [editedCaption, setEditedCaption] = useState(content.caption);

  // Sincronizar estado de edição quando o conteúdo muda (ex: novo post gerado ou selecionado do histórico)
  useEffect(() => {
    setEditedCaption(content.caption);
    setIsEditing(false);
  }, [content]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    
    // Remove o feedback após 2 segundos
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const startEditing = () => {
    setEditedCaption(content.caption);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditedCaption(content.caption);
    setIsEditing(false);
  };

  const saveEditing = () => {
    if (onContentUpdate) {
      onContentUpdate({
        ...content,
        caption: editedCaption
      });
    }
    setIsEditing(false);
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
    variant = "default",
    className = ""
  }: { 
    text: string, 
    contentToCopy: string, 
    id: string, 
    variant?: "default" | "ghost" | "blue" | "amber" | "purple" | "green",
    className?: string
  }) => {
    const isCopied = copiedId === id;
    
    let colorClass = "";
    if (isCopied) {
      colorClass = "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800 cursor-default";
    } else {
      switch (variant) {
        case "ghost":
          colorClass = "bg-transparent hover:bg-gray-100 text-gray-500 hover:text-gray-700 dark:hover:bg-gray-700 dark:text-gray-400 border-transparent";
          break;
        case "blue":
          colorClass = "bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800";
          break;
        case "amber":
          colorClass = "bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-200/50 dark:bg-amber-800/40 dark:hover:bg-amber-800/60 dark:text-amber-200 dark:border-amber-700";
          break;
        case "purple":
          colorClass = "bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-200/50 dark:bg-purple-800/40 dark:hover:bg-purple-800/60 dark:text-purple-200 dark:border-purple-700";
          break;
        case "green":
          colorClass = "bg-green-50 hover:bg-green-100 text-green-700 border-green-200/50 dark:bg-green-900/20 dark:hover:bg-green-900/40 dark:text-green-300 dark:border-green-800";
          break;
        default:
          colorClass = "bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:border-gray-600";
      }
    }

    return (
      <button
        onClick={() => handleCopy(contentToCopy, id)}
        disabled={isCopied}
        className={`text-xs px-2.5 py-1.5 rounded-lg transition-all transform active:scale-95 font-medium flex items-center gap-1.5 border ${colorClass} ${className}`}
        title="Copiar para área de transferência"
      >
        {isCopied ? (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        )}
        <span>{isCopied ? "Copiado!" : text}</span>
      </button>
    );
  };

  const isFullCopied = copiedId === 'full_content';

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl w-full border border-gray-100 dark:border-gray-700 h-full flex flex-col transition-colors overflow-hidden">
      
      {/* Header Principal */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between items-center z-10">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span className="bg-purple-100 dark:bg-purple-900/50 p-1.5 rounded-lg text-lg">📝</span> 
          Post Gerado
        </h3>
        
        <div className="flex items-center gap-2">
           {onSave && (
            <button
              onClick={onSave}
              disabled={isSaving}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-1.5 border ${
                isSaved
                  ? "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:border-gray-600"
              }`}
            >
              {isSaving ? (
                 <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : isSaved ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Salvo</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  <span>Salvar</span>
                </>
              )}
            </button>
           )}

          <button
            onClick={() => handleCopy(getFullContentText(), 'full_content')}
            disabled={isFullCopied}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-1.5 border ${
              isFullCopied
                ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-800"
            }`}
            title="Copiar Post Completo"
          >
            {isFullCopied ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Copiado!</span>
              </>
            ) : (
               "Copiar Tudo"
            )}
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gray-50/50 dark:bg-gray-900/20">
        
        {/* SEÇÃO 1: CONTEÚDO PRINCIPAL (Card Unificado com Edição) */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-700/30 px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Conteúdo Principal</span>
                {isEditing && (
                  <span className="text-[10px] bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200 px-1.5 py-0.5 rounded border border-yellow-200 dark:border-yellow-800 font-medium">Editando</span>
                )}
             </div>
             
             <div className="flex items-center gap-2">
               {!isEditing ? (
                 <>
                   <button
                     onClick={startEditing}
                     className="text-xs px-2.5 py-1.5 rounded-lg transition-all hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-medium flex items-center gap-1.5"
                     title="Editar legenda"
                   >
                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                     </svg>
                     <span>Editar</span>
                   </button>
                   <CopyButton
                      text="Copiar Texto"
                      contentToCopy={`${content.title}\n\n${content.caption}`}
                      id="title_caption"
                      variant="default"
                    />
                  </>
               ) : (
                 <>
                   {/* Contador de Caracteres */}
                   <span className={`text-[10px] sm:text-xs font-mono font-medium mr-2 hidden sm:inline-block ${
                      editedCaption.length > 2200 ? 'text-red-500 font-bold' : 'text-gray-400 dark:text-gray-500'
                   }`}>
                      {editedCaption.length}/2200
                   </span>

                   <button
                     onClick={cancelEditing}
                     className="text-xs px-2.5 py-1.5 rounded-lg transition-all bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:border-gray-600 font-medium flex items-center gap-1.5"
                   >
                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                     </svg>
                     <span>Cancelar</span>
                   </button>
                   <button
                     onClick={saveEditing}
                     className="text-xs px-2.5 py-1.5 rounded-lg transition-all bg-green-600 hover:bg-green-700 text-white shadow-sm font-medium flex items-center gap-1.5"
                   >
                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                     </svg>
                     <span>Salvar</span>
                   </button>
                 </>
               )}
             </div>
          </div>
          
          <div className="p-5">
            {/* Título (sempre exibido) */}
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-4">{content.title}</h2>
            
            {/* Divisória decorativa */}
            <div className="w-12 h-1 bg-purple-500 rounded-full mb-4 opacity-50"></div>

            {/* Legenda (Modo Visualização ou Edição) */}
            {isEditing ? (
              <div className="relative">
                <textarea
                  value={editedCaption}
                  onChange={(e) => setEditedCaption(e.target.value)}
                  className={`w-full min-h-[200px] p-3 rounded-lg border bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm leading-relaxed focus:ring-2 focus:ring-purple-500 outline-none resize-y transition-colors ${
                    editedCaption.length > 2200 
                      ? 'border-red-300 dark:border-red-800 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-transparent'
                  }`}
                  placeholder="Edite sua legenda aqui..."
                  autoFocus
                />
                {/* Contador visível no mobile abaixo do textarea */}
                <div className="text-right mt-1 sm:hidden">
                  <span className={`text-[10px] font-mono font-medium ${
                      editedCaption.length > 2200 ? 'text-red-500 font-bold' : 'text-gray-400 dark:text-gray-500'
                   }`}>
                      {editedCaption.length}/2200
                   </span>
                </div>
              </div>
            ) : (
              <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {content.caption}
              </div>
            )}
          </div>
        </section>

        {/* SEÇÃO 2: HASHTAGS */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-blue-100 dark:border-blue-900/30 shadow-sm overflow-hidden">
           <div className="bg-blue-50/30 dark:bg-blue-900/10 px-4 py-3 border-b border-blue-50 dark:border-blue-900/20 flex justify-between items-center">
             <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1">
               <span className="text-lg">#</span> Hashtags
             </span>
             <CopyButton 
                text="Copiar Tags" 
                contentToCopy={content.hashtags.join(' ')}
                id="hashtags"
                variant="blue"
              />
          </div>
          <div className="p-4 bg-white dark:bg-gray-800">
            <div className="flex flex-wrap gap-2">
              {content.hashtags.map((tag, idx) => (
                <span key={idx} className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800 px-2.5 py-1 rounded-md text-xs font-medium transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/40 cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* SEÇÃO 3: VARIAÇÕES */}
        <section>
          <div className="flex items-center gap-3 mb-3 pl-1">
            <span className="h-px bg-gray-200 dark:bg-gray-700 flex-grow"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Outras Opções</span>
            <span className="h-px bg-gray-200 dark:bg-gray-700 flex-grow"></span>
          </div>
          
          <div className="grid gap-4">
            
            {/* NOVAS VARIAÇÕES DE TÍTULO */}
            {content.title_variations && content.title_variations.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-green-100 dark:border-green-900/30 shadow-sm transition-all hover:border-green-200 dark:hover:border-green-800">
                <div className="flex justify-between items-center mb-3">
                  <span className="flex items-center gap-2 text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wide">
                     <span className="w-2 h-2 rounded-full bg-green-400"></span> Ideias de Títulos
                  </span>
                </div>
                <div className="space-y-2">
                  {content.title_variations.map((title, idx) => (
                    <div key={idx} className="flex justify-between items-center group/item p-2 hover:bg-green-50 dark:hover:bg-green-900/10 rounded-lg transition-colors border border-transparent hover:border-green-100 dark:hover:border-green-800/30">
                      <span className="text-sm text-gray-700 dark:text-gray-300 leading-tight">{title}</span>
                      <CopyButton 
                        text="Copiar" 
                        contentToCopy={title}
                        id={`title_var_${idx}`}
                        variant="green"
                        className="opacity-0 group-hover/item:opacity-100 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Versão Curta */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 shadow-sm transition-all hover:border-amber-200 dark:hover:border-amber-800 relative group">
              <div className="flex justify-between items-center mb-3">
                <span className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span> Versão Curta
                </span>
                <CopyButton 
                  text="Copiar" 
                  contentToCopy={content.variations.short_version}
                  id="short_version"
                  variant="amber"
                />
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed border-l-2 border-amber-100 dark:border-amber-800/50 pl-3">
                {content.variations.short_version}
              </p>
            </div>

            {/* Versão Engraçada */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30 shadow-sm transition-all hover:border-purple-200 dark:hover:border-purple-800 relative group">
              <div className="flex justify-between items-center mb-3">
                <span className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wide">
                   <span className="w-2 h-2 rounded-full bg-purple-400"></span> Versão Engraçada
                </span>
                 <CopyButton 
                  text="Copiar" 
                  contentToCopy={content.variations.funny_version}
                  id="funny_version"
                  variant="purple"
                />
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed border-l-2 border-purple-100 dark:border-purple-800/50 pl-3">
                {content.variations.funny_version}
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default PostResult;