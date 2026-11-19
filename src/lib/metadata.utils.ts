import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/config/locale.constants'

import { localizePath } from './locale.utils'

// A page's canonical address in its language and hreflang links to its other languages. The bare
// address (x-default) redirects by language, Russian when nothing matches
export const getAlternates = (locale: Locale, path: string) => ({
  canonical: localizePath(locale, path),
  languages: {
    ...Object.fromEntries(LOCALES.map(other => [other, localizePath(other, path)])),
    'x-default': localizePath(DEFAULT_LOCALE, path)
  }
})
