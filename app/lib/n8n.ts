export function parseN8nResponse(data: any): string | null {
    if (!data) return null;

    // Check for various output formats
    const localizedContent = data.localized_content || data.output || data.text || data.content;

    if (!localizedContent && typeof data === 'string') {
        // In case n8n returns raw string
        return data;
    }

    return localizedContent || null;
}
