'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import MarkdownPreview from './components/MarkdownPreview';

const WITTY_MESSAGES = [
  "Teaching AI grammar...",
  "Optimizing keywords...",
  "Drinking virtual coffee...",
  "Consulting the dictionary...",
  "Polishing the umlauts...",
  "Asking a German native...",
  "Translating idioms...",
  "Checking tone of voice...",
];

export default function Home() {
  const [blogContent, setBlogContent] = useState('');
  const [seoContext, setSeoContext] = useState('');
  const [localizedContent, setLocalizedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % WITTY_MESSAGES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleLocalize = async () => {
    if (!blogContent.trim()) {
      setError('Please enter some blog content to localize.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLocalizedContent('');

    try {
      const response = await fetch('/api/localize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blog_content: blogContent,
          seo_context: seoContext,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to localize content.');
      }

      setLocalizedContent(data.localized_content);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex h-screen flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden font-sans">
      {/* Header */}
      <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
          <h1 className="text-xl font-semibold tracking-tight">Localizer</h1>
        </div>

        <button
          onClick={handleLocalize}
          disabled={isLoading || !blogContent.trim()}
          className={`
            flex items-center gap-2 px-5 py-2 rounded-md font-medium transition-all
            ${isLoading || !blogContent.trim()
              ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md active:transform active:scale-95'}
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{WITTY_MESSAGES[loadingMessageIndex]}</span>
            </>
          ) : (
            <>
              <span>Localize to German</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </header>

      {/* Main Content - Split Screen */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Pane: Input Zone */}
        <div className="w-[40%] flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">

          {/* Top Section: Blog Content (70%) */}
          <div className="h-[70%] flex flex-col p-4 border-b border-gray-200 dark:border-gray-800">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              English Blog Content (Markdown)
            </label>
            <textarea
              value={blogContent}
              onChange={(e) => setBlogContent(e.target.value)}
              placeholder="# Paste your English Markdown here..."
              className="flex-1 w-full resize-none bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md p-4 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              spellCheck={false}
            />
          </div>

          {/* Bottom Section: SEO Context (30%) */}
          <div className="h-[30%] flex flex-col p-4 bg-gray-50/50 dark:bg-gray-900/50">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              SEO Context & Instructions
            </label>
            <textarea
              value={seoContext}
              onChange={(e) => setSeoContext(e.target.value)}
              placeholder="Keywords: xbox, gaming...&#10;Tone: Professional but friendly..."
              className="flex-1 w-full resize-none bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md p-4 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Right Pane: Preview Zone */}
        <div className="w-[60%] flex flex-col bg-gray-50 dark:bg-gray-900 relative">
          <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-transparent z-10 pointer-events-none" />

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {error ? (
              <div className="flex flex-col items-center justify-center h-full text-red-500 animate-in fade-in zoom-in duration-300">
                <AlertCircle className="w-12 h-12 mb-4 opacity-80" />
                <h3 className="text-lg font-semibold">Localization Failed</h3>
                <p className="text-sm opacity-80 mt-2 text-center max-w-md">{error}</p>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto bg-white dark:bg-gray-950 shadow-sm border border-gray-200 dark:border-gray-800 min-h-[800px] p-12 rounded-lg">
                <MarkdownPreview content={localizedContent} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
