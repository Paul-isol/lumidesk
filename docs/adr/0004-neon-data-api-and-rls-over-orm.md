# 0004. Neon Data API and Row-Level Security (RLS) over Heavy ORMs

## Context
Standard full-stack Next.js applications traditionally rely on heavyweight ORMs (such as Prisma or Drizzle) with long-running connection pools or TCP connection poolers. LumiDesk runs on serverless architecture (Vercel + Neon) where cold starts, multi-tenant isolation, and connection overhead are critical concerns.

## Decision
LumiDesk will forgo traditional ORMs in favor of the **Neon Serverless Driver / Data API** over HTTP/WebSockets, using native SQL queries paired with PostgreSQL **Row-Level Security (RLS)** for multi-tenant isolation:
1. Tenant and identity isolation (`workspace_id`, `visitor_id`, `user_id`) is enforced directly in PostgreSQL via RLS policies rather than relying purely on application-layer `WHERE` clauses.
2. Authenticated operator requests pass Better-Auth session claims to PostgreSQL session state (`SET LOCAL request.jwt.claim...` or Neon auth context).
3. The Next.js API server utilizes the lightweight `@neondatabase/serverless` HTTP driver for zero-cold-start queries.

## Consequences
- **Connection Efficiency:** HTTP-based queries over the Neon Serverless Driver eliminate connection pool exhaustion on serverless edge functions.
- **Enforced Multi-Tenancy:** RLS acts as a mathematical defense-in-depth barrier preventing cross-tenant data leakage even if an application bug omits a workspace filter.
- **Visitor Query Pattern:** Because anonymous Visitors do not have Better-Auth accounts, Next.js server endpoints execute visitor operations using scoped session variables (`SET LOCAL app.current_visitor_token`) or a dedicated service role.
