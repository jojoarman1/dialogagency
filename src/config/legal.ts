import { SITE_CONFIG } from './site'

export interface LegalSection {
  id: string
  title: string
  paragraphs: string[]
}

// The operator's details in every language; the name and status are in the legal dictionaries.
// The email doubles as the address for requests and consent withdrawals
export const LEGAL_OPERATOR = {
  inn: '740414283580',
  email: 'muhametdinov.work@gmail.com'
}

export const LEGAL_UPDATED_AT = '28.10.2026'

// Without the language: localizePath adds it
export const LEGAL_LINKS = { privacy: '/privacy', consent: '/consent' }

export const LEGAL_SITE_HOST = new URL(SITE_CONFIG.url).host
