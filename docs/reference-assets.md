# Reference Assets Persistence & Security

## 1. Style guide API depends on writable repo files

**Problem**  
`app/api/style-guide/route.ts` reads and writes `style-guide.md` directly from the application’s working directory. This works locally, but production platforms such as Vercel provide read-only/ephemeral filesystems for Serverless Functions. Every write will fail silently, and the GET endpoint exposes the entire style guide to any unauthenticated caller who knows `/api/style-guide`.

**Proposed solution**

1. Introduce an authenticated storage layer for the style guide (e.g., Supabase/Postgres table, KV store, or S3 object).  
2. Require authentication before serving or mutating the document—at minimum HTTP basic auth or signed session tokens.  
3. Update the API route to read/write through that storage layer and propagate errors back to the UI.  
4. Remove the repository file dependency once the remote store is in place so deployments no longer rely on filesystem writes.

## 2. Glossary content is never persisted

**Problem**  
The glossary text area shares the “Reference Drawer” branding with the style guide, yet its state lives only in React. Refreshing the page or switching devices wipes the content, which makes collaboration impossible and contradicts the UI affordance that both panes are durable references.

**Proposed solution**

1. Reuse the same backing store introduced for the style guide and add `/api/glossary` endpoints with GET/POST semantics.  
2. Load the saved glossary inside `ReferenceDrawer` on mount, mirroring the style guide flow, and surface optimistic-saving status to the user.  
3. Consider versioning or “last updated” metadata so copywriters can coordinate without overwriting each other’s work.  
4. Until persistence ships, add helper copy warning users that glossary edits are local-only to avoid data loss surprises.
