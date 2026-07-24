import type { NextConfig } from 'next'

export function withPostHog(nextConfig: Promise<NextConfig> | NextConfig): Promise<NextConfig> | NextConfig {
  // Safe pass-through wrapper to prevent requiring missing @posthog/nextjs-config package during build
  return nextConfig
}