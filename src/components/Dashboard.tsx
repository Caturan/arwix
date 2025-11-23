'use client';

import { Article } from '@/lib/api';
import { ArticleCard } from '@/components/ArticleCard';
import { Sparkles, Search, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function Dashboard({ initialArticles }: { initialArticles: Article[] }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'devto' | 'arxiv' | 'huggingface' | 'blog'>('all');

  // Client-side filtering
  const filteredArticles = useMemo(() => {
    return initialArticles.filter(article => {
      // 1. Text Search (Title or Summary)
      const matchesSearch = 
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.summary.toLowerCase().includes(search.toLowerCase());
      
      // 2. Source Filter
      const matchesFilter = filter === 'all' || article.source === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter, initialArticles]);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-[var(--background)] text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-[var(--background)]/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-sm">
              {/* Replace with your generated logo: put 'logo.png' in the public folder */}
              <img 
                src="/logo.png" 
                alt="AI Pulse Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image not found yet
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.classList.add('bg-blue-600');
                  e.currentTarget.parentElement!.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles m-auto mt-1.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 3v4"/><path d="M3 5h4"/><path d="M3 9h4"/></svg>';
                }}
              />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">AI Pulse</h1>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 relative">
             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
               <Search size={16} />
             </div>
             <input 
               type="text"
               placeholder="Search AI papers, news..." 
               className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
          </div>

          <nav className="hidden md:flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'all' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('arxiv')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'arxiv' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
            >
              Papers
            </button>
            <button 
              onClick={() => setFilter('huggingface')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'huggingface' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
            >
              Models
            </button>
            <button 
              onClick={() => setFilter('blog')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'blog' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
            >
              Blogs
            </button>
            <button 
              onClick={() => setFilter('devto')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'devto' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
            >
              Community
            </button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 tracking-tight">Discover the Latest in AI</h2>
            <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 text-sm">
              <span className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                 <span className="relative flex h-2 w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                 </span>
                 Live Feed
              </span>
              <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
              <span className="hidden sm:inline">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <span>{filteredArticles.length} Updates</span>
            </div>
          </div>
          
          {/* Mobile Filter Dropdown (visible only on small screens) */}
          <div className="md:hidden">
            <select 
              className="bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg px-4 py-2 text-sm font-medium outline-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="all">All Sources</option>
              <option value="arxiv">Papers (Arxiv)</option>
              <option value="huggingface">Models (HF)</option>
              <option value="blog">Official Blogs</option>
              <option value="devto">Community (Dev.to)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-zinc-100 dark:bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="text-zinc-400" />
            </div>
            <h3 className="text-lg font-medium">No articles found</h3>
            <p className="text-zinc-500">Try adjusting your search or filter.</p>
          </div>
        )}
      </div>
    </main>
  );
}
