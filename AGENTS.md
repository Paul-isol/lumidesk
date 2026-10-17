<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# LumiDesk Agent Instructions & Architecture Guide

LumiDesk is an Intercom-style customer support platform combining an embeddable website live chat widget, an operator dashboard, a strictly guarded AI support agent, and an instant human handoff state machine.

---

## 1. Context Pointers (Authoritative Sources of Truth)

Before modifying code or planning features, consult these primary documents:
* **[PRD.md](./PRD.md):** Master Product Requirements Document containing detailed operational flows (Flow A, B, C), database schema DDL with RLS policies, functional specifications, and phased roadmap.
* **[GLOSSARY.md](./GLOSSARY.md):** Canonical domain vocabulary. Always use canonical terms (**Workspace**, **Visitor**, **Operator**, **AI Agent**, **Conversation**, **Document**, **Chunk**, **Handoff**, **Classification**, **Decline**) and avoid forbidden synonyms (e.g., bot, ticket, customer).
* **[docs/adr/](./docs/adr/):** Architectural Decision Records:
  * [0001: Next.js Authoritative API & PartyKit Relay](./docs/adr/0001-nextjs-authoritative-api-partykit-relay.md)
  * [0002: Three-Tier Intent Classification](./docs/adr/0002-three-tier-intent-classification.md)
  * [0003: Voyage AI Embeddings & Google Gemini API](./docs/adr/0003-voyage-ai-embeddings-gemini-chat.md)
  * [0004: Neon Data API & RLS over Heavy ORMs](./docs/adr/0004-neon-data-api-and-rls-over-orm.md)
  * [0005: Dual RLS Enforcement & Neon AI Gateway](./docs/adr/0005-dual-rls-and-neon-ai-gateway.md)

---

## 2. Technology Stack & Key Libraries

* **Framework:** Next.js 15 (App Router, React 19, Server Components & Route Handlers).
* **Styling & UI:** Tailwind CSS v4 (native `@theme` CSS variables) + `shadcn/ui` with Radix primitives.
* **Type-Safe API / RPC:** `oRPC` (`@orpc/server`, `@orpc/client`) with `zod` input/output validation.
* **Backend as a Service (Neon):**
  * **Data Access:** Neon Data API via `@neondatabase/serverless` (HTTP driver; no Prisma/Drizzle ORMs).
  * **Tenant Security:** PostgreSQL Row-Level Security (RLS).
  * **Vector Engine:** PostgreSQL with `pgvector` (`VECTOR(1024)` for Voyage AI).
  * **Auth:** Better-Auth for operator accounts, credentials, and session cookies.
  * **Storage:** Neon Object Storage (S3-compatible presigned uploads for docs).
  * **Worker Functions:** Neon Functions triggered for background document chunking.
  * **AI Proxy:** Neon AI Gateway centralizing provider secrets, metrics, and retries.
* **Specialized AI Services:**
  * **Embeddings:** Voyage AI `voyage-3` (1024-dimensional vectors).
  * **Chat & Intent Classifier:** Google Gemini API (`gemini-2.5-flash`).
* **Real-Time WebSockets:** PartyKit Cloud managing rooms (`conversation:{id}` and `workspace:{id}`).

---

## 3. Core Architectural Invariants (Non-Negotiable Rules)

1. **No Heavyweight ORMs:**
   * All database interactions use direct SQL executed through the Neon Serverless Driver (`src/lib/db.ts`).
   * Never install or generate Prisma, Drizzle, or TypeORM.
2. **Dual RLS Session Context:**
   * **Operator Requests:** Execute with Better-Auth context via `withOperatorContext(workspaceId, userId, callback)`.
   * **Visitor Requests:** Execute with visitor session context via `withVisitorContext(workspaceId, visitorToken, callback)`.
   * RLS mathematically isolates conversations and messages at the database engine level.
3. **Authoritative Next.js Write-Path:**
   * Messages are submitted to the Next.js API first, verified against rate limits, written to PostgreSQL, and then broadcast via PartyKit WebSockets. PartyKit is a stateless streaming and presence pipe, not the primary database.
4. **Strict Three-Tier Intent Classification (Stage 1 Guardrail):**
   * Every incoming visitor message must be classified by Gemini 2.5 Flash before any vector lookup:
     * `SUPPORT_QUERY`: Trigger Voyage AI vector search and grounded RAG answer generation.
     * `CONVERSATIONAL`: Generate lightweight greeting/clarification without querying vector store.
     * `OFF_TOPIC`: Return immediate polite Decline; never run vector lookup or full context synthesis.
5. **Strict AI Muting on Handoff:**
   * When a Conversation enters `waiting` (low vector confidence score $< 0.70$ or visitor asks for human) or `human` (operator replies), the AI Agent is strictly silenced. It must never auto-reply into a handed-off thread.
6. **Widget Style & Sandbox Isolation:**
   * The embeddable widget must run within an `<iframe>` communicating with the host site's tiny launcher script via `window.postMessage`, guaranteeing zero CSS clashes with customer websites.

---

## 4. Directory Structure Conventions

```
lumidesk/
├── docs/adr/                 # Architectural Decision Records (0001 - 0005)
├── public/                   # Static assets & standalone embed scripts
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/
│   │   │   └── orpc/[...rest]/ # Type-safe oRPC route handler
│   │   ├── dashboard/        # Operator Dashboard route (/dashboard)
│   │   ├── widget/           # Embeddable widget iframe route (/widget)
│   │   ├── layout.tsx        # Root HTML layout with dark mode tokens
│   │   ├── page.tsx          # Marketing / Product Home page
│   │   └── globals.css       # Tailwind v4 theme & shadcn CSS variables
│   ├── components/
│   │   └── ui/               # shadcn/ui components (button, card, badge, etc.)
│   ├── lib/
│   │   ├── db.ts             # Neon Data API client + RLS session context helpers
│   │   ├── orpc.ts           # Type-safe oRPC client for frontend
│   │   └── utils.ts          # Class merging utility (cn)
│   └── server/
│       └── router.ts         # Root oRPC router with Zod validation
├── GLOSSARY.md               # Canonical domain language & definitions
├── PRD.md                    # Master Product Requirements Document
├── components.json           # shadcn configuration file
└── package.json              # Project dependencies & scripts
```

---

## 5. Development & Verification Commands

* `npm run dev` — Start the local development server on `http://localhost:3000`.
* `npm run build` — Run the full production build (checks TypeScript and route generation).
* `npx tsc --noEmit` — Run TypeScript type checking.
* `npm run lint` — Run ESLint across all source files.
