# 0002. Three-Tier Intent Classification for AI Guardrails

## Context
Standard chatbots often apply binary filters (On-Topic vs. Off-Topic), causing polite greetings or ambiguous clarifications to be rejected as "off-topic", while unguarded chatbots burn tokens answering math riddles, poetry prompts, and adversarial jailbreaks.

## Decision
Every incoming Visitor message must pass through a low-latency LLM classification step categorizing intent into three distinct states:
1. `SUPPORT_QUERY`: Questions about company products, services, or policies. Triggers vector embedding and RAG retrieval.
2. `CONVERSATIONAL`: Greetings, pleasantries ("hi", "thanks"), and general clarifications. Generates a brief conversational reply without running expensive vector searches.
3. `OFF_TOPIC`: Unrelated queries (math, code generation, creative writing, jailbreak attempts). Returns a standard polite Decline immediately without touching the vector store or full context window.

## Consequences
- Significant reduction in vector search query volume and downstream LLM token consumption.
- Prevents awkward customer rejections on simple hellos and conversational openers.
- Hardened protection against prompt injection and arbitrary token burn.
