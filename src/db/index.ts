import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { IS_PRODUCTION } from '@/constants/common'
import { env } from '@/env'

import * as schema from './schemas'

declare global {
  var pgClient: ReturnType<typeof postgres> | undefined
}

// Client configuration for Aiven PostgreSQL
const clientOptions: postgres.Options<{}> = {
  ssl: { rejectUnauthorized: false }, // Enforces SSL and bypasses self-signed cert checks on Aiven
  prepare: false, // Prevents prepared statement errors across serverless invocations
}

let client: ReturnType<typeof postgres>

if (IS_PRODUCTION) {
  client = postgres(env.DATABASE_URL, clientOptions)
} else {
  globalThis.pgClient ??= postgres(env.DATABASE_URL, clientOptions)
  client = globalThis.pgClient
}

export const db = drizzle(client, { schema })