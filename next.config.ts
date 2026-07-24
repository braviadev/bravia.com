import type { NextConfig } from 'next'

import { withContentCollections } from '@content-collections/next'
import createNextIntlPlugin from 'next-intl/plugin'

import { env } from '@/env'
import { getPostHogProxyRewrites } from '@/lib/posthog-config'
import { withPostHog } from '@/lib/posthog-next'

import { IS_PRODUCTION } from '@/constants/common'

const withNextIntl = createNextIntlPlugin()

const remotePatterns: NonNullable<NextConfig['images']>['remotePatterns'] = [
  {
    protocol: 'https',
    hostname: 'avatars.githubusercontent.com',
  },
  {
    protocol: 'https',
    hostname: 'github.com',
  },
  {
    protocol: 'https',
    hostname: 'images.unsplash.com',
  },
  {
    protocol: 'https',
    hostname: '**.googleusercontent.com',
  },
]

if (!IS_PRODUCTION) {
  remotePatterns.push({
    protocol: 'http',
    hostname: 'localhost',
  })
}

if (env.CLOUDFLARE_R2_PUBLIC_URL) {
  try {
    const { hostname } = new URL(env.CLOUDFLARE_R2_PUBLIC_URL)
    remotePatterns.push({
      protocol: 'https',
      hostname,
    })
  } catch (error) {
    console.warn('Invalid CLOUDFLARE_R2_PUBLIC_URL provided in env:', error)
  }
}

const config: NextConfig = {
  // Prevent Next.js bundler from trying to resolve internal PostHog subpaths on the server
  serverExternalPackages: ['@posthog/core', 'posthog-node', 'posthog-js'],
  transpilePackages: ['posthog-js'],

  // Webpack alias to catch & bypass internal @posthog/core subpath resolution
  webpack: (webpackConfig) => {
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      '@posthog/core/process': false,
    }
    return webpackConfig
  },

  // Allowed network origins for dev server
  allowedDevOrigins: ['172.26.80.1'],

  reactCompiler: true,

  productionBrowserSourceMaps: true,

  typescript: {
    ignoreBuildErrors: !!env.CI,
  },

  images: {
    qualities: [75, 100],
    remotePatterns,
  },

  skipTrailingSlashRedirect: true,

  async rewrites() {
    return getPostHogProxyRewrites()
  },

  async redirects() {
    return [
      {
        source: '/pc-specs',
        destination: '/uses',
        permanent: true,
      },
      {
        source: '/atom',
        destination: '/rss.xml',
        permanent: true,
      },
      {
        source: '/feed',
        destination: '/rss.xml',
        permanent: true,
      },
      {
        source: '/rss',
        destination: '/rss.xml',
        permanent: true,
      },
    ]
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

// Wrap with all plugins and export
export default withPostHog(withContentCollections(withNextIntl(config)))