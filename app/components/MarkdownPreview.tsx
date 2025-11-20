import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownPreviewProps {
    content: string;
}

export default function MarkdownPreview({ content }: MarkdownPreviewProps) {
    if (!content) {
        return (
            <div className="h-full flex items-center justify-center text-gray-400 italic">
                Localized content will appear here...
            </div>
        );
    }

    return (
        <div className="prose prose-slate max-w-none dark:prose-invert">
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
    );
}
