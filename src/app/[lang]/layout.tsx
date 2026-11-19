import type { Metadata, Viewport } from 'next'
import { Geist, IBM_Plex_Mono } from 'next/font/google'
import { notFound } from 'next/navigation'

import { CookieConsent } from '@/components/layout/CookieConsent'
import { DictionaryProvider } from '@/components/layout/DictionaryProvider'
import { GrainOverlay } from '@/components/layout/GrainOverlay'
import { LOCALES, OPEN_GRAPH_LOCALES } from '@/config/locale.constants'
import { SITE_CONFIG } from '@/config/site'
import { getDictionary, getRequestLocale } from '@/lib/dictionary.service'
import { hasLocale } from '@/lib/locale.utils'
import { getAlternates } from '@/lib/metadata.utils'

import '../globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'cyrillic']
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  // Only the "2026" caption and the 404 label use it, in the regular weight
  weight: '400',
  subsets: ['latin', 'cyrillic']
})

// A static file, not opengraph-image.png: that file convention can't take a translated alt
const OPEN_GRAPH_IMAGE = { url: '/og.png', width: 1200, height: 630 }

export const generateStaticParams = () => LOCALES.map(lang => ({ lang }))

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getRequestLocale()
  const { meta } = getDictionary(locale)
  const image = { ...OPEN_GRAPH_IMAGE, alt: meta.ogAlt }

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: { default: meta.title, template: `%s - ${SITE_CONFIG.name}` },
    description: meta.description,
    applicationName: SITE_CONFIG.name,
    alternates: getAlternates(locale, '/'),
    openGraph: {
      type: 'website',
      locale: OPEN_GRAPH_LOCALES[locale],
      alternateLocale: LOCALES.filter(other => other !== locale).map(
        other => OPEN_GRAPH_LOCALES[other]
      ),
      siteName: SITE_CONFIG.name,
      title: meta.title,
      description: meta.description,
      images: [image]
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [image]
    },
    // No index/follow: it would contradict the noindex Next.js adds to 404 pages
    robots: {
      googleBot: {
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1
      }
    }
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // The on-screen keyboard shrinks the layout, so fixed panels like the chat stay above it
  interactiveWidget: 'resizes-content',
  themeColor: SITE_CONFIG.themeColor,
  colorScheme: 'light'
}

export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params
  // proxy.ts puts a language in front of every path, so only a typed-in "/de" lands here
  if (!hasLocale(lang)) notFound()

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className='min-h-full flex flex-col'>
        <DictionaryProvider locale={lang} dictionary={getDictionary(lang)}>
          {children}
          <GrainOverlay />
          <CookieConsent />
        </DictionaryProvider>
      </body>
    </html>
  )
}
