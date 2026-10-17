# 0001. Authoritative Next.js API with PartyKit as Broadcast Relay

## Context
LumiDesk requires real-time messaging between Visitors and Operators, alongside AI streaming responses. We needed to choose between routing all client messages directly over WebSockets to PartyKit (which delegates persistence via webhooks), or submitting messages via an authoritative Next.js HTTP API that persists to Neon Postgres before broadcasting events through PartyKit.

## Decision
All Visitor and Operator messages are submitted via Next.js HTTP POST endpoints (`/api/chat/messages`). Next.js performs authentication, rate limiting, and database persistence before broadcasting the message and typing events to the corresponding PartyKit WebSocket room. PartyKit acts purely as a stateless pub/sub and token streaming relay.

## Consequences
- Guaranteed zero-drop message persistence in Postgres independent of WebSocket reconnect cycles.
- Centralized auth checking (Better-Auth for Operators, signed tokens for Visitors) and rate-limiting at the API gateway layer.
- PartyKit instances remain lightweight and decoupled from direct database writes.
