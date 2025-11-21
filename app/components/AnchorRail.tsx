import React, { useEffect, useState } from 'react';
import { PenTool, Columns, Book } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

export default function AnchorRail() {
    const { activeSection } = useUIStore();
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const container = document.getElementById('main-scroll-container');
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            // Calculate progress based on the Input and Compare sections only
            // We assume Reference is the last section. 
            // To make the line fill up as we scroll through Input and Compare, we can map the scroll 
            // to the height of those two sections. 
            // However, a simpler visual is to just let it fill based on global scroll but capped at the Compare section.

            if (scrollHeight === clientHeight) {
                setScrollProgress(1);
                return;
            }
            const progress = scrollTop / (scrollHeight - clientHeight);
            setScrollProgress(Math.min(Math.max(progress, 0), 1));
        };

        // Initial calculation
        handleScroll();

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavigate = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const flowItems = [
        { id: 'input-workspace', icon: PenTool, label: 'Input' },
        { id: 'comparison-deck', icon: Columns, label: 'Compare' },
    ];

    const referenceItem = { id: 'reference-drawer', icon: Book, label: 'Reference' };

    return (
        <div className="w-20 flex flex-col items-center py-8 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 z-50 h-screen sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            {/* Logo */}
            <div className="mb-10 relative group cursor-default">
                <div className="w-12 h-12 bg-primary rounded-md flex flex-col items-center justify-center text-white shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-105 relative">
                    <span className="absolute top-0.5 left-1 text-[10px] font-medium opacity-90">1</span>
                    <span className="font-bold text-xl mt-1 tracking-tight">Lo</span>
                </div>
            </div>

            {/* Main Flow Container (Input & Compare) */}
            <div className="flex flex-col items-center w-full relative">

                {/* Vertical Progress Line Track */}
                {/* We want the line to connect the center of the first item to the center of the last item in this group. */}
                {/* Since items are stacked with gap-10, we can position the line absolutely. */}
                {/* Top of line should be at center of first item (approx top-5 relative to container if item is h-10) */}
                {/* But we have a gap. Let's just put the line behind them. */}

                <div className="absolute left-1/2 -translate-x-1/2 top-5 bottom-5 w-0.5 bg-gray-100 dark:bg-gray-800 rounded-full" />

                {/* Vertical Progress Line Fill */}
                {/* We want this to fill based on scroll. */}
                {/* If we are at Input (top), it's empty or small. If we are at Compare, it's full. */}
                <div
                    className="absolute left-1/2 -translate-x-1/2 top-5 w-0.5 bg-primary rounded-full transition-all duration-150 ease-out"
                    style={{
                        height: `calc(${Math.min(scrollProgress * 2, 1) * 100}% - 2.5rem)`, // Accelerate fill so it completes by the time we reach Compare
                        maxHeight: 'calc(100% - 2.5rem)'
                    }}
                />

                <div className="flex flex-col gap-10 w-full items-center z-10">
                    {flowItems.map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavigate(item.id)}
                                className="group relative flex items-center justify-center outline-none"
                                aria-label={item.label}
                            >
                                {/* Active State Pulse/Glow */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md animate-pulse" />
                                )}

                                {/* Icon Container */}
                                <div className={`
                                    relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 border
                                    ${isActive
                                        ? 'bg-white dark:bg-gray-900 border-primary text-primary shadow-lg shadow-primary/20 scale-110'
                                        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'}
                                `}>
                                    <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`} />
                                </div>

                                {/* Sliding Label */}
                                <div className="absolute left-full ml-4 pl-1 pointer-events-none">
                                    <div className={`
                                        flex items-center px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold rounded-lg shadow-xl
                                        transform transition-all duration-300 ease-out origin-left
                                        ${isActive || 'group-hover:opacity-100 group-hover:translate-x-0'}
                                        ${isActive ? 'opacity-0 translate-x-2' : 'opacity-0 -translate-x-2'}
                                        group-hover:opacity-100 group-hover:translate-x-0
                                    `}>
                                        {item.label}
                                        {/* Tiny arrow pointing left */}
                                        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-white rotate-45" />
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Actions (Reference) */}
            <div className="mt-auto pb-6 flex flex-col items-center gap-4">
                {/* Divider */}
                <div className="w-8 h-px bg-gray-200 dark:bg-gray-800" />

                {/* Reference Button */}
                <button
                    onClick={() => handleNavigate(referenceItem.id)}
                    className="group relative flex items-center justify-center outline-none"
                    aria-label={referenceItem.label}
                >
                    {/* Active State Pulse/Glow */}
                    {activeSection === referenceItem.id && (
                        <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md animate-pulse" />
                    )}

                    <div className={`
                        relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 border
                        ${activeSection === referenceItem.id
                            ? 'bg-white dark:bg-gray-900 border-primary text-primary shadow-lg shadow-primary/20 scale-110'
                            : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'}
                    `}>
                        <referenceItem.icon className={`w-5 h-5 transition-transform duration-300 ${activeSection === referenceItem.id ? '' : 'group-hover:scale-110'}`} />
                    </div>

                    {/* Sliding Label */}
                    <div className="absolute left-full ml-4 pl-1 pointer-events-none">
                        <div className={`
                            flex items-center px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold rounded-lg shadow-xl
                            transform transition-all duration-300 ease-out origin-left
                            ${activeSection === referenceItem.id || 'group-hover:opacity-100 group-hover:translate-x-0'}
                            ${activeSection === referenceItem.id ? 'opacity-0 translate-x-2' : 'opacity-0 -translate-x-2'}
                            group-hover:opacity-100 group-hover:translate-x-0
                        `}>
                            {referenceItem.label}
                            {/* Tiny arrow pointing left */}
                            <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-white rotate-45" />
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}
