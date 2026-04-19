export const SITE_GITHUB_URL = 'https://github.com/braviadev'
export const SITE_FACEBOOK_URL = 'https://www.facebook.com/olanrewajutoyyiib'
export const SITE_INSTAGRAM_URL = 'https://www.instagram.com/bravia.ot'
export const SITE_X_URL = 'https://x.com/O_Toyyib'
export const SITE_YOUTUBE_URL = 'https://youtube.com/@olanrewajutoyyib'

export const GITHUB_USERNAME = 'braviadev'

export const MY_NAME = 'Olanrewaju Toyyib'

export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630
export const OG_IMAGE_TYPE = 'image/png'

export const AVATAR_MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
export const SUPPORTED_AVATAR_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export type AvatarMimeType = (typeof SUPPORTED_AVATAR_MIME_TYPES)[number]
