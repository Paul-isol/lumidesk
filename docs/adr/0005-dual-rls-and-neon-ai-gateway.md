# 0005. Dual RLS Enforcement Strategy and Neon AI Gateway Proxying

## Context
LumiDesk serves two distinct consumer types querying PostgreSQL via the Neon Data API:
1. **Authenticated Operators:** Logged into the dashboard via Better-Auth, belonging to a specific `workspace_id`.
2. **Anonymous Visitors:** External site visitors interacting via the embeddable chat widget, possessing only an ephemeral `visitor_token`.

Additionally, the system communicates with external AI services (Google Gemini API for chat/classification and Voyage AI for 1024-dimensional embeddings).

## Decision
1. **Dual Row-Level Security (RLS) Pattern:**
   - **Operator Queries:** Next.js sets session parameters based on the verified Better-Auth token (`SET LOCAL app.current_user_id = $1; SET LOCAL app.current_workspace_id = $2;`). RLS policies restrict operators to reading/modifying data within their workspace.
   - **Visitor Queries:** Next.js sets visitor session parameters (`SET LOCAL app.current_visitor_token = $1; SET LOCAL app.current_workspace_id = $2;`). RLS policies mathematically restrict the visitor to reading and inserting only into their specific conversation thread.
2. **Neon AI Gateway Proxying:**
   - All outbound requests to Google Gemini 2.5 Flash and Voyage AI are routed through the Neon AI Gateway proxy endpoint.

## Consequences
- **Zero Cross-Visitor Data Leakage:** Even in the event of an application logic bug, PostgreSQL RLS rejects any query where a visitor token attempts to read another conversation.
- **Unified AI Secret Management:** Provider keys for Gemini and Voyage AI reside in Neon's central secret store rather than being duplicated across edge function environments.
- **Observability:** Token usage, request latencies, and cache hits are monitored centrally via the Neon AI Gateway console.
