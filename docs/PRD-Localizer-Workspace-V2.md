# PRD: Localizer Workspace v2 – Compartment Model

## 0. At-a-Glance
| Field | Value |
| --- | --- |
| Project | Localizer UI Refresh |
| Version | 2.0 Draft |
| Owner | Joost / Localizer Team |
| Status | Ready for Design + Implementation |
| Last Updated | 2025-11-20 |

## 1. Goals & Success Criteria
- **Primary Goal:** Deliver a single-page workspace with three dedicated compartments so localization inputs stay focused, comparison is one scroll away, and reference materials remain accessible but unobtrusive.
- **Success Metrics:**
  1. Users complete localization flows without losing context (inputs persist across interactions).
  2. Time from submission to reviewing output < 1 second of user effort (auto-scroll + visual focus).
  3. Style guide/guideline edits are possible without leaving the page.
- **Assumptions:** n8n payload contract stays the same; future fields can be added without backend rewrites.

## 2. Personas & Core Journeys
- **Content Localizer (Primary):** Frequently pastes markdown + SEO inputs, tweaks prompts, and inspects outputs multiple times per session.
- **Editor / QA (Secondary):** Occasionally updates the Style Guide or Glossary but spends most time reviewing outputs.

**Primary Journey:** Input Workspace → click Localize → system shows witty loading state → automatically transition focus to Comparison Deck once output arrives → user scrolls back (or uses anchor) to adjust inputs as needed.

## 3. Experience Architecture
- **Layout Pattern:** Vertical stacked compartments with a sticky anchor rail on the left (Input Workspace, Comparison Deck, Reference Drawer). Anchors highlight based on scroll position (Intersection Observer) and provide one-click jumps.
- **Compartment Priority:**
  1. **Input Workspace** (high-frequency interaction).
  2. **Comparison Deck** (auto-focus after each run).
  3. **Reference Drawer** (low-frequency adjustments; optional collapse).
- **Responsiveness:** Desktop-first 2-column experiences inside each compartment; collapse to stacked blocks on small screens.

## 4. Compartment Specifications
### 4.1 Input Workspace
- **Fields:**
  - `Original Markdown` (existing textarea, monospace, large).
  - `SEO Context` (existing textarea, smaller).
  - `Additional Instructions` (new Markdown textarea for future metadata; includes optional helper inputs like tone, audience, etc.).
- **Behavior:**
  - Values persist between compartment switches and page reloads (local component state now, optional `localStorage` later).
  - Inline validation for empty main markdown; CTA disabled until valid.
  - Submit button preserves witty rotating messages; displays spinner + disables itself during fetch.
- **Actions:**
  - Primary CTA `Localize to German`.
  - Secondary actions (copy, clear) optional.

### 4.2 Comparison Deck
- **Structure:** Two equal-width panes (Source Render vs Localized Output) sharing a synchronized scroll container; optional "Swap Sides" control.
- **Rendering:** `react-markdown` + Tailwind `prose` styling for both panes; horizontal padding and card-like surfaces for readability.
- **Behavior:**
  - Placeholder cards when no data available.
  - On localization success, auto-scroll this compartment into view with brief highlight animation.
  - Provide copy, download, and expand controls per pane.

### 4.3 Reference Drawer (Style Guide & Glossary)
- **Fields:**
  - `Style Guide` textarea (monospace, Markdown-ready).
  - `Glossary` textarea (monospace, Markdown-ready).
- **Mode:** Editable inputs (not read-only) so users can tweak content before wiring them into n8n.
- **Enhancements:** Toggle to preview rendered Markdown; optional accordion collapse to save space.

## 5. Interaction States
- **Loading:** Button shows rotating witty text; anchor rail highlights Input Workspace as "processing" and Comparison Deck as "pending".
- **Success:** Auto-scroll to Comparison Deck, flash success toast, maintain inputs untouched.
- **Error:** Keep user in Input Workspace, show inline error + toast, mark Comparison Deck anchor with error badge.
- **Navigation Helpers:** Keyboard shortcuts (e.g., `Alt+1/2/3`) for jumping between compartments; anchors remain focusable.

## 6. Technical Requirements
1. **API Contract:** Continue posting `{ blog_content, seo_context }`; include `additional_instructions` when the backend is ready. No schema changes required for initial UI work.
2. **State Management:** Use React context or lifted state so compartments share data; persist to `localStorage` when practical (opt-in feature flag).
3. **Auto-Scroll:** Use refs + `scrollIntoView` after successful localization; provide reduced-motion preference handling.
4. **Comparison Sync:** Implement synchronized scrolling via scroll event listeners; throttle for performance.
5. **Reference Storage:** Keep data client-side for now; design hooks to load/save from Markdown files or n8n nodes later.
6. **Accessibility:**
   - Labels + aria descriptions for all textareas.
   - Maintain focus management when auto-scrolling (announce via aria-live).
7. **Performance:** Avoid rerendering Markdown panes unnecessarily; debounce textareas for autosave.

## 7. Implementation Plan
1. **Phase 1 – Layout & Compartments:** Break `app/page.tsx` into subcomponents (InputWorkspace, ComparisonDeck, ReferenceDrawer) and implement anchor rail + scrolling.
2. **Phase 2 – Additional Instructions Field:** Add new textarea, plumb value through state, prepare API payload (behind feature flag).
3. **Phase 3 – Comparison Enhancements:** Add synchronized scrolling, swap control, copy/download actions.
4. **Phase 4 – Reference Drawer Polish:** Add preview toggles, optional persistence, and ready hooks for future n8n wiring.

## 8. Risks & Open Questions
- **Autosave Scope:** Decide whether to persist all fields automatically or gate via user setting.
- **Additional Instructions Schema:** Confirm naming + formatting for eventual n8n integration.
- **Reference Data Source:** Determine when to replace manual textareas with linked Markdown files or n8n nodes.
- **Accessibility Testing:** Auto-scroll must not disorient screen-reader users; may require preference toggle.

---
Prepared for handoff to design/implementation teams.
