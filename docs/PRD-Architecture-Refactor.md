# PRD: Architecture Refactor & Hardening

**Status:** Approved
**Date:** 2025-11-21
**Focus:** State Management, Error Handling, Configuration

## 1. Problem Statement
The current application relies on "prop drilling" for state management, making `page.tsx` bloated and difficult to maintain. Error handling is basic, risking application crashes or silent failures. Configuration values are hardcoded, reducing flexibility.

## 2. Goals
-   Decouple UI from logic by extracting state management.
-   Prevent application crashes with robust error boundaries and validation.
-   Centralize configuration for easier updates and environment management.

## 3. Selected Technologies

### A. State Management: Zustand
We will use **Zustand** to manage global application state.
*   **Why:** It offers an extremely simple API with minimal boilerplate, avoids the complexity of React Context providers, and is highly performant. It allows us to decouple the data stores (`ContentStore`, `UIStore`) from the React component tree.

### B. Error Handling & Validation: Zod + Error Boundary
We will use **Zod** for schema validation and a standard **React Error Boundary**.
*   **Why:** Zod ensures that all data flowing into and out of our API meets a strict contract, preventing runtime errors due to malformed data. The Error Boundary ensures that if a crash does occur, the user sees a friendly fallback UI instead of a white screen.

### C. Configuration
We will centralize all constants and environment variables.
*   **Plan:**
    *   `app/config/constants.ts`: For static text (e.g., `WITTY_MESSAGES`) and defaults.
    *   `app/config/env.ts`: For validating and exporting `process.env` variables.

## 4. Implementation Plan
1.  **Setup:** Install `zustand` and `zod`.
2.  **Config:** Move constants to `app/config/`.
3.  **State:** Create `useStore` hooks for content and UI state. Refactor `InputWorkspace`, `ComparisonDeck`, and `ReferenceDrawer` to consume these hooks directly, removing props from `Home`.
4.  **Validation:** Define Zod schemas for the `/api/localize` route. Implement validation in `route.ts`.
5.  **Safety:** Wrap the main app in a `<GlobalErrorBoundary>` component.
