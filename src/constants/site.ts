export const SITE_GITHUB_URL = 'https://github.com/braviaprime'
export const SITE_FACEBOOK_URL = 'https://www.facebook.com/toyyhiib'
export const SITE_INSTAGRAM_URL = 'https://www.facebook.com/braviaprime'
export const SITE_X_URL = 'https://x.com/Toyyhib'
export const SITE_YOUTUBE_URL = 'https://youtube.com/@toyyhib'

export const GITHUB_USERNAME = 'braviaprime'

export const MY_NAME = 'Olanrewaju Toyyib'

export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630
export const OG_IMAGE_TYPE = 'image/png'

export const AVATAR_MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
export const SUPPORTED_AVATAR_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export type AvatarMimeType = (typeof SUPPORTED_AVATAR_MIME_TYPES)[number]
