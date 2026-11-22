import type { MetadataRoute } from 'next'

import { LEGAL_LINKS } from '@/config/legal'
import { DEFAULT_LOCALE, LOCALES } from '@/config/locale.constants'
import { SITE_CONFIG } from '@/config/site'
import { localizePath } from '@/lib/locale.utils'

const PAGES = [
  { path: '/', priority: 1 },
  { path: LEGAL_LINKS.privacy, priority: 0.2 },
  { path: LEGAL_LINKS.consent, priority: 0.2 }
]

// The date content was last meaningfully changed, so search engines trust the signal
const LAST_CONTENT_UPDATE = new Date('2026-11-23')

// Every page in every language, each listing its translations (hreflang)
export default function sitemap(): MetadataRoute.Sitemap {
  const toUrl = (path: string) => `${SITE_CONFIG.url}${path}`

  return PAGES.flatMap(page =>
    LOCALES.map(locale => ({
      url: toUrl(localizePath(locale, page.path)),
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: 'monthly' as const,
      priority: page.priority,
      alternates: {
        languages: {
          ...Object.fromEntries(
            LOCALES.map(other => [other, toUrl(localizePath(other, page.path))])
          ),
          'x-default': toUrl(localizePath(DEFAULT_LOCALE, page.path))
        }
      }
    }))
  )
}
