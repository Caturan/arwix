'use client'; 

import { Article } from '@/lib/api';
import { ExternalLink, FileText, Cpu, Newspaper, Zap, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { SparkModal } from './SparkModal';

const SourceIcon = ({ source }: { source: Article['source'] }) => {
  switch (source) {
    case 'devto': return <Newspaper className="w-4 h-4 text-blue-500" />;
    case 'arxiv': return <FileText className="w-4 h-4 text-red-500" />;
    case 'huggingface': return <Cpu className="w-4 h-4 text-yellow-500" />;
    case 'blog': return <BookOpen className="w-4 h-4 text-purple-500" />;
    default: return <ExternalLink className="w-4 h-4" />;
  }
};

const SourceLabel = ({ source }: { source: string }) => {
  if (source === 'devto') return <span>Dev.to</span>;
  if (source === 'huggingface') return <span>Hugging Face</span>;
  if (source === 'arxiv') return <span>Arxiv</span>;
  if (source === 'blog') return <span>Official Blog</span>;
  return <span>{source}</span>;
};

export function ArticleCard({ article }: { article: Article }) {
  const [isSparkModalOpen, setIsSparkModalOpen] = useState(false);

  const handleSparkAI = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSparkModalOpen(true);
  };

  return (
    <>
      <div className="group block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 h-full flex flex-col relative">
        {/* Main Link wrapper */}
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col flex-grow"
        >
          {article.imageUrl && (
            <div className="h-48 overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                {article.source}
              </div>
            </div>
          )}
          
          <div className="p-5 flex flex-col flex-grow">
            <div className="flex items-center justify-between mb-3 text-xs text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-2 capitalize font-medium">
                <SourceIcon source={article.source} />
                <SourceLabel source={article.source} />
              </div>
              <span>{new Date(article.publishedAt).toISOString().split('T')[0]}</span>
            </div>

            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {article.title}
            </h3>

            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 flex-grow relative">
               <p className="line-clamp-3">{article.summary}</p>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex flex-wrap gap-1">
                {article.tags?.slice(0, 2).map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400">
                    #{tag}
                  </span>
                ))}
              </div>
              
              {/* Summarize with LLM Button */}
              <button
                onClick={handleSparkAI}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold transition-all relative z-20"
                title="Get AI analysis"
              >
                <Zap className="w-3 h-3 fill-current" />
                <span>Summarize with LLM</span>
              </button>
            </div>
          </div>
        </a>
      </div>

      <SparkModal 
        isOpen={isSparkModalOpen}
        onClose={() => setIsSparkModalOpen(false)}
        article={article}
      />
    </>
  );
}
