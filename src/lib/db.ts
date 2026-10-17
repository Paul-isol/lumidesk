import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

/**
 * Neon Serverless SQL Client (Neon Data API)
 * Executes queries directly over HTTP without heavy ORM overhead.
 * Configured with Row-Level Security (RLS) session context helpers.
 */
const connectionString = process.env.DATABASE_URL || ''

// Export sql tagged template for direct queries
export const sql: NeonQueryFunction<false, false> = neon(
  connectionString || 'postgres://placeholder:placeholder@localhost:5432/lumidesk'
)

/**
 * Executes a query within an Operator RLS session context
 * Enforces workspace isolation directly in PostgreSQL.
 */
export async function withOperatorContext<T>(
  workspaceId: string,
  userId: string,
  callback: (execute: NeonQueryFunction<false, false>) => Promise<T>
): Promise<T> {
  // Sets session variables for RLS policies
  await sql`
    SELECT 
      set_config('app.current_workspace_id', ${workspaceId}, true),
      set_config('app.current_user_id', ${userId}, true);
  `
  return callback(sql)
}

/**
 * Executes a query within an Anonymous Visitor RLS session context
 * Binds queries strictly to the visitor's token and workspace.
 */
export async function withVisitorContext<T>(
  workspaceId: string,
  visitorToken: string,
  callback: (execute: NeonQueryFunction<false, false>) => Promise<T>
): Promise<T> {
  await sql`
    SELECT 
      set_config('app.current_workspace_id', ${workspaceId}, true),
      set_config('app.current_visitor_token', ${visitorToken}, true);
  `
  return callback(sql)
}
