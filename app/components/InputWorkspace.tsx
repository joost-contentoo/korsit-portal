import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useContentStore } from '../store/useContentStore';
import { useUIStore } from '../store/useUIStore';
import { WITTY_MESSAGES } from '../config/constants';

export default function InputWorkspace() {
  const {
    blogContent,
    setBlogContent,
    seoContext,
    setSeoContext,
    additionalInstructions,
    setAdditionalInstructions,
    styleGuide,
    glossary,
    setLocalizedContent,
  } = useContentStore();

  const {
    isLoading,
    setIsLoading,
    setError,
    wittyMessageIndex,
  } = useUIStore();

  const wittyMessage = WITTY_MESSAGES[wittyMessageIndex];

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
          additional_instructions: additionalInstructions,
          style_guide: styleGuide,
          glossary: glossary,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to localize content.');
      }

      setLocalizedContent(data.localized_content);

      // Auto-scroll to Comparison Deck on success
      setTimeout(() => {
        const section = document.getElementById('comparison-deck');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="input-workspace" className="flex flex-col h-screen bg-transparent border-r border-gray-200/50 dark:border-gray-800/50">
      <div className="flex-1 flex flex-col border-b border-gray-200/50 dark:border-gray-800/50 overflow-hidden relative">
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl px-6 py-4 border-b border-gray-200/50 dark:border-gray-800/50 shrink-0 shadow-sm">
          <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">Input Workspace</h2>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 p-6">
          {/* Left Column - Original Markdown */}
          <div className="flex flex-col h-full">
            <label
              htmlFor="original-markdown"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2"
            >
              Original Markdown
            </label>
            <textarea
              id="original-markdown"
              value={blogContent}
              onChange={(e) => setBlogContent(e.target.value)}
              placeholder="# Paste your English Markdown here..."
              className="flex-1 w-full resize-none bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-5 font-mono text-sm shadow-sm hover:border-primary/50 dark:hover:border-primary/50 focus:shadow-[0_0_20px_rgba(0,166,157,0.1)] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 ease-in-out"
              spellCheck={false}
            />
          </div>

          {/* Right Column - Context & Instructions */}
          <div className="flex flex-col h-full gap-6">
            {/* SEO Context - Top 50% */}
            <div className="h-1/2 flex flex-col">
              <label
                htmlFor="seo-context"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2"
              >
                SEO Context
              </label>
              <textarea
                id="seo-context"
                value={seoContext}
                onChange={(e) => setSeoContext(e.target.value)}
                placeholder={"Keywords: xbox, gaming...\nTone: Professional but friendly..."}
                className="flex-1 w-full resize-none bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-5 font-mono text-sm shadow-sm hover:border-primary/50 dark:hover:border-primary/50 focus:shadow-[0_0_20px_rgba(0,166,157,0.1)] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 ease-in-out"
                spellCheck={false}
              />
            </div>

            {/* Additional Instructions & Button - Bottom 50% */}
            <div className="h-1/2 flex flex-col gap-4">
              <div className="flex-1 flex flex-col min-h-0">
                <label
                  htmlFor="additional-instructions"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2"
                >
                  Additional Instructions
                </label>
                <textarea
                  id="additional-instructions"
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  placeholder="Any specific instructions for this localization run..."
                  className="flex-1 w-full resize-none bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-5 font-mono text-sm shadow-sm hover:border-primary/50 dark:hover:border-primary/50 focus:shadow-[0_0_20px_rgba(0,166,157,0.1)] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 ease-in-out"
                  spellCheck={false}
                />
              </div>

              <button
                onClick={handleLocalize}
                disabled={isLoading || !blogContent.trim()}
                className={`
                  flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium text-lg shadow-lg transition-all shrink-0
                  ${isLoading || !blogContent.trim()
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                    : 'bg-primary hover:bg-[#008c84] text-white hover:shadow-xl active:transform active:scale-[0.98]'}
                `}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{wittyMessage}</span>
                  </>
                ) : (
                  <>
                    <span>Localize to German</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

