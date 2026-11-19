'use client'

import Link from 'next/link'

import { FOOTER_LINKS } from '@/config/navigation'
import { useDictionary } from '@/hooks/useDictionary'
import { requestChatOpen } from '@/lib/chatEvents'
import { localizePath } from '@/lib/locale.utils'
import { handleSectionLinkClick } from '@/lib/scrollToSection'

import { RollingLabel } from './RollingLabel'

const ITEM_CLASS_NAME = 'border-b border-background/10'
const LINK_CLASS_NAME =
  'group flex w-full cursor-pointer py-[calc(14*var(--text-unit))] text-left text-[calc(48*var(--text-unit))] leading-none font-bold tracking-[-0.03em] transition-colors hover:text-background/60 max-lg:text-[calc(32*var(--text-unit))]'

export const FooterNav = () => {
  const { locale, dictionary } = useDictionary()

  return (
    <nav aria-label={dictionary.nav.footerMenu}>
      <ul>
        {FOOTER_LINKS.map(link => {
          const href = localizePath(locale, link.href)
          return (
            <li key={link.href} className={ITEM_CLASS_NAME}>
              <Link
                href={href}
                onClick={event => handleSectionLinkClick(event, href)}
                className={LINK_CLASS_NAME}
              >
                <RollingLabel label={dictionary.nav[link.labelKey]} />
              </Link>
            </li>
          )
        })}
        {/* The last item opens the chat instead of leading somewhere */}
        <li className={ITEM_CLASS_NAME}>
          <button type='button' onClick={requestChatOpen} className={LINK_CLASS_NAME}>
            <RollingLabel label={dictionary.nav.start} />
          </button>
        </li>
      </ul>
    </nav>
  )
}
