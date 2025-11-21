import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Save, Loader2, Check } from 'lucide-react';
import MarkdownPreview from './MarkdownPreview';
import { useContentStore } from '../store/useContentStore';

export default function ReferenceDrawer() {
    const { styleGuide, setStyleGuide, glossary, setGlossary } = useContentStore();

    const [showStyleGuidePreview, setShowStyleGuidePreview] = useState(false);
    const [showGlossaryPreview, setShowGlossaryPreview] = useState(false);
    const [isSavingStyleGuide, setIsSavingStyleGuide] = useState(false);
    const [styleGuideSaveSuccess, setStyleGuideSaveSuccess] = useState(false);
    const [isSavingGlossary, setIsSavingGlossary] = useState(false);
    const [glossarySaveSuccess, setGlossarySaveSuccess] = useState(false);

    // Load Style Guide and Glossary on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [styleGuideRes, glossaryRes] = await Promise.all([
                    fetch('/api/style-guide'),
                    fetch('/api/glossary')
                ]);

                if (styleGuideRes.ok) {
                    const data = await styleGuideRes.json();
                    setStyleGuide(data.content);
                }

                if (glossaryRes.ok) {
                    const data = await glossaryRes.json();
                    setGlossary(data.content);
                }
            } catch (error) {
                console.error('Failed to load reference data:', error);
            }
        };
        fetchData();
    }, [setStyleGuide, setGlossary]);

    const handleSaveStyleGuide = async () => {
        setIsSavingStyleGuide(true);
        setStyleGuideSaveSuccess(false);
        try {
            const response = await fetch('/api/style-guide', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: styleGuide }),
            });

            if (response.ok) {
                setStyleGuideSaveSuccess(true);
                setTimeout(() => setStyleGuideSaveSuccess(false), 2000);
            }
        } catch (error) {
            console.error('Failed to save style guide:', error);
        } finally {
            setIsSavingStyleGuide(false);
        }
    };

    const handleSaveGlossary = async () => {
        setIsSavingGlossary(true);
        setGlossarySaveSuccess(false);
        try {
            const response = await fetch('/api/glossary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: glossary }),
            });

            if (response.ok) {
                setGlossarySaveSuccess(true);
                setTimeout(() => setGlossarySaveSuccess(false), 2000);
            }
        } catch (error) {
            console.error('Failed to save glossary:', error);
        } finally {
            setIsSavingGlossary(false);
        }
    };

    const SaveButton = ({ onClick, isSaving, isSuccess, label }: { onClick: () => void, isSaving: boolean, isSuccess: boolean, label: string }) => (
        <button
            onClick={onClick}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-[#008c84] text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            title={`Save ${label} to file`}
        >
            {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isSuccess ? (
                <Check className="w-3.5 h-3.5" />
            ) : (
                <Save className="w-3.5 h-3.5" />
            )}
            {isSuccess ? 'Saved!' : 'Save to File'}
        </button>
    );

    return (
        <div id="reference-drawer" className="flex flex-col h-screen bg-transparent border-t border-gray-200/50 dark:border-gray-800/50">
            <div className="flex-1 flex flex-col border-b border-gray-200/50 dark:border-gray-800/50 overflow-hidden relative">
                <div className="sticky top-0 z-20 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl px-6 py-4 border-b border-gray-200/50 dark:border-gray-800/50 shrink-0 shadow-sm">
                    <h2 className="text-lg font-semibold flex items-center gap-2 tracking-tight text-gray-900 dark:text-gray-100">
                        Reference Drawer
                        <span className="text-xs font-normal text-gray-500 uppercase tracking-wider ml-2">(Style Guide & Glossary)</span>
                    </h2>
                </div>

                <div className="flex-1 flex gap-6 min-h-0 p-6">
                    {/* Style Guide */}
                    <div className="flex-1 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Style Guide
                            </label>
                            <div className="flex items-center gap-2">
                                <SaveButton
                                    onClick={handleSaveStyleGuide}
                                    isSaving={isSavingStyleGuide}
                                    isSuccess={styleGuideSaveSuccess}
                                    label="style guide"
                                />
                                <button
                                    onClick={() => setShowStyleGuidePreview(!showStyleGuidePreview)}
                                    className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 rounded-md transition-colors"
                                    title={showStyleGuidePreview ? "Edit" : "Preview"}
                                    aria-label={showStyleGuidePreview ? "Edit style guide" : "Preview style guide"}
                                >
                                    {showStyleGuidePreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {showStyleGuidePreview ? (
                            <div className="flex-1 w-full overflow-y-auto bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-5 custom-scrollbar shadow-sm hover:border-primary/50 dark:hover:border-primary/50 transition-colors duration-200">
                                <MarkdownPreview content={styleGuide || '*No style guide defined.*'} />
                            </div>
                        ) : (
                            <textarea
                                value={styleGuide}
                                onChange={(e) => setStyleGuide(e.target.value)}
                                placeholder="# Markdown Style Guide..."
                                className="flex-1 w-full resize-none bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-5 font-mono text-sm shadow-sm hover:border-primary/50 dark:hover:border-primary/50 focus:shadow-[0_0_20px_rgba(0,166,157,0.1)] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 ease-in-out"
                                spellCheck={false}
                            />
                        )}
                    </div>

                    {/* Glossary */}
                    <div className="flex-1 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Glossary
                            </label>
                            <div className="flex items-center gap-2">
                                <SaveButton
                                    onClick={handleSaveGlossary}
                                    isSaving={isSavingGlossary}
                                    isSuccess={glossarySaveSuccess}
                                    label="glossary"
                                />
                                <button
                                    onClick={() => setShowGlossaryPreview(!showGlossaryPreview)}
                                    className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 rounded-md transition-colors"
                                    title={showGlossaryPreview ? "Edit" : "Preview"}
                                    aria-label={showGlossaryPreview ? "Edit glossary" : "Preview glossary"}
                                >
                                    {showGlossaryPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {showGlossaryPreview ? (
                            <div className="flex-1 w-full overflow-y-auto bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-5 custom-scrollbar shadow-sm hover:border-primary/50 dark:hover:border-primary/50 transition-colors duration-200">
                                <MarkdownPreview content={glossary || '*No glossary terms defined.*'} />
                            </div>
                        ) : (
                            <textarea
                                value={glossary}
                                onChange={(e) => setGlossary(e.target.value)}
                                placeholder="Term: Definition..."
                                className="flex-1 w-full resize-none bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-5 font-mono text-sm shadow-sm hover:border-primary/50 dark:hover:border-primary/50 focus:shadow-[0_0_20px_rgba(0,166,157,0.1)] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200 ease-in-out"
                                spellCheck={false}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
