import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import type { RouterClient } from '@orpc/server'
import type { AppRouter } from '@/server/router'

/**
 * Type-Safe oRPC Client
 * Connects directly to the /api/orpc endpoint with automatic type inference.
 */
export const orpc: RouterClient<AppRouter> = createORPCClient(
  new RPCLink({
    url: typeof window !== 'undefined' 
      ? `${window.location.origin}/api/orpc`
      : 'http://localhost:3000/api/orpc',
  })
)
