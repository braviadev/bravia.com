import type { SatoriOptions } from 'next/dist/compiled/@vercel/og/satori'

import { cache } from 'react'

// Import fonts as raw ArrayBuffers directly so Turbopack bundles them automatically
// @ts-expect-error - Next.js/Turbopack handles binary imports via asset tracing
import geistRegular from '../../public/fonts/Geist-Regular.otf'
// @ts-expect-error - Next.js/Turbopack handles binary imports via asset tracing
import geistMedium from '../../public/fonts/Geist-Medium.otf'
// @ts-expect-error - Next.js/Turbopack handles binary imports via asset tracing
import geistSemiBold from '../../public/fonts/Geist-SemiBold.otf'

const getRegularFont = cache(async () => geistRegular as unknown as ArrayBuffer)
const getMediumFont = cache(async () => geistMedium as unknown as ArrayBuffer)
const getSemiBoldFont = cache(async () => geistSemiBold as unknown as ArrayBuffer)

const fetchGoogleFont = cache(async (font: string, text: string): Promise<ArrayBuffer> => {
  const cssURL = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}&text=${encodeURIComponent(text)}`

  const cssResponse = await fetch(cssURL, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
    },
  })

  const css = await cssResponse.text()

  const match = /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/.exec(css)

  if (!match?.[1]) {
    throw new Error('Failed to extract font URL from CSS')
  }

  const fontURL = match[1]
  const fontResponse = await fetch(fontURL)
  return await fontResponse.arrayBuffer()
})

export async function getOGImageFonts(title: string): Promise<SatoriOptions['fonts']> {
  const [regularFontData, mediumFontData, semiBoldFontData, notoSansTCData, notoSansSCData] =
    await Promise.all([
      getRegularFont(),
      getMediumFont(),
      getSemiBoldFont(),
      fetchGoogleFont('Noto Sans TC', title),
      fetchGoogleFont('Noto Sans SC', title),
    ])

  return [
    {
      name: 'Geist Sans',
      data: regularFontData,
      style: 'normal',
      weight: 400,
    },
    {
      name: 'Geist Sans',
      data: mediumFontData,
      style: 'normal',
      weight: 500,
    },
    {
      name: 'Geist Sans',
      data: semiBoldFontData,
      style: 'normal',
      weight: 600,
    },
    {
      name: 'Noto Sans TC',
      data: notoSansTCData,
      style: 'normal',
      weight: 400,
    },
    {
      name: 'Noto Sans SC',
      data: notoSansSCData,
      style: 'normal',
      weight: 400,
    },
  ]
}