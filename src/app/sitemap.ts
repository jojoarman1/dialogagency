import type { MetadataRoute } from 'next'

import { LEGAL_LINKS } from '@/config/legal'
import { LOCALES } from '@/config/locale.constants'
import { SITE_CONFIG } from '@/config/site'
import { localizePath } from '@/lib/locale.utils'

const PAGES = [
  { path: '/', priority: 1 },
  { path: LEGAL_LINKS.privacy, priority: 0.2 },
  { path: LEGAL_LINKS.consent, priority: 0.2 }
]

// Every page in every language, each listing its translations (hreflang)
export default function sitemap(): MetadataRoute.Sitemap {
  const toUrl = (path: string) => `${SITE_CONFIG.url}${path}`

  return PAGES.flatMap(page =>
    LOCALES.map(locale => ({
      url: toUrl(localizePath(locale, page.path)),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map(other => [other, toUrl(localizePath(other, page.path))])
        )
      }
    }))
  )
}
