import React, { useRef, useEffect, useState } from 'react';
import MarkdownPreview from './MarkdownPreview';
import { AlertCircle, Loader2, Copy, Download, Check } from 'lucide-react';

interface ComparisonDeckProps {
    blogContent: string;
    localizedContent: string;
    isLoading: boolean;
    error: string | null;
    wittyMessage: string;
}

export default function ComparisonDeck({
    blogContent,
    localizedContent,
    isLoading,
    error,
    wittyMessage,
}: ComparisonDeckProps) {
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
        <div id="comparison-deck" className="flex flex-col h-auto lg:h-screen min-h-screen bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Comparison Deck</h2>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden">
                {/* Source Pane */}
                <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 flex flex-col min-h-[50vh] lg:min-h-0">
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Source (English)</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => copyToClipboard(blogContent, 'source')}
                                className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                title="Copy Markdown"
                            >
                                {copiedSource ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div
                        ref={sourceRef}
                        onScroll={() => handleScroll('source')}
                        className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white dark:bg-gray-950"
                    >
                        {blogContent ? (
                            <MarkdownPreview content={blogContent} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 italic">
                                Source content will appear here...
                            </div>
                        )}
                    </div>
                </div>

                {/* Localized Pane */}
                <div className="w-full lg:w-1/2 flex flex-col relative min-h-[50vh] lg:min-h-0">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800 flex justify-between items-center">
                        <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Localized (German)</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => copyToClipboard(localizedContent, 'localized')}
                                className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/30 rounded transition-colors"
                                title="Copy Markdown"
                            >
                                {copiedLocalized ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={() => downloadMarkdown(localizedContent, 'localized_post.md')}
                                className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/30 rounded transition-colors"
                                title="Download Markdown"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div
                        ref={localizedRef}
                        onScroll={() => handleScroll('localized')}
                        className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white dark:bg-gray-950 relative"
                    >
                        {isLoading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-950/80 z-10 backdrop-blur-sm">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
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
                            <div className="flex items-center justify-center h-full text-gray-400 italic">
                                Localized output will appear here...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

