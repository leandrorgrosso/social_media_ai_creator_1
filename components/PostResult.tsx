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

  // Estado para Modal de Compartilhamento
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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

  const handleShare = async () => {
    const textToShare = getFullContentText();
    
    // Tenta usar a API nativa de compartilhamento (Mobile/Tablets)
    if (navigator.share) {
      try {
        await navigator.share({
          title: content.title,
          text: textToShare,
          // url: window.location.href // Opcional: incluir link da ferramenta
        });
        return;
      } catch (err) {
        console.log('Usuário cancelou ou erro no compartilhamento nativo', err);
      }
    }
    
    // Fallback para Modal Customizado (Desktop)
    setIsShareModalOpen(true);
  };

  // Funções de compartilhamento para redes específicas (Desktop)
  const shareToSocial = (network: string) => {
    const text = encodeURIComponent(getFullContentText());
    const title = encodeURIComponent(content.title);
    let url = '';

    switch (network) {
      case 'whatsapp':
        url = `https://wa.me/?text=${text}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${text}`;
        break;
      case 'linkedin':
        // LinkedIn foca mais em URLs, então passamos o texto como summary ou título se possível, 
        // mas a URL share padrão é limitada. Vamos tentar o básico.
        url = `https://www.linkedin.com/feed/?shareActive=true&text=${text}`;
        break;
      case 'email':
        url = `mailto:?subject=${title}&body=${text}`;
        break;
      case 'instagram':
      case 'tiktok':
        // Essas redes não têm API web de texto. Copiamos e avisamos.
        handleCopy(getFullContentText(), 'share_modal_copy');
        alert(`Conteúdo copiado! Agora abra o ${network === 'instagram' ? 'Instagram' : 'TikTok'} e cole seu post.`);
        return;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
      setIsShareModalOpen(false);
    }
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
    <>
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl w-full border border-gray-100 dark:border-gray-700 h-full flex flex-col transition-colors overflow-hidden relative">
        
        {/* --- Global Toolbar --- */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-20 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <span>📝</span> <span className="hidden sm:inline">Post Gerado</span>
          </h3>
          
          <div className="flex items-center gap-2">
             {/* Share Button */}
             <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:border-gray-600"
              title="Compartilhar"
             >
               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
               </svg>
               <span className="hidden sm:inline">Compartilhar</span>
             </button>

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

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           {/* Backdrop */}
           <div 
             className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
             onClick={() => setIsShareModalOpen(false)}
           />
           
           {/* Modal Content */}
           <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-gray-700">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Compartilhar Post</h3>
                <button 
                  onClick={() => setIsShareModalOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
             </div>

             <div className="grid grid-cols-2 gap-4">
               {/* WhatsApp */}
               <button
                 onClick={() => shareToSocial('whatsapp')}
                 className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors border border-gray-100 dark:border-gray-700 group"
               >
                 <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                   </svg>
                 </div>
                 <span className="text-xs font-semibold">WhatsApp</span>
               </button>

               {/* Twitter / X */}
               <button
                 onClick={() => shareToSocial('twitter')}
                 className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors border border-gray-100 dark:border-gray-700 group"
               >
                 <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-black dark:text-white group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                 </div>
                 <span className="text-xs font-semibold">X / Twitter</span>
               </button>

               {/* Instagram (Copy) */}
               <button
                 onClick={() => shareToSocial('instagram')}
                 className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/20 text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors border border-gray-100 dark:border-gray-700 group"
               >
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                     <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.451 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                   </svg>
                 </div>
                 <span className="text-xs font-semibold">Instagram</span>
               </button>

               {/* TikTok (Copy) */}
               <button
                 onClick={() => shareToSocial('tiktok')}
                 className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors border border-gray-100 dark:border-gray-700 group"
               >
                 <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                    </svg>
                 </div>
                 <span className="text-xs font-semibold">TikTok</span>
               </button>

               {/* LinkedIn */}
               <button
                 onClick={() => shareToSocial('linkedin')}
                 className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors border border-gray-100 dark:border-gray-700 group"
               >
                 <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                 </div>
                 <span className="text-xs font-semibold">LinkedIn</span>
               </button>

                {/* Email */}
               <button
                 onClick={() => shareToSocial('email')}
                 className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-100 dark:border-gray-700 group"
               >
                 <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-transform">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                   </svg>
                 </div>
                 <span className="text-xs font-semibold">Email</span>
               </button>
             </div>
             
             <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
               <button
                 onClick={() => handleCopy(getFullContentText(), 'modal_full_copy')}
                 className="w-full py-2.5 rounded-lg bg-gray-900 hover:bg-black text-white dark:bg-purple-600 dark:hover:bg-purple-700 font-medium transition-colors flex items-center justify-center gap-2"
               >
                 {copiedId === 'modal_full_copy' ? (
                   <>
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                     <span>Copiado!</span>
                   </>
                 ) : (
                   <>
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                     <span>Copiar Todo o Conteúdo</span>
                   </>
                 )}
               </button>
             </div>
           </div>
        </div>
      )}
    </>
  );
};

export default PostResult;