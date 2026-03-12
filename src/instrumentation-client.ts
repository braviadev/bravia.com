import posthog from 'posthog-js'

import { env } from '@/lib/env'

if (env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: '/_ph',
    defaults: '2026-05-24',
  })
}
