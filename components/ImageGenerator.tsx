import React, { useState, useEffect } from 'react';
import { AspectRatio, ImageSize } from '../types';
import { generatePostImage, enhanceImagePrompt } from '../services/geminiService';

interface ImageGeneratorProps {
  initialPrompt: string;
  aspectRatio: AspectRatio;
  size: ImageSize;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  onSizeChange: (size: ImageSize) => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ 
  initialPrompt, 
  aspectRatio, 
  size, 
  onAspectRatioChange, 
  onSizeChange 
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPrompt(initialPrompt);
  }, [initialPrompt]);

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    
    setIsEnhancing(true);
    setError(null);
    try {
      const enhanced = await enhanceImagePrompt(prompt);
      setPrompt(enhanced);
    } catch (err) {
      console.error("Falha ao melhorar prompt", err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = await generatePostImage(prompt, aspectRatio, size);
      setImageUrl(url);
    } catch (err: any) {
      let msg = "Falha ao gerar imagem. Por favor, tente novamente.";
      
      const errorMessage = err.message || "";
      
      if (errorMessage.includes("403") || errorMessage.includes("PERMISSION_DENIED")) {
        msg = "Permissão negada (403). Sua chave de API pode não ter acesso à geração de imagens ou ao modelo selecionado.";
      } else if (errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
        msg = "Muitos pedidos simultâneos (429). O sistema está aguardando liberação da API. Tente novamente em alguns segundos.";
      } else if (errorMessage) {
        msg = errorMessage;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'post-gerado.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 md:p-8 w-full border border-gray-100 dark:border-gray-700 h-full flex flex-col transition-colors">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <span>🎨</span> Estúdio de IA
      </h3>

      <div className="space-y-4 flex-grow">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prompt Visual</label>
            <button
              onClick={handleEnhancePrompt}
              disabled={isEnhancing || loading || !prompt.trim()}
              className={`text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all ${
                isEnhancing 
                  ? "bg-purple-100 text-purple-700 border-purple-200 cursor-wait dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
                  : "bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 text-purple-700 border-purple-100 hover:border-purple-200 dark:from-purple-900/20 dark:to-indigo-900/20 dark:text-purple-300 dark:border-purple-800 dark:hover:border-purple-700 shadow-sm"
              }`}
              title="A IA irá adicionar estilo, iluminação e detalhes ao seu prompt"
            >
              {isEnhancing ? (
                <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span className="text-sm">✨</span>
              )}
              <span className="font-semibold">Sugestões Detalhadas</span>
            </button>
          </div>
          
          <div className="relative">
            <textarea
              className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none text-sm resize-none h-32 placeholder-gray-400 dark:placeholder-gray-500 transition-colors ${
                error ? 'border-red-300 dark:border-red-800' : 'border-gray-300 dark:border-gray-600'
              }`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Descreva a imagem..."
              disabled={loading || isEnhancing}
            />
            {isEnhancing && (
               <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-[1px] rounded-lg flex items-center justify-center">
                 <span className="text-sm font-medium text-purple-700 dark:text-purple-300 animate-pulse bg-white dark:bg-gray-900 px-3 py-1 rounded-full shadow-sm">
                   ✨ Criando magia visual...
                 </span>
               </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Proporção</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors"
              value={aspectRatio}
              onChange={(e) => onAspectRatioChange(e.target.value as AspectRatio)}
              disabled={loading}
            >
              <option value={AspectRatio.SQUARE}>1:1 (Quadrado)</option>
              <option value={AspectRatio.PORTRAIT_3_4}>3:4 (Retrato)</option>
              <option value={AspectRatio.PORTRAIT_9_16}>9:16 (Story/Reel)</option>
              <option value={AspectRatio.LANDSCAPE_4_3}>4:3 (Paisagem)</option>
              <option value={AspectRatio.LANDSCAPE_16_9}>16:9 (Cinematográfico)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resolução</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors"
              value={size}
              onChange={(e) => onSizeChange(e.target.value as ImageSize)}
              disabled={loading}
            >
              <option value={ImageSize.SIZE_1K}>1K (Padrão)</option>
              <option value={ImageSize.SIZE_2K}>2K (Pro - Alta Res)</option>
              <option value={ImageSize.SIZE_4K}>4K (Pro - Ultra HD)</option>
            </select>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">2K e 4K podem exigir chaves de API pagas.</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm border border-red-100 dark:border-red-800">
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || isEnhancing || !prompt.trim()}
          className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-all ${
            loading || isEnhancing ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' : 'bg-gray-800 hover:bg-black dark:bg-purple-600 dark:hover:bg-purple-700'
          }`}
        >
          {loading ? 'Renderizando...' : 'Gerar Visual'}
        </button>

        {imageUrl && (
          <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-4 animate-in fade-in duration-500">
             <div className="relative group rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-600">
                <img src={imageUrl} alt="Generated" className="w-full h-auto object-contain bg-gray-50 dark:bg-gray-900 max-h-[400px]" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                        onClick={downloadImage}
                        className="bg-white text-black px-4 py-2 rounded-full font-bold transform hover:scale-105 transition-transform"
                    >
                        Baixar Imagem
                    </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;