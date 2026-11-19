import type { Dictionary } from './dictionaries/dictionary.types'

// Site paths without the language: localizePath adds it
export interface NavigationLink {
  labelKey: keyof Dictionary['nav']
  href: string
}

// TODO: point at the real sections once the pages exist
export const NAVIGATION_LINKS: NavigationLink[] = [
  { labelKey: 'works', href: '/#works' },
  { labelKey: 'services', href: '/#services' }
]

export const TELEGRAM_LINK = { label: 'Telegram', href: 'https://t.me/uhoce' }

// "Кто мы" has no section of its own: it leads to the hero, which says who we are. The last footer
// item (nav.start) opens the chat instead of leading somewhere
export const FOOTER_LINKS: NavigationLink[] = [
  { labelKey: 'about', href: '/' },
  ...NAVIGATION_LINKS,
  { labelKey: 'faq', href: '/#faq' }
]

export const FOOTER_ID = 'footer'
