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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
        <div id="reference-drawer" className="flex flex-col h-screen bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
            <div className="flex-1 flex flex-col p-6 border-b border-gray-200 dark:border-gray-800 overflow-hidden">
                <h2 className="text-lg font-semibold mb-4 shrink-0 flex items-center gap-2">
                    Reference Drawer
                    <span className="text-xs font-normal text-gray-500 uppercase tracking-wider ml-2">(Style Guide & Glossary)</span>
                </h2>

                <div className="flex-1 flex gap-6 min-h-0">
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
                                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                                    title={showStyleGuidePreview ? "Edit" : "Preview"}
                                    aria-label={showStyleGuidePreview ? "Edit style guide" : "Preview style guide"}
                                >
                                    {showStyleGuidePreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {showStyleGuidePreview ? (
                            <div className="flex-1 w-full overflow-y-auto bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md p-4 custom-scrollbar">
                                <MarkdownPreview content={styleGuide || '*No style guide defined.*'} />
                            </div>
                        ) : (
                            <textarea
                                value={styleGuide}
                                onChange={(e) => setStyleGuide(e.target.value)}
                                placeholder="# Markdown Style Guide..."
                                className="flex-1 w-full resize-none bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md p-4 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                                    title={showGlossaryPreview ? "Edit" : "Preview"}
                                    aria-label={showGlossaryPreview ? "Edit glossary" : "Preview glossary"}
                                >
                                    {showGlossaryPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {showGlossaryPreview ? (
                            <div className="flex-1 w-full overflow-y-auto bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md p-4 custom-scrollbar">
                                <MarkdownPreview content={glossary || '*No glossary terms defined.*'} />
                            </div>
                        ) : (
                            <textarea
                                value={glossary}
                                onChange={(e) => setGlossary(e.target.value)}
                                placeholder="Term: Definition..."
                                className="flex-1 w-full resize-none bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md p-4 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                spellCheck={false}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
