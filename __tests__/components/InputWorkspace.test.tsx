import React from 'react';
import { render, screen } from '@testing-library/react';
import InputWorkspace from '@/app/components/InputWorkspace';
import { useContentStore } from '@/app/store/useContentStore';
import { useUIStore } from '@/app/store/useUIStore';

// Mock the stores
jest.mock('@/app/store/useContentStore');
jest.mock('@/app/store/useUIStore');

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    ArrowRight: () => <div data-testid="arrow-right" />,
    Loader2: () => <div data-testid="loader-2" />,
}));

describe('InputWorkspace', () => {
    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Default mock implementation
        (useContentStore as unknown as jest.Mock).mockReturnValue({
            blogContent: '',
            setBlogContent: jest.fn(),
            seoContext: '',
            setSeoContext: jest.fn(),
            additionalInstructions: '',
            setAdditionalInstructions: jest.fn(),
            styleGuide: '',
            glossary: '',
            setLocalizedContent: jest.fn(),
        });

        (useUIStore as unknown as jest.Mock).mockReturnValue({
            isLoading: false,
            setIsLoading: jest.fn(),
            setError: jest.fn(),
            wittyMessageIndex: 0,
        });
    });

    it('renders the workspace title', () => {
        render(<InputWorkspace />);
        expect(screen.getByText('Input Workspace')).toBeInTheDocument();
    });

    it('renders the input textareas', () => {
        render(<InputWorkspace />);
        expect(screen.getByLabelText(/Original Markdown/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/SEO Context/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Additional Instructions/i)).toBeInTheDocument();
    });

    it('renders the localize button', () => {
        render(<InputWorkspace />);
        expect(screen.getByRole('button', { name: /Localize to German/i })).toBeInTheDocument();
    });

    it('disables button when content is empty', () => {
        render(<InputWorkspace />);
        const button = screen.getByRole('button', { name: /Localize to German/i });
        expect(button).toBeDisabled();
    });

    it('shows loading state when isLoading is true', () => {
        (useUIStore as unknown as jest.Mock).mockReturnValue({
            isLoading: true,
            wittyMessageIndex: 0,
        });

        render(<InputWorkspace />);
        expect(screen.getByTestId('loader-2')).toBeInTheDocument();
    });
});
