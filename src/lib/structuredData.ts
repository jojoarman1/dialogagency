import type { Dictionary } from '@/config/dictionaries/dictionary.types'
import { FAQ_IDS } from '@/config/faq'
import type { Locale } from '@/config/locale.constants'
import { TELEGRAM_LINK } from '@/config/navigation'
import { SERVICES } from '@/config/services'
import { SITE_CONFIG } from '@/config/site'

import { localizePath } from './locale.utils'

const ORGANIZATION_ID = `${SITE_CONFIG.url}/#organization`
const AVAILABLE_LANGUAGES = ['Russian', 'English']

// The home page's schema.org graph in its language
export const getHomeJsonLd = (locale: Locale, dictionary: Dictionary) => {
  const pageUrl = `${SITE_CONFIG.url}${localizePath(locale, '/')}`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORGANIZATION_ID,
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        logo: `${SITE_CONFIG.url}/web-app-manifest-512x512.png`,
        description: dictionary.meta.description,
        email: SITE_CONFIG.email,
        sameAs: [TELEGRAM_LINK.href],
        areaServed: { '@type': 'Country', name: dictionary.meta.country },
        founder: { '@type': 'Person', name: dictionary.testimonial.name, jobTitle: 'CEO' },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'sales',
          email: SITE_CONFIG.email,
          url: TELEGRAM_LINK.href,
          availableLanguage: AVAILABLE_LANGUAGES
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: dictionary.services.catalog,
          itemListElement: SERVICES.map(service => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: dictionary.services.titles[service.id] }
          }))
        }
      },
      {
        '@type': 'WebSite',
        '@id': `${pageUrl}#website`,
        name: SITE_CONFIG.name,
        url: pageUrl,
        inLanguage: locale,
        publisher: { '@id': ORGANIZATION_ID }
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_IDS.map(id => ({
          '@type': 'Question',
          name: dictionary.faq[id].question,
          acceptedAnswer: { '@type': 'Answer', text: dictionary.faq[id].answer }
        }))
      }
    ]
  }
}
