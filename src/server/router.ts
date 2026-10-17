import { os } from '@orpc/server'
import { z } from 'zod'

/**
 * Zod Schemas for LumiDesk Foundations
 */
export const HealthCheckOutputSchema = z.object({
  status: z.enum(['ok', 'degraded', 'error']),
  version: z.string(),
  timestamp: z.string(),
  environment: z.string(),
  stack: z.object({
    framework: z.string(),
    database: z.string(),
    realtime: z.string(),
    embedding: z.string(),
    chat: z.string(),
  }),
})

export const WorkspaceStatsOutputSchema = z.object({
  workspaceId: z.string(),
  name: z.string(),
  metrics: z.object({
    deflectionRate: z.number(), // e.g. 42.5%
    activeConversations: z.number(),
    waitingConversations: z.number(),
    totalDocuments: z.number(),
  }),
})

export const ConversationSummarySchema = z.object({
  id: z.string(),
  visitorName: z.string(),
  visitorToken: z.string(),
  status: z.enum(['ai_answering', 'waiting', 'human', 'closed']),
  lastMessage: z.string(),
  lastMessageAt: z.string(),
  unreadCount: z.number(),
})

/**
 * Root oRPC Router Definition
 */
export const router = {
  health: os
    .output(HealthCheckOutputSchema)
    .handler(async () => {
      return {
        status: 'ok',
        version: '1.0.0-alpha',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        stack: {
          framework: 'Next.js 15 (App Router)',
          database: 'Neon Serverless PostgreSQL (pgvector + RLS)',
          realtime: 'PartyKit Cloud (WebSockets)',
          embedding: 'Voyage AI (voyage-3, 1024d)',
          chat: 'Google Gemini API (gemini-2.5-flash)',
        },
      }
    }),

  workspace: {
    stats: os
      .input(z.object({ workspaceId: z.string().default('default-workspace') }).optional())
      .output(WorkspaceStatsOutputSchema)
      .handler(async ({ input }) => {
        return {
          workspaceId: input?.workspaceId || 'default-workspace',
          name: 'Acme Technologies',
          metrics: {
            deflectionRate: 46.8,
            activeConversations: 8,
            waitingConversations: 2,
            totalDocuments: 14,
          },
        }
      }),
  },

  conversations: {
    list: os
      .input(
        z.object({
          status: z.enum(['all', 'ai_answering', 'waiting', 'human', 'closed']).optional(),
        }).optional()
      )
      .output(z.array(ConversationSummarySchema))
      .handler(async ({ input }) => {
        const sampleList = [
          {
            id: 'conv-001',
            visitorName: 'Visitor #4829',
            visitorToken: 'vis_token_9f82ab41',
            status: 'waiting' as const,
            lastMessage: 'Can you explain your enterprise SLA and compliance terms?',
            lastMessageAt: 'Just now',
            unreadCount: 1,
          },
          {
            id: 'conv-002',
            visitorName: 'David K. (Visitor #3104)',
            visitorToken: 'vis_token_1a83cc12',
            status: 'human' as const,
            lastMessage: 'Sure thing David, I just verified your account setup.',
            lastMessageAt: '2m ago',
            unreadCount: 0,
          },
          {
            id: 'conv-003',
            visitorName: 'Visitor #9201',
            visitorToken: 'vis_token_77dd23fa',
            status: 'ai_answering' as const,
            lastMessage: 'You can integrate LumiDesk with a single script tag in <head>.',
            lastMessageAt: '5m ago',
            unreadCount: 0,
          },
        ]

        if (input?.status && input.status !== 'all') {
          return sampleList.filter((c) => c.status === input.status)
        }
        return sampleList
      }),
  },
}

export type AppRouter = typeof router
