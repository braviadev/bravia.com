import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { env } from '@/env'
import * as schema from './schemas'

declare global {
  var pgClient: postgres.Sql | undefined
}

// 🚨 Use native Node environment check (Vercel automatically sets this to 'production')
const isProd = process.env.NODE_ENV === 'production'
const connectionString = env.DATABASE_URL

const connectionOptions: postgres.Options<{}> = {
  max: isProd ? 10 : 1,        
  // 🚨 Vercel gets 'require', your local PC gets 'false'
  ssl: isProd ? 'require' : false, 
  prepare: false,                     
  idle_timeout: 20,
  connect_timeout: 30,                
}

const client = globalThis.pgClient || postgres(connectionString, connectionOptions)

if (!isProd) {
  globalThis.pgClient = client
}

export const db = drizzle(client, { schema })
