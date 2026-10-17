# 0003. Voyage AI for Embeddings and Google Gemini API for Chat & Classification

## Context
LumiDesk requires high-precision semantic retrieval for grounded customer documentation and ultra-low latency, cost-effective language models for real-time visitor chat and intent classification. We evaluated embedding and generation providers (OpenAI, Anthropic, Google, and specialized retrieval engines).

## Decision
1. **Embeddings:** Use **Voyage AI** (`voyage-3`, 1024-dimensional vectors) for all document chunking and query vectorization.
2. **Chat & Classification:** Use the **Google Gemini API** (`gemini-2.5-flash`) for the Stage 1 Three-Tier Intent Classifier and Stage 2 Grounded RAG answer synthesis.

## Consequences
- **Retrieval Quality:** Voyage AI consistently outperforms generalist embedding models in dense retrieval benchmarks and technical domain documentation, providing higher separation between on-topic and irrelevant chunks.
- **Database Schema:** PostgreSQL `pgvector` columns are sized to `VECTOR(1024)` (down from 1536), reducing index memory footprint by ~33% while improving query throughput.
- **Generation Speed & Cost:** Gemini 2.5 Flash provides industry-leading time-to-first-token (TTFT) and high token-per-second streaming velocity, critical for real-time customer support widgets.
- **Provider Migration:** Any future change to embedding models requires re-embedding all `document_chunks` in PostgreSQL.
