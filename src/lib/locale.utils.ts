import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/config/locale.constants'

export const hasLocale = (value: string | undefined): value is Locale =>
  !!value && (LOCALES as readonly string[]).includes(value)

// The locale a path starts with ("/en/privacy" → "en"), if any
export const getPathLocale = (pathname: string) => {
  const segment = pathname.split('/')[1]
  return hasLocale(segment) ? segment : null
}

// A site path in a language: "/" → "/en", "/#works" → "/en#works", "/privacy" → "/en/privacy"
export const localizePath = (locale: Locale, path: string) => {
  const [pathname, hash] = path.split('#')
  const localized = `/${locale}${pathname === '/' ? '' : pathname}`
  return hash ? `${localized}#${hash}` : localized
}

// The same page in another language: "/ru/privacy" → "/en/privacy"
export const switchPathLocale = (pathname: string, locale: Locale) => {
  const rest = getPathLocale(pathname) ? pathname.split('/').slice(2).join('/') : ''
  return rest ? `/${locale}/${rest}` : `/${locale}`
}

// The first of the browser's languages (by q weight) the site has: "en-GB,en;q=0.9" → "en"
export const matchAcceptLanguage = (header: string | null): Locale => {
  const languages = (header ?? '')
    .split(',')
    .map(part => {
      const [tag, ...params] = part.trim().split(';')
      const quality = params.find(param => param.trim().startsWith('q='))
      return { tag: tag.toLowerCase(), weight: quality ? Number(quality.split('=')[1]) : 1 }
    })
    .sort((a, b) => b.weight - a.weight)

  return (
    languages.map(({ tag }) => tag.split('-')[0]).find(language => hasLocale(language)) ??
    DEFAULT_LOCALE
  )
}
