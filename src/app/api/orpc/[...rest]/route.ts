import { RPCHandler } from '@orpc/server/fetch'
import { router } from '@/server/router'

const handler = new RPCHandler(router)

async function handleRequest(request: Request) {
  const result = await handler.handle(request, {
    prefix: '/api/orpc',
  })

  if (result.matched) {
    return result.response
  }

  return new Response(JSON.stringify({ error: 'RPC route not found' }), {
    status: 404,
    headers: { 'content-type': 'application/json' },
  })
}

export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest
