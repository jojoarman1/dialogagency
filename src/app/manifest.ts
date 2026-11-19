import type { MetadataRoute } from 'next'

import { RU_DICTIONARY } from '@/config/dictionaries/ru.constants'
import { DEFAULT_LOCALE } from '@/config/locale.constants'
import { SITE_CONFIG } from '@/config/site'
import { localizePath } from '@/lib/locale.utils'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.name,
    short_name: SITE_CONFIG.name,
    // One manifest for the installed app: it opens the main, Russian version
    description: RU_DICTIONARY.meta.description,
    lang: DEFAULT_LOCALE,
    start_url: localizePath(DEFAULT_LOCALE, '/'),
    display: 'standalone',
    background_color: SITE_CONFIG.themeColor,
    theme_color: SITE_CONFIG.themeColor,
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  }
}
