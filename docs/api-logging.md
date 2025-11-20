# Localization Proxy Logging Hygiene

## Problem
`app/api/localize/route.ts` logs the downstream webhook URL, the entire request payload (blog content, SEO context, style guide, glossary), and the raw n8n response body. In production this leaks customer copy, SEO strategy, and possibly credentials to whatever log sink backs the deployment. Most observability stacks are multi-tenant, so retaining this text creates compliance and privacy issues.

## Proposed solution
1. Strip sensitive inputs and outputs from the default logs, preserving only high-level telemetry such as status codes, latency, and correlation ids.  
2. If deep tracing is still desired, gate the verbose logging behind an environment flag (e.g., `LOG_LOCALIZE_PAYLOADS=true`) so it can be enabled temporarily for debugging.  
3. Ensure redaction happens before errors are thrown; avoid logging raw `Error` objects that may embed payload snippets.  
4. Document the policy in `README.md` so future contributors know how to debug without reintroducing data leaks.
