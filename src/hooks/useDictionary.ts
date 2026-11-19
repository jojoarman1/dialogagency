import { createContext, use } from 'react'

import type { Dictionary } from '@/config/dictionaries/dictionary.types'
import type { Locale } from '@/config/locale.constants'

export interface DictionaryValue {
  locale: Locale
  dictionary: Dictionary
}

// A plain context with a value prop, not reactuse's createContext: that one keeps its value in
// state from initialValue, so going from /ru to /en would keep the old language
export const DictionaryContext = createContext<DictionaryValue | null>(null)

// The page's language and its texts, in client components (server ones use dictionary.service)
export const useDictionary = () => {
  const value = use(DictionaryContext)
  if (!value) throw new Error('useDictionary must be used inside DictionaryProvider')
  return value
}
