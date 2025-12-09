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

  // Sincronizar estado de edição quando o conteúdo muda
  useEffect(() => {
    setEditedCaption(content.caption);
    setIsEditing(false);
  }, [content]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
    return `${content.title}\n\n${content.caption}\n\nHashtags:\n${content.hashtags.join(' ')}\n\n---\nOutras Opções:\n\nCurta: ${content.variations.short_version}\n\nEngraçada: ${content.variations.funny_version}`;
  };

  // Componente de botão reutilizável
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
    variant?: "default" | "ghost" | "blue" | "amber" | "purple" | "green" | "gradient",
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
          colorClass = "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800";
          break;
        case "purple":
          colorClass = "bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800";
          break;
        case "green":
          colorClass = "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800";
          break;
        case "gradient":
           colorClass = "bg-white/80 hover:bg-white text-indigo-700 border-white/50 shadow-sm backdrop-blur-sm dark:bg-gray-800/80 dark:hover:bg-gray-800 dark:text-indigo-300 dark:border-gray-600";
           break;
        default:
          colorClass = "bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
      }
    }

    return (
      <button
        onClick={(e) => {
          e.stopPropagation(); // Evita triggers indesejados se estiver dentro de um card clicável
          handleCopy(contentToCopy, id);
        }}
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
        <span className="hidden sm:inline">{isCopied ? "Copiado!" : text}</span>
        <span className="sm:hidden">{isCopied ? "OK" : text}</span>
      </button>
    );
  };

  const isFullCopied = copiedId === 'full_content';

  // Section Header Component
  const SectionHeader = ({ icon, title, color = "gray", action }: { icon: string, title: string, color?: string, action?: React.ReactNode }) => (
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-2">
        <span className={`text-lg p-1.5 rounded-lg ${
            color === 'purple' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300' :
            color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' :
            color === 'green' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300' :
            color === 'amber' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300' :
            'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
          }`}>
          {icon}
        </span>
        <h4 className="font-bold text-gray-800 dark:text-white text-sm uppercase tracking-wide">{title}</h4>
      </div>
      {action}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl w-full border border-gray-100 dark:border-gray-700 h-full flex flex-col transition-colors overflow-hidden relative">
      
      {/* --- Global Toolbar --- */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-20 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span>📝</span> <span className="hidden sm:inline">Post Gerado</span>
        </h3>
        
        <div className="flex items-center gap-2">
           {onSave && (
            <button
              onClick={onSave}
              disabled={isSaving}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-1.5 border ${
                isSaved
                  ? "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800 cursor-default"
                  : "bg-gray-900 hover:bg-black text-white border-transparent dark:bg-purple-600 dark:hover:bg-purple-500"
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
                  <span>Salvo!</span>
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
                : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:border-gray-600"
            }`}
          >
            {isFullCopied ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Copiado</span>
              </>
            ) : (
               "Copiar Tudo"
            )}
          </button>
        </div>
      </div>

      {/* --- Scrollable Content Area --- */}
      <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar bg-gray-50/50 dark:bg-gray-900/30">
        
        {/* --- SECTION 1: TITLE (HEADLINE) --- */}
        <section className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 border border-purple-100 dark:border-gray-700 rounded-xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200/20 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
          
          <SectionHeader 
            icon="📢" 
            title="Headline Principal" 
            color="purple" 
            action={
              <CopyButton 
                text="Copiar Título" 
                contentToCopy={content.title}
                id="main_title"
                variant="gradient"
              />
            }
          />
          
          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              {content.title}
            </h2>
          </div>
        </section>

        {/* --- SECTION 2: CAPTION (EDITABLE) --- */}
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/20">
             <div className="flex items-center gap-2">
                <span className="text-lg">📄</span>
                <h4 className="font-bold text-gray-700 dark:text-gray-200 text-sm uppercase">Legenda</h4>
                {isEditing && (
                  <span className="text-[10px] bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200 px-2 py-0.5 rounded-full font-medium animate-pulse">
                    Editando...
                  </span>
                )}
             </div>
             
             <div className="flex items-center gap-2">
               {!isEditing ? (
                 <>
                   <button
                     onClick={startEditing}
                     className="text-xs px-2.5 py-1.5 rounded-lg transition-all hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-medium flex items-center gap-1.5"
                   >
                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                     </svg>
                     <span>Editar</span>
                   </button>
                   <CopyButton
                      text="Copiar Texto"
                      contentToCopy={content.caption}
                      id="caption_only"
                      variant="default"
                    />
                  </>
               ) : (
                 <>
                   <button
                     onClick={cancelEditing}
                     className="text-xs px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                   >
                     Cancelar
                   </button>
                   <button
                     onClick={saveEditing}
                     className="text-xs px-3 py-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-bold shadow-md hover:opacity-90 transition-opacity flex items-center gap-1"
                   >
                     <span>Salvar</span>
                   </button>
                 </>
               )}
             </div>
          </div>
          
          <div className="p-0">
            {isEditing ? (
              <div className="relative group">
                <textarea
                  value={editedCaption}
                  onChange={(e) => setEditedCaption(e.target.value)}
                  className={`w-full min-h-[300px] p-5 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm leading-relaxed outline-none resize-y transition-colors ${
                    editedCaption.length > 2200 ? 'text-red-600 dark:text-red-400' : ''
                  }`}
                  placeholder="Escreva sua legenda aqui..."
                  autoFocus
                />
                 <div className="absolute bottom-2 right-2 text-[10px] font-mono bg-white/80 dark:bg-gray-800/80 backdrop-blur px-2 py-1 rounded text-gray-400 border border-gray-100 dark:border-gray-700">
                    {editedCaption.length}/2200 chars
                 </div>
              </div>
            ) : (
              <div className="p-5 text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
                {content.caption}
              </div>
            )}
          </div>
        </section>

        {/* --- SECTION 3: HASHTAGS --- */}
        <section className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-5 shadow-sm">
           <SectionHeader 
            icon="#" 
            title="Hashtags Otimizadas" 
            color="blue"
            action={
              <CopyButton 
                text="Copiar Tags" 
                contentToCopy={content.hashtags.join(' ')}
                id="hashtags"
                variant="blue"
              />
            } 
          />
          <div className="flex flex-wrap gap-2">
            {content.hashtags.map((tag, idx) => (
              <span key={idx} className="bg-white dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:shadow-sm cursor-default select-all">
                {tag}
              </span>
            ))}
          </div>
        </section>

        <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>

        {/* --- SECTION 4: VARIATIONS HEADER --- */}
        <div className="flex items-center gap-2 mb-2">
           <span className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">Opções Alternativas</span>
           <span className="h-px bg-gray-200 dark:bg-gray-700 flex-grow"></span>
        </div>

        {/* --- SECTION 5: HOOKS (TITLE VARIATIONS) --- */}
        {content.title_variations && content.title_variations.length > 0 && (
          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm">
             <SectionHeader icon="🪝" title="Hooks (Ganchos)" color="green" />
             <div className="grid gap-2">
                {content.title_variations.map((title, idx) => (
                  <div key={idx} className="group flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-transparent hover:border-green-200 dark:hover:border-green-800 transition-all">
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{title}</span>
                    <CopyButton 
                      text="Copiar" 
                      contentToCopy={title}
                      id={`title_var_${idx}`}
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))}
             </div>
          </section>
        )}

        {/* --- SECTION 6: GRID VARIATIONS (SHORT & FUNNY) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Versão Curta */}
          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm flex flex-col">
            <SectionHeader 
              icon="⚡" 
              title="Versão Curta" 
              color="amber"
              action={
                 <CopyButton 
                  text="Copiar" 
                  contentToCopy={content.variations.short_version}
                  id="short_version"
                  variant="amber"
                />
              }
            />
            <div className="flex-grow bg-amber-50/50 dark:bg-amber-900/10 rounded-lg p-4 border border-amber-100/50 dark:border-amber-900/20">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                "{content.variations.short_version}"
              </p>
            </div>
          </section>

          {/* Versão Engraçada */}
          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm flex flex-col">
            <SectionHeader 
              icon="🤪" 
              title="Versão Divertida" 
              color="purple"
              action={
                 <CopyButton 
                  text="Copiar" 
                  contentToCopy={content.variations.funny_version}
                  id="funny_version"
                  variant="purple"
                />
              }
            />
             <div className="flex-grow bg-purple-50/50 dark:bg-purple-900/10 rounded-lg p-4 border border-purple-100/50 dark:border-purple-900/20">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                "{content.variations.funny_version}"
              </p>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

export default PostResult;