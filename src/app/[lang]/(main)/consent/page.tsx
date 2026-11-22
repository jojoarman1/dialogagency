import type { Metadata } from 'next'

import { LegalDocument } from '@/components/elements/legal/LegalDocument'
import { LEGAL_LINKS } from '@/config/legal'
import { getLegalDictionary, getRequestLocale } from '@/lib/dictionary.service'
import { getAlternates } from '@/lib/metadata.utils'

const DESCRIPTIONS = {
  ru: 'Согласие на обработку персональных данных при отправке заявки через сайт студии dialog.',
  en: 'Consent to personal data processing when submitting a request through the dialog studio website.'
} as const

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getRequestLocale()
  return {
    title: getLegalDictionary(locale).consent.title,
    description: DESCRIPTIONS[locale],
    alternates: getAlternates(locale, LEGAL_LINKS.consent)
  }
}

export default async function ConsentPage() {
  const legal = getLegalDictionary(await getRequestLocale())
  return <LegalDocument legal={legal} document={legal.consent} />
}
