import type { SocialProviders } from 'better-auth'
import type { NextRequest } from 'next/server'

import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { headers } from 'next/headers'

import { db } from '@/db'
import { env } from '@/env'
import { getBaseUrl } from '@/utils/get-base-url'

function getSocialProviders(): SocialProviders {
  const providers: SocialProviders = {}

  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    providers.google = {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }
  }

  if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
    providers.github = {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }
  }

  return providers
}

export const auth = betterAuth({
  // 🛠️ FIX 1: Better-Auth needs the full API path as the baseURL to find routes correctly
  baseURL: `${getBaseUrl()}/api/auth`, 
  
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
  }),

  // 🛠️ FIX 2: Explicitly trust your local environment to prevent 403 Forbidden errors
  trustedOrigins: [
    getBaseUrl(),
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ],

  socialProviders: getSocialProviders(),

  user: {
    additionalFields: {
      role: { type: 'string', required: true, input: false, defaultValue: 'user' },
    },
  },
})

export async function getSession(request?: NextRequest) {
  return auth.api.getSession({
    headers: request ? request.headers : await headers(),
  })
}