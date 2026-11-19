import { type NextRequest, NextResponse } from 'next/server'

import {
  DEFAULT_LOCALE,
  LEGACY_PATHS,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE
} from '@/config/locale.constants'
import { getPathLocale, hasLocale, localizePath, matchAcceptLanguage } from '@/lib/locale.utils'

const PERMANENT_REDIRECT = 308
const TEMPORARY_REDIRECT = 307

// Every page lives under /ru or /en. A path without one goes to the language last opened here,
// else the browser's; the old /privacy and /consent move to Russian for good, keeping their
// search ranking. Opening a language remembers it
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathLocale = getPathLocale(pathname)
  const savedLocale = request.cookies.get(LOCALE_COOKIE)?.value

  if (pathLocale) {
    const response = NextResponse.next()
    if (savedLocale !== pathLocale) {
      response.cookies.set(LOCALE_COOKIE, pathLocale, {
        path: '/',
        maxAge: LOCALE_COOKIE_MAX_AGE,
        sameSite: 'lax'
      })
    }
    return response
  }

  const isLegacy = LEGACY_PATHS.includes(pathname)
  const preferredLocale = hasLocale(savedLocale)
    ? savedLocale
    : matchAcceptLanguage(request.headers.get('accept-language'))
  const url = request.nextUrl.clone()
  url.pathname = localizePath(isLegacy ? DEFAULT_LOCALE : preferredLocale, pathname)

  const response = NextResponse.redirect(url, isLegacy ? PERMANENT_REDIRECT : TEMPORARY_REDIRECT)
  // The bare address answers differently per visitor, so caches must not share one answer
  response.headers.set('Vary', 'Accept-Language, Cookie')
  return response
}

export const config = {
  // Not the API, Next's own files or anything with an extension (public files, sitemap, icons)
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
