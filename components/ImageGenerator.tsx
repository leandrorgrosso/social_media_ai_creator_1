import React, { useState, useEffect } from 'react';
import { AspectRatio, ImageSize } from '../types';
import { generatePostImage } from '../services/geminiService';

interface ImageGeneratorProps {
  initialPrompt: string;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ initialPrompt }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [size, setSize] = useState<ImageSize>(ImageSize.SIZE_1K);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPrompt(initialPrompt);
  }, [initialPrompt]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = await generatePostImage(prompt, aspectRatio, size);
      setImageUrl(url);
    } catch (err: any) {
      let msg = "Falha ao gerar imagem. Por favor, tente novamente.";
      if (err.message && (err.message.includes("403") || err.message.includes("PERMISSION_DENIED"))) {
        msg = "Permissão negada (403). Sua chave de API pode não ter acesso à geração de imagens ou ao modelo selecionado.";
      } else if (err.message) {
        msg = err.message;
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
    <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 w-full border border-gray-100 h-full flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>🎨</span> Estúdio de IA
      </h3>

      <div className="space-y-4 flex-grow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prompt Visual</label>
          <textarea
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none text-sm resize-none h-24"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Descreva a imagem..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proporção</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none bg-white text-sm"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
            >
              <option value={AspectRatio.SQUARE}>1:1 (Quadrado)</option>
              <option value={AspectRatio.PORTRAIT_3_4}>3:4 (Retrato)</option>
              <option value={AspectRatio.PORTRAIT_9_16}>9:16 (Story/Reel)</option>
              <option value={AspectRatio.LANDSCAPE_4_3}>4:3 (Paisagem)</option>
              <option value={AspectRatio.LANDSCAPE_16_9}>16:9 (Cinematográfico)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resolução</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none bg-white text-sm"
              value={size}
              onChange={(e) => setSize(e.target.value as ImageSize)}
            >
              <option value={ImageSize.SIZE_1K}>1K (Padrão)</option>
              <option value={ImageSize.SIZE_2K}>2K (Pro - Alta Res)</option>
              <option value={ImageSize.SIZE_4K}>4K (Pro - Ultra HD)</option>
            </select>
            <p className="text-[10px] text-gray-500 mt-1">2K e 4K podem exigir chaves de API pagas.</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-all ${
            loading ? 'bg-gray-400' : 'bg-gray-800 hover:bg-black'
          }`}
        >
          {loading ? 'Renderizando...' : 'Gerar Visual'}
        </button>

        {imageUrl && (
          <div className="mt-6 border-t pt-4 animate-in fade-in duration-500">
             <div className="relative group rounded-xl overflow-hidden shadow-md border border-gray-200">
                <img src={imageUrl} alt="Generated" className="w-full h-auto object-contain bg-gray-50 max-h-[400px]" />
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