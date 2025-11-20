import React from 'react';
import { PenTool, Columns, Book, Settings } from 'lucide-react';

interface AnchorRailProps {
    activeSection: string;
    onNavigate: (sectionId: string) => void;
}

export default function AnchorRail({ activeSection, onNavigate }: AnchorRailProps) {
    const navItems = [
        { id: 'input-workspace', icon: PenTool, label: 'Input' },
        { id: 'comparison-deck', icon: Columns, label: 'Compare' },
        { id: 'reference-drawer', icon: Book, label: 'Reference' },
    ];

    return (
        <div className="w-16 flex flex-col items-center py-6 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 z-20 h-screen sticky top-0">
            <div className="mb-8">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">L</div>
            </div>

            <div className="flex-1 flex flex-col gap-4 w-full px-2">
                {navItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`
                group relative flex items-center justify-center w-full aspect-square rounded-md transition-all
                ${isActive
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300'}
              `}
                            title={item.label}
                        >
                            <item.icon className="w-5 h-5" />
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                            )}

                            {/* Tooltip */}
                            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="mt-auto">
                <button className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <Settings className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
