import { env } from '@/env'

type LocationResponse = {
  ip: string
  city: string
  region: string
  country: string
  countryCode: string
  latitude: number
  longitude: number
  timezone: string
  asn: number
  isp: string
}

export async function getLocation(ip: string): Promise<string | null> {
  try {
    const response = await fetch(`https://api.braviadev.dev/ip/geo?ip=${ip}`, {
      headers: {
        ...(env.OLANREWAJUTOYYIB_API_KEY && { 'x-api-key': env.OLANREWAJUTOYYIB_API_KEY }),
      },
    })

    if (!response.ok) throw new Error('Failed to fetch location')

    const data = (await response.json()) as LocationResponse

    const { country, region } = data

    return `${region}, ${country}`
  } catch {
    return null
  }
}
