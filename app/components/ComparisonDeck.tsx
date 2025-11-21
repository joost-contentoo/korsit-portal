import React, { useRef, useState } from 'react';
import MarkdownPreview from './MarkdownPreview';
import { AlertCircle, Loader2, Copy, Download, Check } from 'lucide-react';
import { useContentStore } from '../store/useContentStore';
import { useUIStore } from '../store/useUIStore';
import { WITTY_MESSAGES } from '../config/constants';

export default function ComparisonDeck() {
    const { blogContent, localizedContent } = useContentStore();
    const { isLoading, error, wittyMessageIndex } = useUIStore();
    const wittyMessage = WITTY_MESSAGES[wittyMessageIndex];

    const sourceRef = useRef<HTMLDivElement>(null);
    const localizedRef = useRef<HTMLDivElement>(null);
    const isScrolling = useRef(false);

    const [copiedSource, setCopiedSource] = useState(false);
    const [copiedLocalized, setCopiedLocalized] = useState(false);

    const handleScroll = (source: 'source' | 'localized') => {
        if (typeof window !== 'undefined' && window.innerWidth < 1024) return;
        if (isScrolling.current) return;
        isScrolling.current = true;

        const sourceEl = sourceRef.current;
        const localizedEl = localizedRef.current;

        if (sourceEl && localizedEl) {
            if (source === 'source') {
                localizedEl.scrollTop = sourceEl.scrollTop;
            } else {
                sourceEl.scrollTop = localizedEl.scrollTop;
            }
        }

        setTimeout(() => {
            isScrolling.current = false;
        }, 50);
    };

    const copyToClipboard = async (text: string, type: 'source' | 'localized') => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            if (type === 'source') {
                setCopiedSource(true);
                setTimeout(() => setCopiedSource(false), 2000);
            } else {
                setCopiedLocalized(true);
                setTimeout(() => setCopiedLocalized(false), 2000);
            }
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const downloadMarkdown = (text: string, filename: string) => {
        if (!text) return;
        const blob = new Blob([text], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div id="comparison-deck" className="flex flex-col h-screen bg-transparent border-t border-gray-200/50 dark:border-gray-800/50">
            <div className="flex-1 flex flex-col border-b border-gray-200/50 dark:border-gray-800/50 overflow-hidden relative">
                <div className="sticky top-0 z-20 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl px-6 py-4 border-b border-gray-200/50 dark:border-gray-800/50 shrink-0 shadow-sm">
                    <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">Comparison Deck</h2>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 p-6">
                    {/* Source Pane */}
                    <div className="w-full lg:w-1/2 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Source (English)</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => copyToClipboard(blogContent, 'source')}
                                    className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                    title="Copy Markdown"
                                >
                                    {copiedSource ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                </button>
                            </div>
                        </div>
                        <div
                            ref={sourceRef}
                            onScroll={() => handleScroll('source')}
                            className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:border-primary/50 dark:hover:border-primary/50 transition-colors duration-200"
                        >
                            {blogContent ? (
                                <MarkdownPreview content={blogContent} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 italic text-sm">
                                    Source content will appear here...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Localized Pane */}
                    <div className="w-full lg:w-1/2 flex flex-col h-full relative">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Localized (German)</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => copyToClipboard(localizedContent, 'localized')}
                                    className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                    title="Copy Markdown"
                                >
                                    {copiedLocalized ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                </button>
                                <button
                                    onClick={() => downloadMarkdown(localizedContent, 'localized_post.md')}
                                    className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                    title="Download Markdown"
                                >
                                    <Download className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        <div
                            ref={localizedRef}
                            onScroll={() => handleScroll('localized')}
                            className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm relative hover:border-primary/50 dark:hover:border-primary/50 transition-colors duration-200"
                        >
                            {isLoading ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-950/80 z-10 backdrop-blur-sm rounded-md">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300 animate-pulse">{wittyMessage}</p>
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center justify-center h-full text-red-500 animate-in fade-in zoom-in duration-300">
                                    <AlertCircle className="w-12 h-12 mb-4 opacity-80" />
                                    <h3 className="text-lg font-semibold">Localization Failed</h3>
                                    <p className="text-sm opacity-80 mt-2 text-center max-w-md">{error}</p>
                                </div>
                            ) : localizedContent ? (
                                <MarkdownPreview content={localizedContent} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 italic text-sm">
                                    Localized output will appear here...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

