import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff, Save, Loader2, Check } from 'lucide-react';
import MarkdownPreview from './MarkdownPreview';

interface ReferenceDrawerProps {
    styleGuide: string;
    setStyleGuide: (value: string) => void;
    glossary: string;
    setGlossary: (value: string) => void;
}

export default function ReferenceDrawer({
    styleGuide,
    setStyleGuide,
    glossary,
    setGlossary,
}: ReferenceDrawerProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showStyleGuidePreview, setShowStyleGuidePreview] = useState(false);
    const [showGlossaryPreview, setShowGlossaryPreview] = useState(false);
    const [isSavingStyleGuide, setIsSavingStyleGuide] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Load Style Guide on mount
    useEffect(() => {
        const fetchStyleGuide = async () => {
            try {
                const response = await fetch('/api/style-guide');
                if (response.ok) {
                    const data = await response.json();
                    setStyleGuide(data.content);
                }
            } catch (error) {
                console.error('Failed to load style guide:', error);
            }
        };
        fetchStyleGuide();
    }, [setStyleGuide]);

    const handleSaveStyleGuide = async () => {
        setIsSavingStyleGuide(true);
        setSaveSuccess(false);
        try {
            const response = await fetch('/api/style-guide', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: styleGuide }),
            });

            if (response.ok) {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 2000);
            }
        } catch (error) {
            console.error('Failed to save style guide:', error);
        } finally {
            setIsSavingStyleGuide(false);
        }
    };

    return (
        <div id="reference-drawer" className={`flex flex-col bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-all duration-300 ${isCollapsed ? 'h-16' : 'h-96'}`}>
            <div
                className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    Reference Drawer
                    <span className="text-xs font-normal text-gray-500 uppercase tracking-wider ml-2">(Style Guide & Glossary)</span>
                </h2>
                {isCollapsed ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </div>

            {!isCollapsed && (
                <div className="flex-1 flex p-6 gap-6 overflow-hidden">
                    {/* Style Guide */}
                    <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Style Guide
                            </label>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleSaveStyleGuide}
                                    disabled={isSavingStyleGuide}
                                    className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 transition-colors"
                                    title="Save changes to local style-guide.md"
                                >
                                    {isSavingStyleGuide ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : saveSuccess ? (
                                        <Check className="w-3 h-3" />
                                    ) : (
                                        <Save className="w-3 h-3" />
                                    )}
                                    {saveSuccess ? 'Saved!' : 'Save to File'}
                                </button>
                                <button
                                    onClick={() => setShowStyleGuidePreview(!showStyleGuidePreview)}
                                    className="text-gray-500 hover:text-blue-600 transition-colors"
                                    title={showStyleGuidePreview ? "Edit" : "Preview"}
                                >
                                    {showStyleGuidePreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {showStyleGuidePreview ? (
                            <div className="flex-1 w-full overflow-y-auto bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md p-4 custom-scrollbar">
                                <MarkdownPreview content={styleGuide || '*No style guide defined.*'} />
                            </div>
                        ) : (
                            <textarea
                                value={styleGuide}
                                onChange={(e) => setStyleGuide(e.target.value)}
                                placeholder="# Markdown Style Guide..."
                                className="flex-1 w-full resize-none bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md p-4 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                spellCheck={false}
                            />
                        )}
                    </div>

                    {/* Glossary */}
                    <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Glossary
                            </label>
                            <button
                                onClick={() => setShowGlossaryPreview(!showGlossaryPreview)}
                                className="text-gray-500 hover:text-blue-600 transition-colors"
                                title={showGlossaryPreview ? "Edit" : "Preview"}
                            >
                                {showGlossaryPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        {showGlossaryPreview ? (
                            <div className="flex-1 w-full overflow-y-auto bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md p-4 custom-scrollbar">
                                <MarkdownPreview content={glossary || '*No glossary terms defined.*'} />
                            </div>
                        ) : (
                            <textarea
                                value={glossary}
                                onChange={(e) => setGlossary(e.target.value)}
                                placeholder="Term: Definition..."
                                className="flex-1 w-full resize-none bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md p-4 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                spellCheck={false}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
