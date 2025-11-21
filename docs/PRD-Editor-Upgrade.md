# PRD: Editor Upgrade

**Status:** Approved
**Date:** 2025-11-21
**Focus:** User Experience, Input Fidelity

## 1. Problem Statement
The "Original Markdown" input is a plain HTML `textarea`. Users cannot easily read or format complex Markdown (headers, lists, code blocks), making the input experience feel "cheap" and error-prone.

## 2. Goals
-   Provide syntax highlighting for Markdown.
-   Improve readability with line numbers and proper font rendering.
-   Maintain a lightweight footprint.

## 3. Selected Technology

### Editor Component: CodeMirror 6
We will use **CodeMirror 6** (via the `@uiw/react-codemirror` wrapper).
*   **Why:** It provides a robust, "pro" editing experience with features like line numbers, active line highlighting, and real syntax parsing. It is significantly lighter than Monaco (VS Code) but much more powerful than a simple highlighted textarea, making it the perfect balance for this portal.

### UI Integration
-   **Styling:** The editor will be styled to match the current "Input Workspace" aesthetic (rounded corners, border colors).
-   **Theming:** It will automatically respect the application's Dark Mode settings.
-   **Layout:** It will replace the existing `textarea` and respect the current flexbox layout for auto-resizing.

## 4. Implementation Plan
1.  **Install:** `npm install @uiw/react-codemirror @codemirror/lang-markdown`.
2.  **Component:** Create `app/components/CodeEditor.tsx` wrapper to encapsulate configuration and theming.
3.  **Integration:** Replace the `textarea` in `InputWorkspace.tsx` with `<CodeEditor />`.
4.  **Theme:** Configure the editor's theme extensions to switch dynamically with Tailwind's dark mode.
