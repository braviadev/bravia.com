import type { SatoriOptions } from 'next/dist/compiled/@vercel/og/satori'

import { cache } from 'react'

const fetchGoogleFont = cache(async (font: string, text: string, weight = 400): Promise<ArrayBuffer> => {
  const cssURL = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@${weight}&text=${encodeURIComponent(text)}`

  const cssResponse = await fetch(cssURL, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
    },
  })

  const css = await cssResponse.text()

  const match = /src: url\((.+?)\) format\('(?:opentype|truetype|woff2)'\)/.exec(css) || /src: url\((.+?)\)/.exec(css)

  if (!match?.[1]) {
    throw new Error(`Failed to extract font URL for ${font}`)
  }

  const fontURL = match[1]
  const fontResponse = await fetch(fontURL)
  return await fontResponse.arrayBuffer()
})

export async function getOGImageFonts(title: string): Promise<SatoriOptions['fonts']> {
  const [regularFontData, mediumFontData, semiBoldFontData, notoSansTCData, notoSansSCData] =
    await Promise.all([
      fetchGoogleFont('Geist', title, 400),
      fetchGoogleFont('Geist', title, 500),
      fetchGoogleFont('Geist', title, 600),
      fetchGoogleFont('Noto Sans TC', title, 400),
      fetchGoogleFont('Noto Sans SC', title, 400),
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