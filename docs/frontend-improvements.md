# Frontend Contract & Accessibility Fixes

## 1. Input Workspace prop contract drift

**Problem**  
`app/page.tsx` passes `styleGuide`, `setStyleGuide`, `glossary`, and `setGlossary` into `InputWorkspace`, but `app/components/InputWorkspace.tsx` only declares props for `blogContent`, `seoContext`, and `additionalInstructions`. TypeScript rightfully rejects the call site (`TS2322`) and CI will fail on every typed build even though the UI happens to render in dev mode.

**Proposed solution**  
Decide whether the Input workspace should actually surface the style-guide/glossary editors. If not, remove the unused props from `app/page.tsx` so the component contract matches reality. If the intent is to edit every input from a single panel, extend `InputWorkspaceProps` with the missing fields and render the extra inputs. Either approach should include:

1. Update `InputWorkspaceProps` and accompanying JSX (or strip the unused props) so `tsc` runs cleanly.  
2. Add a regression test (`npm run lint` already invokes type-checking when `NEXT_TELEMETRY_DISABLED=1 npx next lint --strict` is adopted) or CI step to ensure future prop drift is caught immediately.

## 2. Form label associations & placeholders

**Problem**  
The three `<textarea>` elements in `InputWorkspace` have visible `<label>` tags but no `id`/`htmlFor` linkage, so assistive tech cannot programmatically associate them. The SEO Context placeholder also renders the literal string `&#10;` because React does not treat attributes as HTML; users see “Keywords…&#10;Tone…” instead of a multiline hint.

**Proposed solution**

1. Assign stable ids to each textarea (`original-markdown`, `seo-context`, `additional-instructions`) and point each label’s `htmlFor` at the matching id.  
2. Replace the entity sequence in the SEO placeholder with an actual newline (`"Keywords: …\nTone: …"`).  
3. Manually test with keyboard and screen-reader navigation to confirm labels focus the inputs and the hint text renders on two lines.

## 3. Anchor rail accessibility

**Problem**  
The icon-only buttons in `app/components/AnchorRail.tsx` rely on `title` tooltips. Screen readers announce them as “button” with no name, and keyboard users never see a tooltip. The settings icon is similarly unlabeled.

**Proposed solution**

1. Provide `aria-label` attributes (or visible text) for each rail button, e.g., `aria-label="Input workspace"`.  
2. Expose tooltip text on focus so keyboard users receive the same affordance as pointer users.  
3. Add a focused state outline that meets WCAG contrast ratios to keep navigation discoverable.
