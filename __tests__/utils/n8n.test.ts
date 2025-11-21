import { parseN8nResponse } from '@/app/lib/n8n';

describe('parseN8nResponse', () => {
    it('extracts localized_content correctly', () => {
        const data = { localized_content: 'Hallo Welt' };
        expect(parseN8nResponse(data)).toBe('Hallo Welt');
    });

    it('extracts output correctly', () => {
        const data = { output: 'Hallo Welt' };
        expect(parseN8nResponse(data)).toBe('Hallo Welt');
    });

    it('extracts text correctly', () => {
        const data = { text: 'Hallo Welt' };
        expect(parseN8nResponse(data)).toBe('Hallo Welt');
    });

    it('extracts content correctly', () => {
        const data = { content: 'Hallo Welt' };
        expect(parseN8nResponse(data)).toBe('Hallo Welt');
    });

    it('returns raw string if input is string', () => {
        const data = 'Hallo Welt';
        expect(parseN8nResponse(data)).toBe('Hallo Welt');
    });

    it('returns null for empty or invalid object', () => {
        expect(parseN8nResponse({})).toBeNull();
        expect(parseN8nResponse(null)).toBeNull();
        expect(parseN8nResponse(undefined)).toBeNull();
    });
});
