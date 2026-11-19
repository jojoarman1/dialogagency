import { lang } from 'next/root-params'

import { EN_DICTIONARY } from '@/config/dictionaries/en.constants'
import { EN_LEGAL } from '@/config/dictionaries/en.legal.constants'
import { RU_DICTIONARY } from '@/config/dictionaries/ru.constants'
import { RU_LEGAL } from '@/config/dictionaries/ru.legal.constants'
import { DEFAULT_LOCALE, type Locale } from '@/config/locale.constants'

import { hasLocale } from './locale.utils'

// Server only (next/root-params): client components get their dictionary from DictionaryProvider,
// so a page ships one language, not both
const DICTIONARIES = { ru: RU_DICTIONARY, en: EN_DICTIONARY } satisfies Record<Locale, unknown>
const LEGAL_DICTIONARIES = { ru: RU_LEGAL, en: EN_LEGAL } satisfies Record<Locale, unknown>

export const getDictionary = (locale: Locale) => DICTIONARIES[locale]

export const getLegalDictionary = (locale: Locale) => LEGAL_DICTIONARIES[locale]

// The page's language from its /[lang] segment, in any server component
export const getRequestLocale = async (): Promise<Locale> => {
  const value = await lang()
  return hasLocale(value) ? value : DEFAULT_LOCALE
}

export const getRequestDictionary = async () => getDictionary(await getRequestLocale())
