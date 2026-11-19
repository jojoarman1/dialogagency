'use client'

import type { ReactNode } from 'react'

import { DictionaryContext, type DictionaryValue } from '@/hooks/useDictionary'

interface DictionaryProviderProps extends DictionaryValue {
  children: ReactNode
}

export const DictionaryProvider = ({ locale, dictionary, children }: DictionaryProviderProps) => (
  <DictionaryContext value={{ locale, dictionary }}>{children}</DictionaryContext>
)
