import { env } from '@/env'

export function getBaseUrl() {
  if (env.NEXT_PUBLIC_VERCEL_ENV === 'preview') return `https://${env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`

  // Ensures no trailing slash is returned and  // 🛠️ The Fix: Ensure there is NO trailing slash at the end
  const url = env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  return url.endsWith('/') ? url.slice(0, -1) : url
}