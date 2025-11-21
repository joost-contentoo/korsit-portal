import { create } from 'zustand';

interface ContentState {
    blogContent: string;
    seoContext: string;
    additionalInstructions: string;
    localizedContent: string;
    styleGuide: string;
    glossary: string;

    setBlogContent: (content: string) => void;
    setSeoContext: (context: string) => void;
    setAdditionalInstructions: (instructions: string) => void;
    setLocalizedContent: (content: string) => void;
    setStyleGuide: (guide: string) => void;
    setGlossary: (glossary: string) => void;
}

export const useContentStore = create<ContentState>((set) => ({
    blogContent: '',
    seoContext: '',
    additionalInstructions: '',
    localizedContent: '',
    styleGuide: '',
    glossary: '',

    setBlogContent: (content) => set({ blogContent: content }),
    setSeoContext: (context) => set({ seoContext: context }),
    setAdditionalInstructions: (instructions) => set({ additionalInstructions: instructions }),
    setLocalizedContent: (content) => set({ localizedContent: content }),
    setStyleGuide: (guide) => set({ styleGuide: guide }),
    setGlossary: (glossary) => set({ glossary: glossary }),
}));
