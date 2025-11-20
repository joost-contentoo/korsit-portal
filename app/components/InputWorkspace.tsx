import React from 'react';

interface InputWorkspaceProps {
  blogContent: string;
  setBlogContent: (value: string) => void;
  seoContext: string;
  setSeoContext: (value: string) => void;
  additionalInstructions: string;
  setAdditionalInstructions: (value: string) => void;
}

export default function InputWorkspace({
  blogContent,
  setBlogContent,
  seoContext,
  setSeoContext,
  additionalInstructions,
  setAdditionalInstructions,
}: InputWorkspaceProps) {
  return (
    <div id="input-workspace" className="flex flex-col h-full min-h-screen bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold mb-4">Input Workspace</h2>

        {/* Blog Content */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Original Markdown
          </label>
          <textarea
            value={blogContent}
            onChange={(e) => setBlogContent(e.target.value)}
            placeholder="# Paste your English Markdown here..."
            className="w-full h-64 resize-none bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md p-4 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            spellCheck={false}
          />
        </div>

        {/* SEO Context */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            SEO Context
          </label>
          <textarea
            value={seoContext}
            onChange={(e) => setSeoContext(e.target.value)}
            placeholder="Keywords: xbox, gaming...&#10;Tone: Professional but friendly..."
            className="w-full h-32 resize-none bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md p-4 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            spellCheck={false}
          />
        </div>

        {/* Additional Instructions */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Additional Instructions
          </label>
          <textarea
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
            placeholder="Any specific instructions for this localization run..."
            className="w-full h-32 resize-none bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md p-4 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
