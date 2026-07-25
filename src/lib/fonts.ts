import type { SatoriOptions } from 'next/dist/compiled/@vercel/og/satori'

import { cache } from 'react'

const fetchGoogleFont = cache(
  async (font: string, text: string, weight = 400): Promise<ArrayBuffer | null> => {
    try {
      const cssURL = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@${weight}&text=${encodeURIComponent(text)}`

      // 🚨 Use an ancient Safari User-Agent to strictly force Google Fonts to return TTF
      const cssResponse = await fetch(cssURL, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
        },
      })

      if (!cssResponse.ok) return null

      const css = await cssResponse.text()

      // 🚨 Strictly capture ONLY truetype or opentype URLs (No loose fallbacks)
      const match = /src:\s*url\(['"]?([^'"]+)['"]?\)\s*format\(['"]?(truetype|opentype)['"]?\)/.exec(css)

      if (!match?.[1]) {
        console.warn(`Could not extract TTF font URL for ${font}`)
        return null
      }

      const fontURL = match[1]
      const fontResponse = await fetch(fontURL)

      if (!fontResponse.ok) return null

      const buffer = await fontResponse.arrayBuffer()

      // Final safety check to completely prevent Satori 'wOF2' crashes
      const header = new Uint8Array(buffer.slice(0, 4))
      const magic = String.fromCharCode(...header)
      
      if (magic === 'wOF2') {
        console.warn(`Google Fonts returned unsupported format (${magic}) for ${font}`)
        return null
      }

      return buffer
    } catch (error) {
      console.error(`Failed to fetch font ${font}:`, error)
      return null
    }
  },
)

export async function getOGImageFonts(title: string): Promise<SatoriOptions['fonts']> {
  const fontText = title + 'GuestbookBlogProjectsDashboard'

  const [regularFontData, mediumFontData, semiBoldFontData, notoSansTCData, notoSansSCData] =
    await Promise.all([
      fetchGoogleFont('Geist', fontText, 400),
      fetchGoogleFont('Geist', fontText, 500),
      fetchGoogleFont('Geist', fontText, 600),
      fetchGoogleFont('Noto Sans TC', fontText, 400),
      fetchGoogleFont('Noto Sans SC', fontText, 400),
    ])

  const fonts: SatoriOptions['fonts'] = []

  if (regularFontData) {
    fonts.push({ name: 'Geist Sans', data: regularFontData, style: 'normal', weight: 400 })
  }
  if (mediumFontData) {
    fonts.push({ name: 'Geist Sans', data: mediumFontData, style: 'normal', weight: 500 })
  }
  if (semiBoldFontData) {
    fonts.push({ name: 'Geist Sans', data: semiBoldFontData, style: 'normal', weight: 600 })
  }
  if (notoSansTCData) {
    fonts.push({ name: 'Noto Sans TC', data: notoSansTCData, style: 'normal', weight: 400 })
  }
  if (notoSansSCData) {
    fonts.push({ name: 'Noto Sans SC', data: notoSansSCData, style: 'normal', weight: 400 })
  }

  return fonts
}
