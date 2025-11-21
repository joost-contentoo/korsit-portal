import { create } from 'zustand';
import { WITTY_MESSAGES } from '../config/constants';

interface UIState {
    isLoading: boolean;
    error: string | null;
    activeSection: string;
    wittyMessageIndex: number;

    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    setActiveSection: (section: string) => void;
    rotateWittyMessage: () => void;
    resetWittyMessage: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isLoading: false,
    error: null,
    activeSection: 'input-workspace',
    wittyMessageIndex: 0,

    setIsLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    setActiveSection: (section) => set({ activeSection: section }),
    rotateWittyMessage: () => set((state) => ({
        wittyMessageIndex: (state.wittyMessageIndex + 1) % WITTY_MESSAGES.length
    })),
    resetWittyMessage: () => set({ wittyMessageIndex: 0 }),
}));
