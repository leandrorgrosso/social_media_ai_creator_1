import React, { useState, useEffect } from 'react';
import { GeneratedPostContent } from '../types';

interface PostResultProps {
  content: GeneratedPostContent;
  onSave?: () => Promise<void> | void;
  onContentUpdate?: (newContent: GeneratedPostContent) => void;
  isSaved?: boolean;
  isSaving?: boolean;
}

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

const PostResult: React.FC<PostResultProps> = ({ content, onSave, onContentUpdate, isSaved, isSaving }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCaption, setEditedCaption] = useState(content.caption);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    setEditedCaption(content.caption);
    setIsEditing(false);
  }, [content]);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

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

  const handleSaveClick = async () => {
    if (!onSave) return;
    try {
      await onSave();
      setToast({ show: true, message: 'Post salvo com sucesso!', type: 'success' });
    } catch (error) {
      setToast({ show: true, message: 'Erro ao salvar o post.', type: 'error' });
    }
  };

  const handleShare = async () => {
    const textToShare = getFullContentText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: content.title,
          text: textToShare,
        });
        return;
      } catch (err) {
        console.log('Usuário cancelou ou erro no compartilhamento nativo', err);
      }
    }
    setIsShareModalOpen(true);
  };

  const shareToSocial = (network: string) => {
    const text = encodeURIComponent(getFullContentText());
    const title = encodeURIComponent(content.title);
    let url = '';

    switch (network) {
      case 'whatsapp': url = `https://wa.me/?text=${text}`; break;
      case 'twitter': url = `https://twitter.com/intent/tweet?text=${text}`; break;
      case 'linkedin': url = `https://www.linkedin.com/feed/?shareActive=true&text=${text}`; break;
      case 'email': url = `mailto:?subject=${title}&body=${text}`; break;
      case 'instagram':
      case 'tiktok':
        handleCopy(getFullContentText(), 'share_modal_copy');
        alert(`Conteúdo copiado! Agora abra o ${network === 'instagram' ? 'Instagram' : 'TikTok'} e cole seu post.`);
        return;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
      setIsShareModalOpen(false);
    }
  };

  // Componente de Botão estilo Shadcn (Ghost/Outline/Primary)
  const Button = ({ 
    children, onClick, disabled, variant = 'outline', size = 'sm', className = '', title = '' 
  }: any) => {
    const baseClass = "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      default: "bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 shadow",
      outline: "border border-gray-200 bg-white shadow-sm hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50",
      ghost: "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80"
    };
    
    const sizes = {
      sm: "h-8 px-3 text-xs",
      default: "h-9 px-4 py-2 text-sm",
      icon: "h-8 w-8"
    };

    return (
      <button 
        onClick={onClick} 
        disabled={disabled} 
        className={`${baseClass} ${(variants as any)[variant]} ${(sizes as any)[size]} ${className}`}
        title={title}
      >
        {children}
      </button>
    );
  };

  const CopyButton = ({ text, contentToCopy, id, className = "" }: any) => {
    const isCopied = copiedId === id;
    return (
      <Button
        onClick={(e: any) => {
          e.stopPropagation();
          handleCopy(contentToCopy, id);
        }}
        disabled={isCopied}
        variant="ghost"
        size="sm"
        className={`gap-1.5 ${isCopied ? 'text-green-600 dark:text-green-400' : 'text-gray-500'} ${className}`}
      >
        {isCopied ? (
          <>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            <span className="sr-only">Copiado</span>
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            <span className="hidden sm:inline">{text}</span>
          </>
        )}
      </Button>
    );
  };

  return (
    <>
       {toast.show && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2 fade-in duration-300 border text-sm font-medium ${
          toast.type === 'success' 
            ? 'bg-white text-gray-900 border-gray-200 dark:bg-gray-950 dark:text-gray-50 dark:border-gray-800' 
            : 'bg-red-50 text-red-900 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-900'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 shadow-sm rounded-xl w-full border border-gray-200 dark:border-gray-800 h-full flex flex-col overflow-hidden">
        
        {/* --- Toolbar --- */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
            Post Gerado
          </h3>
          
          <div className="flex items-center gap-2">
             <Button onClick={handleShare} size="sm" variant="outline" className="hidden sm:flex gap-2">
               Compartilhar
             </Button>
             <Button onClick={handleShare} size="icon" variant="ghost" className="sm:hidden">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
             </Button>

             {onSave && (
              <Button
                onClick={handleSaveClick}
                disabled={isSaving}
                variant={isSaved ? "secondary" : "default"}
                size="sm"
                className="gap-2"
              >
                {isSaving ? (
                   <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : isSaved ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    <span className="hidden sm:inline">Salvo</span>
                  </>
                ) : (
                  <>Salvar</>
                )}
              </Button>
             )}

            <Button
              onClick={() => handleCopy(getFullContentText(), 'full_content')}
              disabled={copiedId === 'full_content'}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {copiedId === 'full_content' ? "Copiado" : "Copiar Tudo"}
            </Button>
          </div>
        </div>

        {/* --- Content --- */}
        <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar bg-white dark:bg-gray-950">
          
          {/* 1. HEADLINE (O Gancho Principal) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Headline</label>
              <CopyButton text="Copiar" contentToCopy={content.title} id="main_title" />
            </div>
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50 leading-tight">
                {content.title}
              </h1>
            </div>
          </div>

          {/* 2. HOOKS VARIATIONS (Alternativas de Título - Movido para cima) */}
          {content.title_variations && content.title_variations.length > 0 && (
            <div className="space-y-2">
               <div className="flex items-center gap-2">
                  <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Hooks Alternativos</label>
               </div>
               <div className="grid gap-2">
                  {content.title_variations.map((title, idx) => (
                    <div key={idx} className="group flex justify-between items-center p-3 rounded-md border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{title}</span>
                      <CopyButton text="" contentToCopy={title} id={`title_var_${idx}`} className="opacity-0 group-hover:opacity-100" />
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* 3. CAPTION (Legenda) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
               <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Legenda</label>
               <div className="flex items-center gap-1">
                 {!isEditing ? (
                   <>
                     <Button onClick={startEditing} variant="ghost" size="sm" className="h-6 text-xs text-gray-500">Editar</Button>
                     <CopyButton text="Copiar" contentToCopy={content.caption} id="caption_only" />
                    </>
                 ) : (
                   <div className="flex gap-2">
                     <Button onClick={cancelEditing} variant="ghost" size="sm" className="h-7 text-xs">Cancelar</Button>
                     <Button onClick={saveEditing} size="sm" className="h-7 text-xs">Salvar</Button>
                   </div>
                 )}
               </div>
            </div>
            
            {isEditing ? (
              <div className="relative">
                <textarea
                  value={editedCaption}
                  onChange={(e) => setEditedCaption(e.target.value)}
                  className="w-full min-h-[300px] p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent text-sm leading-relaxed focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-300 outline-none resize-y"
                  autoFocus
                />
                 <div className="absolute bottom-2 right-2 text-[10px] text-gray-400">
                    {editedCaption.length} chars
                 </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/30 text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {content.caption}
              </div>
            )}
          </div>

          {/* 4. HASHTAGS */}
          <div className="space-y-2">
             <div className="flex items-center justify-between">
               <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Hashtags</label>
               <CopyButton text="Copiar" contentToCopy={content.hashtags.join(' ')} id="hashtags" />
             </div>
            <div className="flex flex-wrap gap-2">
              {content.hashtags.map((tag, idx) => (
                <span key={idx} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-100 dark:border-gray-800" />

          {/* 5. EXTRA VARIATIONS (Short & Funny) - Movido para o fim */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1">⚡ Versão Curta</label>
                <CopyButton text="Copiar" contentToCopy={content.variations.short_version} id="short_version" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 p-3 rounded-md bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 italic">
                {content.variations.short_version}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1">🤪 Versão Divertida</label>
                <CopyButton text="Copiar" contentToCopy={content.variations.funny_version} id="funny_version" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 p-3 rounded-md bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 italic">
                {content.variations.funny_version}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Share Modal (Simplificado visualmente) */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div 
             className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
             onClick={() => setIsShareModalOpen(false)}
           />
           <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-sm w-full p-6 border border-gray-200 dark:border-gray-800">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-50">Compartilhar</h3>
                <button onClick={() => setIsShareModalOpen(false)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
             </div>
             <div className="grid grid-cols-2 gap-3">
               {[
                 { id: 'whatsapp', label: 'WhatsApp', icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' },
                 { id: 'twitter', label: 'X / Twitter', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                 { id: 'instagram', label: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                 { id: 'tiktok', label: 'TikTok', icon: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z' },
                 { id: 'linkedin', label: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
                 { id: 'email', label: 'Email', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', isStroke: true }
               ].map((net) => (
                 <button
                   key={net.id}
                   onClick={() => shareToSocial(net.id)}
                   className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-100 dark:border-gray-800 text-left"
                 >
                   <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-gray-100">
                     <svg className="w-4 h-4" fill={net.isStroke ? "none" : "currentColor"} stroke={net.isStroke ? "currentColor" : "none"} strokeWidth={net.isStroke ? "2" : "0"} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d={net.icon} />
                     </svg>
                   </div>
                   <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{net.label}</span>
                 </button>
               ))}
             </div>
             <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button onClick={() => handleCopy(getFullContentText(), 'modal_full_copy')} className="w-full">
                  {copiedId === 'modal_full_copy' ? 'Conteúdo Copiado!' : 'Copiar Tudo'}
                </Button>
             </div>
           </div>
        </div>
      )}
    </>
  );
};

export default PostResult;