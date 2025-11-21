# Improvement Points for Korsit Portal
**Date:** 2025-11-21

Here are the top 5 improvement points to enhance the Korsit Portal application, focusing on maintainability, user experience, and robustness.

## 1. Refactor State Management
**Motivation:**
Currently, the `Home` component (`app/page.tsx`) manages all the application state (content, settings, UI state) and passes it down via props to children components. As the application grows, this "prop drilling" makes the code harder to maintain, test, and debug. It also triggers unnecessary re-renders in child components.

**Solution:**
-   **Introduce a State Management Library or Context:** Use React Context or a lightweight library like **Zustand** to manage global state (e.g., `blogContent`, `localizedContent`, `glossary`, `styleGuide`).
-   **Separate Concerns:** Create specific stores/contexts for different domains (e.g., `ContentStore` for the blog post data, `UIStore` for active sections and loading states).
-   **Custom Hooks:** Extract logic into custom hooks (e.g., `useLocalization`, `useAutoScroll`) to keep components clean and focused on UI.

## 2. Enhance Input Experience with a Code Editor
**Motivation:**
The "Original Markdown" input is currently a standard HTML `textarea`. It lacks features that are standard in markdown editing, such as syntax highlighting, line numbers, and auto-formatting. This makes it difficult for users to read and edit complex Markdown structures before localization.

**Solution:**
-   **Replace Textarea with a Code Editor:** Integrate a lightweight code editor component like **CodeMirror** or **Monaco Editor** (or a simpler React wrapper like `react-simple-code-editor` with PrismJS).
-   **Features:** Enable Markdown syntax highlighting, line wrapping, and basic error detection.
-   **Benefit:** This provides a "pro" feel to the tool and significantly improves readability and editing efficiency for the user.

## 3. Implement Robust Error Handling & Validation
**Motivation:**
Error handling is currently basic (try-catch blocks setting a string error). There is no schema validation for the API inputs/outputs, meaning the app could crash or behave unpredictably if the API receives malformed data or if n8n returns an unexpected structure. Additionally, a UI crash in one component could bring down the entire page.

**Solution:**
-   **Schema Validation:** Use **Zod** to define schemas for all API requests and responses. Validate incoming data on the server (`route.ts`) and outgoing data on the client.
-   **Global Error Boundary:** Implement a React Error Boundary component to catch unhandled runtime errors in the component tree and display a friendly fallback UI instead of a white screen.
-   **Toast Notifications:** Replace or augment inline error messages with a toast notification system (e.g., `sonner` or `react-hot-toast`) for better visibility of success/error states.

## 4. Establish an Automated Testing Suite
**Motivation:**
The project currently lacks automated tests. Any changes to the code (like refactoring state or updating UI) carry a high risk of introducing regressions. Manual testing is time-consuming and prone to human error.

**Solution:**
-   **Unit/Integration Tests:** Set up **Jest** and **React Testing Library**. Write tests for critical components (`InputWorkspace`, `ComparisonDeck`) and utility functions.
-   **End-to-End (E2E) Tests:** Implement **Playwright** or **Cypress** to test critical user flows (e.g., "Enter text -> Click Localize -> Verify Output", "Save Glossary -> Reload -> Verify Persistence").
-   **CI/CD Integration:** (Optional but recommended) Configure these tests to run automatically on commit or push.

## 5. Centralize Configuration & Constants
**Motivation:**
Configuration values (like `WITTY_MESSAGES`, timeouts, and potentially default settings) are hardcoded within component files. This makes it difficult to update "business logic" (like the loading messages) without touching the UI code. It also makes the app less flexible for different environments or user preferences.

**Solution:**
-   **Config File:** Create a `config/constants.ts` or similar file to house all static text, default values, and configuration options.
-   **Environment Variables:** Ensure all sensitive or environment-specific values (like API timeouts or feature flags) are strictly managed via `process.env` and typed correctly.
-   **Feature Flags:** Implement a simple feature flag system to easily toggle features (like "verbose logging" or "new UI components") without code deploys.
