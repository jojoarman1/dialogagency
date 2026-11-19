import type { Metadata } from 'next'

import { LegalDocument } from '@/components/elements/legal/LegalDocument'
import { LEGAL_LINKS } from '@/config/legal'
import { getLegalDictionary, getRequestLocale } from '@/lib/dictionary.service'
import { getAlternates } from '@/lib/metadata.utils'

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getRequestLocale()
  return {
    title: getLegalDictionary(locale).consent.title,
    alternates: getAlternates(locale, LEGAL_LINKS.consent)
  }
}

export default async function ConsentPage() {
  const legal = getLegalDictionary(await getRequestLocale())
  return <LegalDocument legal={legal} document={legal.consent} />
}
