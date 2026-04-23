import type { NextConfig } from 'next'

import { env } from '../env'
import { getPostHogHost } from './posthog-config'

export function withPostHog(nextConfig: Promise<NextConfig> | NextConfig): Promise<NextConfig> | NextConfig {
  const host = getPostHogHost()

  // 1. Skip if keys are missing
  // 2. Skip if we are on Windows (to avoid the posthog-cli binary error)
  // 3. Skip if we are not in production (local dev)
  const isWindows = process.platform === 'win32'
  const isProduction = process.env.NODE_ENV === 'production'

  if (!env.POSTHOG_API_KEY || !env.POSTHOG_ENV_ID || !host || isWindows || !isProduction) {
    return nextConfig
  }

  // We use require inside the function so it doesn't try to load the 
  // binary-dependent package unless we absolutely have to.
  const { withPostHogConfig } = require('@posthog/nextjs-config')

  return withPostHogConfig(async () => nextConfig, {
    personalApiKey: env.POSTHOG_API_KEY,
    envId: env.POSTHOG_ENV_ID,
    host,
  })
}