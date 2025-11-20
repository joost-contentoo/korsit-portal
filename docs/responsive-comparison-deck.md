# Responsive Comparison Deck

## Problem
`app/components/ComparisonDeck.tsx` forces both panes to `w-1/2` inside a horizontal flex container, so on tablets and phones each column shrinks to ~50% of the viewport with double scrollbars. The synchronized scroll logic also assumes equal heights, which becomes unwieldy when the localized copy is longer than the source.

## Proposed solution
1. Switch the wrapper to `flex-col lg:flex-row` and set panes to `w-full lg:w-1/2` so they stack vertically on narrow screens while preserving the side-by-side comparison on desktop.  
2. Add `min-h-[50vh]` (or similar) to each pane when stacked to keep them usable without forcing the user to scroll endlessly.  
3. Gate the scroll-sync logic so it only runs when both refs are rendered side-by-side; when stacked, native scrolling is preferable.  
4. Smoke-test at common breakpoints (375px, 768px, 1024px) to confirm buttons, loaders, and download actions remain accessible.
