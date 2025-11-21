'use client';

import React, { useEffect, useRef } from 'react';
import InputWorkspace from './components/InputWorkspace';
import ComparisonDeck from './components/ComparisonDeck';
import ReferenceDrawer from './components/ReferenceDrawer';
import AnchorRail from './components/AnchorRail';
import { useUIStore } from './store/useUIStore';

export default function Home() {
  const { isLoading, setActiveSection, rotateWittyMessage } = useUIStore();
  const mainContainerRef = useRef<HTMLDivElement>(null);

  // Witty Message Rotator
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        rotateWittyMessage();
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading, rotateWittyMessage]);

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
  }, [setActiveSection]);

  return (
    <main className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden font-sans">

      {/* Anchor Rail */}
      <AnchorRail />

      {/* Main Scrollable Content */}
      <div ref={mainContainerRef} className="flex-1 flex flex-col overflow-y-auto scroll-smooth snap-y snap-mandatory">

        {/* InputWorkspace */}
        <div className="snap-start min-h-screen relative">
          <InputWorkspace />
        </div>

        {/* Comparison Deck */}
        <div className="snap-start min-h-screen">
          <ComparisonDeck />
        </div>

        {/* Reference Drawer */}
        <div className="snap-start min-h-screen">
          <ReferenceDrawer />
        </div>

      </div>
    </main>
  );
}

