import type { SatoriOptions } from 'next/dist/compiled/@vercel/og/satori'

import { cache } from 'react'

const fetchGoogleFont = cache(
  async (font: string, text: string, weight = 400): Promise<ArrayBuffer | null> => {
    try {
      const cssURL = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@${weight}&text=${encodeURIComponent(text)}`

      // Using an older Safari User-Agent forces Google Fonts to return TTF/OTF instead of WOFF2
      const cssResponse = await fetch(cssURL, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.1.2 Safari/603.3.8',
        },
      })

      if (!cssResponse.ok) return null

      const css = await cssResponse.text()

      // Match opentype / truetype format URLs from Google Fonts CSS
      const match =
        /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/.exec(css) ||
        /src: url\((.+?)\)/.exec(css)

      if (!match?.[1]) return null

      const fontURL = match[1]
      const fontResponse = await fetch(fontURL)

      if (!fontResponse.ok) return null

      const buffer = await fontResponse.arrayBuffer()

      // Verify magic bytes: Ensure it's true OTF/TTF (magic start OTTO or \x00\x01\x00\x00) and not HTML or wOF2
      const header = new Uint8Array(buffer.slice(0, 4))
      const magic = String.fromCharCode(...header)
      if (magic.startsWith('<') || magic === 'wOF2') {
        return null
      }

      return buffer
    } catch {
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