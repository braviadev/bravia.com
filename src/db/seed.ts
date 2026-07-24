import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { IS_PRODUCTION } from '@/constants/common'
import { env } from '@/env'

import * as schema from './schemas'

declare global {
  var pgClient: ReturnType<typeof postgres> | undefined
}

// Best Practice for Aiven/Serverless Postgres:
// 1. Force SSL mode explicitly in options
// 2. Set max pool connections for scripts
// 3. Disable prepared statements for pooled connections
const clientOptions: postgres.Options<{}> = {
  ssl: 'require', // Enforces TLS connection to Aiven
  max: 10,
  prepare: false,
}

let client: ReturnType<typeof postgres>

if (IS_PRODUCTION) {
  client = postgres(env.DATABASE_URL, clientOptions)
} else {
  globalThis.pgClient ??= postgres(env.DATABASE_URL, clientOptions)
  client = globalThis.pgClient
}

export const db = drizzle(client, { schema })