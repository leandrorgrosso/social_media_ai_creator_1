import React from 'react';
import { GeneratedPostContent } from '../types';

interface PostResultProps {
  content: GeneratedPostContent;
}

const PostResult: React.FC<PostResultProps> = ({ content }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 w-full border border-gray-100 h-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">📝 Post Gerado</h3>
        <button
          onClick={() => copyToClipboard(`${content.title}\n\n${content.caption}\n\n${content.hashtags.join(' ')}`)}
          className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full transition-colors"
        >
          Copiar Tudo
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Título</label>
          <p className="text-lg font-bold text-gray-900 mt-1">{content.title}</p>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Legenda</label>
          <div className="bg-gray-50 p-4 rounded-lg mt-1 border border-gray-100 whitespace-pre-wrap text-gray-700">
            {content.caption}
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Hashtags</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {content.hashtags.map((tag, idx) => (
              <span key={idx} className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Variações</label>
          <div className="grid gap-4 mt-2">
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
              <span className="block text-xs font-bold text-yellow-700 mb-1">Versão Curta</span>
              <p className="text-sm text-gray-800">{content.variations.short_version}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
              <span className="block text-xs font-bold text-purple-700 mb-1">Versão Engraçada</span>
              <p className="text-sm text-gray-800">{content.variations.funny_version}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostResult;