'use client';

import { useEffect, useState, useMemo } from 'react';
import { X, Copy, Check, MessageSquare, Zap, Bot, Globe } from 'lucide-react';
import { Article } from '@/lib/api';

interface SparkModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article;
}

export function SparkModal({ isOpen, onClose, article }: SparkModalProps) {
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState<'en' | 'tr'>('en');

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const prompt = useMemo(() => {
    if (language === 'tr') {
      return `Kıdemli bir Yapay Zeka Araştırmacısı olarak hareket et. Aşağıdaki makaleyi/yazıyı derinlemesine analiz et.
      
Yanıtını kesinlikle aşağıdaki formatta ve TÜRKÇE olarak ver:

### 📋 Yönetici Özeti
(Tüm makalenin 2-3 cümlelik net, üst düzey özeti.)

### 🎯 Temel Sorun
(Bu araştırma hangi spesifik boşluğu, verimsizliği veya kısıtlamayı ele alıyor?)

### 💡 Temel Yenilik
(Metodolojinin, mimarinin veya yaklaşımın teknik detayları. Kesin ve net ol.)

### 🚀 Pratik Çıkarımlar
(Bu neden önemli? Gerçek dünyadaki kullanım durumları veya etkisi nedir?)

---
Başlık: ${article.title}
Kaynak: ${article.source}
Özet: ${article.summary}
Bağlantı: ${article.url}
`;
    }

    return `Act as a Senior AI Researcher. Analyze the following article/paper deeply.

Structure your response exactly as follows:

### 📋 Executive Summary
(Provide a clear, high-level summary of the entire article in 2-3 sentences.)

### 🎯 Core Problem
(What specific gap, inefficiency, or limitation is this research addressing?)

### 💡 Key Innovation
(Technical details of the methodology, architecture, or approach. Be precise.)

### 🚀 Practical Implications
(Why does this matter? What are the real-world use cases or impact?)

---
Title: ${article.title}
Source: ${article.source}
Abstract/Summary: ${article.summary}
Link: ${article.url}
`;
  }, [article, language]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openLLM = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl ring-1 ring-zinc-200 dark:ring-zinc-800 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="w-full text-center">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 text-amber-500 fill-current" />
              Summarize with AI
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Copy the optimized prompt below and paste it into your favorite AI tool.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-2 space-y-6">
          
          {/* Prompt Box */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-blue-600 rounded-lg opacity-20 group-hover:opacity-40 transition-opacity blur"></div>
            <div className="relative bg-zinc-50 dark:bg-[#051024] rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
               {/* Controls Bar inside the box */}
               <div className="flex items-center justify-between mb-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                 <div className="flex items-center gap-1 bg-zinc-100 dark:bg-[#0A1A35] p-1 rounded-lg">
                   <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${language === 'en' ? 'bg-white dark:bg-[#152642] text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
                   >
                    English
                   </button>
                   <button
                    onClick={() => setLanguage('tr')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${language === 'tr' ? 'bg-white dark:bg-[#152642] text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
                   >
                    Türkçe
                   </button>
                 </div>

                 <button 
                   onClick={handleCopy}
                   className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#152642] hover:bg-zinc-100 dark:hover:bg-[#1E3050] border border-zinc-200 dark:border-zinc-700 rounded-md text-xs font-medium shadow-sm transition-all"
                 >
                   {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-zinc-500" />}
                   <span className={copied ? "text-green-600" : "text-zinc-700 dark:text-zinc-300"}>
                     {copied ? "Copied!" : "Copy Prompt"}
                   </span>
                 </button>
               </div>

               <pre className="whitespace-pre-wrap text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-mono h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
                 {prompt}
               </pre>
            </div>
          </div>

          {/* LLM Selection */}
          <div className="space-y-3 pb-6">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Open AI Tool</h3>
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => openLLM('https://chat.openai.com/')}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all group/item"
              >
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                  <MessageSquare size={18} />
                </div>
                <span className="text-xs font-medium">ChatGPT</span>
              </button>

              <button 
                onClick={() => openLLM('https://gemini.google.com/app')}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all group/item"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                  <Zap size={18} />
                </div>
                <span className="text-xs font-medium">Gemini</span>
              </button>

              <button 
                onClick={() => openLLM('https://claude.ai/')}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all group/item"
              >
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                  <Bot size={18} />
                </div>
                <span className="text-xs font-medium">Claude</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
