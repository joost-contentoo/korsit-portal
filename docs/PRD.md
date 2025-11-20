Here is the comprehensive Product Requirements Document (PRD), structured specifically to be fed into an AI coding agent (like Gemini in Antigravity, Cursor, or Windsurf).

-----

# 📄 PRD: The Localizer (Markdown Localization Prototype)

| **Project Name** | Localizer |
| :--- | :--- |
| **Version** | 1.0 |
| **Type** | Local Web Application (Prototype) |
| **Tech Stack** | Next.js 14+ (App Router), Tailwind CSS, TypeScript |
| **Status** | Ready for Implementation |

## 1\. Executive Summary

**The Localizer** is a local productivity interface designed to streamline the localization of English Markdown blog posts into German. It serves as a frontend wrapper for an intelligent n8n automation workflow.

The user pastes a raw English Markdown file and specific SEO instructions into the interface. The app sends these payloads to an n8n webhook, awaits the AI-processed response, and renders the returned German content as a styled HTML preview side-by-side with the input.

## 2\. User Experience (UX)

### 2.1 The Interface Layout

The application utilizes a **Split-Screen Layout** (50% Input / 50% Preview) that occupies the full viewport height (`100vh`).

  * **Left Pane (Input Zone):**

      * **Layout:** Vertical Split.
      * **Top Section (70% height):** "Blog Content". A large text area for pasting the raw English Markdown (including headers, links, and pseudo-metadata).
      * **Bottom Section (30% height):** "SEO Context". A secondary text area for pasting keyword tables and tone-of-voice instructions.
      * **Styling:** Monospace font for inputs to simulate a code editor feel.

  * **Right Pane (Preview Zone):**

      * **Content:** A scrollable container that renders the localized Markdown as fully styled HTML (mimicking a live blog post).
      * **Typography:** Clean, readable serif or sans-serif typography using Tailwind's `prose` classes.

  * **Header / Action Bar:**

      * **Position:** Fixed at the top.
      * **Elements:** App Title, Connection Status (implicit), and the primary **"Localize" Button**.

### 2.2 Interaction Flow

1.  User pastes the English blog post into the **Top Input**.
2.  User pastes the SEO requirements into the **Bottom Input**.
3.  User clicks **"Localize to German"**.
4.  **Loading State:**
      * The button becomes disabled.
      * A status text indicator cycles through "Witty" messages every 2.5 seconds (e.g., *"Teaching AI grammar...", "Optimizing keywords...", "Drinking virtual coffee..."*).
5.  **Success State:**
      * The loading stops.
      * The Right Pane populates with the rendered German HTML.
6.  **Error State:**
      * If the API fails, a red error toast or banner appears explaining the issue.

## 3\. Technical Architecture

### 3.1 Tech Stack

  * **Framework:** Next.js 14+ (App Router).
  * **Language:** TypeScript.
  * **Styling:** Tailwind CSS.
  * **Required Plugin:** `@tailwindcss/typography` (for rendering the Markdown HTML beautifully).
  * **Markdown Parser:** `react-markdown`.
  * **Icons:** `lucide-react`.

### 3.2 Data Flow & Security

To avoid CORS issues and exposing the n8n webhook URL to the browser client, the app uses a **Backend-for-Frontend (BFF)** pattern.

1.  **Browser:** `POST /api/localize` with JSON payload.
2.  **Next.js API Route:**
      * Reads `N8N_WEBHOOK_URL` from `.env.local`.
      * Forwards the request to n8n.
      * Awaits response.
3.  **n8n Cloud:** Processes text.
4.  **Next.js API Route:** Receives response and passes it back to the Browser.

## 4\. Data Contracts (API Schemas)

### 4.1 Frontend to Local API (`POST /api/localize`)

**Request Header:** `Content-Type: application/json`
**Request Body:**

```json
{
  "blog_content": "String (The raw markdown from the top input)",
  "seo_context": "String (The raw text from the bottom input)"
}
```

### 4.2 Local API to n8n Webhook (`POST [N8N_URL]`)

**Request Body:**
*(Identical to above)*

```json
{
  "blog_content": "# Title...",
  "seo_context": "Focus Keyword: xbox..."
}
```

### 4.3 n8n Response to Local API

**Expected Success Response (200 OK):**

```json
{
  "localized_content": "# Titel \n Dies ist der Inhalt..."
}
```

*Note: The application should be resilient. If n8n returns the content in a property named `output` or `text`, the app should attempt to find it.*

## 5\. Functional Requirements

  * **Environment Variables:** The app must look for `N8N_WEBHOOK_URL` in `.env.local`. It must throw a visible error in the console if this is missing.
  * **Markdown Rendering:**
      * Must support standard Markdown syntax: `# Headers`, `* Lists`, `**Bold**`, `[Links](url)`.
      * Must strictly respect newlines/paragraphs.
  * **Input Preservation:**
      * Inputs must *not* clear after submission (in case the user wants to tweak the SEO prompt and try again).
  * **Resilience:**
      * The fetch request should have a reasonable timeout handling (standard fetch behavior is usually fine for local prototypes, but ensure the UI doesn't "hang" forever if n8n dies).

## 6\. Implementation Checklist for AI Agent

1.  **Initialize:** Scaffold Next.js app with Tailwind and TypeScript.
2.  **Dependencies:** Install `react-markdown`, `@tailwindcss/typography`, `lucide-react`.
3.  **Config:** Add `require('@tailwindcss/typography')` to `tailwind.config.ts`.
4.  **Backend:** Create `app/api/localize/route.ts` implementing the proxy logic defined in Section 3.2.
5.  **Frontend:** Implement `app/page.tsx` with the Split-Screen layout and React State logic for the inputs and loading cycle.
6.  **Polish:** Add the "Witty" loading message array and rotation logic.