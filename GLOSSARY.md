# LumiDesk Domain Glossary

LumiDesk is an embeddable customer support platform providing real-time live chat, grounded AI support from uploaded business knowledge, and instant handoff to human operators.

## Language

### Core Entities

**Workspace**:
A business tenant account in LumiDesk that owns knowledge documents, team members, and widget configurations.
_Avoid_: Organization, company, tenant, portal

**Visitor**:
An individual browsing a customer's website who communicates through the LumiDesk widget.
_Avoid_: User, customer, client, lead, chatter

**Operator**:
A human team member or owner logged into the LumiDesk dashboard to manage knowledge and converse with visitors.
_Avoid_: Agent, support rep, human agent, admin

**AI Agent**:
The automated software entity that executes intent classification, document retrieval, and grounded response synthesis.
_Avoid_: Bot, chatbot, assistant, virtual agent

**Conversation**:
A single continuous messaging lifecycle between one Visitor and the LumiDesk system (handled by the AI Agent, an Operator, or both).
_Avoid_: Chat, thread, ticket, room, session

**Document**:
A business knowledge file (PDF, Markdown, plain text) uploaded by an Operator to ground the AI Agent.
_Avoid_: File, attachment, source file, article

**Chunk**:
A semantically bounded passage of text extracted from a Document alongside its vector embedding representation.
_Avoid_: Vector, snippet, passage, segment

### Lifecycle & Operations

**Handoff**:
The state transition where the AI Agent yields control of a Conversation to an Operator, muting automated AI responses.
_Avoid_: Escalation, transfer, failover

**Classification**:
The initial evaluation stage checking whether an incoming Visitor message is a genuine support query or an off-topic/adversarial prompt.
_Avoid_: Guardrail check, routing, moderation

**Decline**:
The immediate polite refusal returned by the AI Agent when a Visitor message is classified as off-topic, skipping vector retrieval entirely.
_Avoid_: Rejection, block, error response
