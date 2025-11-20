'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import InputWorkspace from './components/InputWorkspace';
import ComparisonDeck from './components/ComparisonDeck';
import ReferenceDrawer from './components/ReferenceDrawer';
import AnchorRail from './components/AnchorRail';

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
  // State
  const [blogContent, setBlogContent] = useState('');
  const [seoContext, setSeoContext] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [localizedContent, setLocalizedContent] = useState('');
  const [styleGuide, setStyleGuide] = useState('');
  const [glossary, setGlossary] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('input-workspace');

  // Refs for scrolling
  const mainContainerRef = useRef<HTMLDivElement>(null);

  // Witty Message Rotator
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % WITTY_MESSAGES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Intersection Observer for Active Section
  useEffect(() => {
    const container = mainContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: container,
        threshold: 0.5, // Trigger when 50% of the section is visible
      }
    );

    const sections = document.querySelectorAll('#input-workspace, #comparison-deck, #reference-drawer');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleNavigate = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          // Future: style_guide: styleGuide,
          // Future: glossary: glossary,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to localize content.');
      }

      setLocalizedContent(data.localized_content);

      // Auto-scroll to Comparison Deck on success
      setTimeout(() => {
        handleNavigate('comparison-deck');
      }, 100);

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden font-sans">

      {/* Anchor Rail */}
      <AnchorRail activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main Scrollable Content */}
      <div ref={mainContainerRef} className="flex-1 flex flex-col overflow-y-auto scroll-smooth snap-y snap-mandatory">

        {/* Input Workspace */}
        <div className="snap-start min-h-screen relative">
          <InputWorkspace
            blogContent={blogContent}
            setBlogContent={setBlogContent}
            seoContext={seoContext}
            setSeoContext={setSeoContext}
            additionalInstructions={additionalInstructions}
            setAdditionalInstructions={setAdditionalInstructions}
          />

          {/* Floating Action Button for Localize */}
          <div className="absolute bottom-8 right-8 z-10">
            <button
              onClick={handleLocalize}
              disabled={isLoading || !blogContent.trim()}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-full font-medium text-lg shadow-lg transition-all
                ${isLoading || !blogContent.trim()
                  ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl active:transform active:scale-95'}
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{WITTY_MESSAGES[loadingMessageIndex]}</span>
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

        {/* Comparison Deck */}
        <div className="snap-start min-h-screen">
          <ComparisonDeck
            blogContent={blogContent}
            localizedContent={localizedContent}
            isLoading={isLoading}
            error={error}
            wittyMessage={WITTY_MESSAGES[loadingMessageIndex]}
          />
        </div>

        {/* Reference Drawer */}
        <div className="snap-start">
          <ReferenceDrawer
            styleGuide={styleGuide}
            setStyleGuide={setStyleGuide}
            glossary={glossary}
            setGlossary={setGlossary}
          />
        </div>

        {/* Spacer for bottom scrolling */}
        <div className="h-24"></div>

      </div>
    </main>
  );
}
