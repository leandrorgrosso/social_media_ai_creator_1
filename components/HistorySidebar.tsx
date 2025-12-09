import React from 'react';
import { SavedPost } from '../types';

interface HistorySidebarProps {
  posts: SavedPost[];
  isLoading: boolean;
  onSelectPost: (post: SavedPost) => void;
  onDeletePost: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  selectedPostId?: string | null;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  posts, 
  isLoading, 
  onSelectPost, 
  onDeletePost, 
  isOpen, 
  onClose,
  selectedPostId
}) => {
  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside 
        className={`fixed lg:sticky top-0 lg:top-24 left-0 h-[100vh] lg:h-[calc(100vh-8rem)] w-80 bg-white dark:bg-gray-800 shadow-2xl lg:shadow-none border-r border-gray-100 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden lg:border-none'
        } ${isOpen ? 'lg:w-80 lg:mr-6 lg:rounded-2xl lg:shadow-xl lg:border' : ''}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <span>📚</span> Histórico
            </h3>
            <button 
              onClick={onClose}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar p-3 space-y-3">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center p-8 text-gray-400 dark:text-gray-500 text-sm">
                <p>Nenhum post salvo ainda.</p>
                <p className="mt-1 text-xs">Gere e salve posts para vê-los aqui.</p>
              </div>
            ) : (
              posts.map((post) => (
                <div 
                  key={post.id} 
                  className={`group relative p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                    selectedPostId === post.id
                      ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
                      : 'bg-white dark:bg-gray-700/50 border-gray-100 dark:border-gray-600 hover:border-purple-200 dark:hover:border-purple-700'
                  }`}
                  onClick={() => onSelectPost(post)}
                >
                  <div className="pr-6">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm line-clamp-1 mb-1" title={post.content.title}>
                      {post.content.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {post.topic}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-2">
                      {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if(confirm('Tem certeza que deseja excluir este post?')) {
                        onDeletePost(post.id);
                      }
                    }}
                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    title="Excluir"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default HistorySidebar;