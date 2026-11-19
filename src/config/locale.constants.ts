export const LOCALES = ['ru', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'ru'

// The language last opened on the site (set by proxy.ts), so the bare address opens it again
export const LOCALE_COOKIE = 'dialog-locale'
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export const OPEN_GRAPH_LOCALES: Record<Locale, string> = { ru: 'ru_RU', en: 'en_US' }

export const LOCALE_LABELS: Record<Locale, string> = { ru: 'RU', en: 'EN' }

// Indexed before the site had languages; they move to the Russian version for good
export const LEGACY_PATHS = ['/privacy', '/consent']
