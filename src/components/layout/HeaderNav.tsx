'use client'

import clsx from 'clsx'

import { ArrowUpIcon } from '@/components/icon/ArrowUpIcon'
import { NAVIGATION_LINKS, TELEGRAM_LINK } from '@/config/navigation'
import { useDictionary } from '@/hooks/useDictionary'
import { localizePath } from '@/lib/locale.utils'

import { HeaderLink } from './HeaderLink'
import { LocaleSwitch } from './LocaleSwitch'

// Like bymonolog.com: 20px medium, links touching, each padded 8px so the words sit 16px apart
const LINK_TEXT_CLASS_NAME =
  'text-[calc(20*var(--text-unit))] leading-[calc(25*var(--text-unit))] font-medium tracking-[-0.01em]'
const LINK_PADDING_CLASS_NAME = 'px-[calc(8*var(--text-unit))] py-[calc(3*var(--text-unit))]'

// From 1024px up the links sit in the header itself; the mobile layout opens them from "Меню"
export const HeaderNav = () => {
  const { locale, dictionary } = useDictionary()

  return (
    <>
      <nav aria-label={dictionary.nav.mainMenu} className='ml-auto max-lg:hidden'>
        <ul className={clsx('flex', LINK_TEXT_CLASS_NAME)}>
          {NAVIGATION_LINKS.map(link => (
            <li key={link.href}>
              <HeaderLink
                href={localizePath(locale, link.href)}
                label={dictionary.nav[link.labelKey]}
                className={LINK_PADDING_CLASS_NAME}
              />
            </li>
          ))}
        </ul>
      </nav>

      <div
        className={clsx(
          'ml-[calc(300*var(--text-unit))] flex items-center max-lg:hidden',
          LINK_TEXT_CLASS_NAME
        )}
      >
        <HeaderLink
          href={TELEGRAM_LINK.href}
          target='_blank'
          rel='noreferrer'
          label={TELEGRAM_LINK.label}
          className={LINK_PADDING_CLASS_NAME}
          // Cropped to the arrow itself
          icon={<ArrowUpIcon viewBox='3 3 12 12' className='size-[calc(11*var(--text-unit))]' />}
        />
        <LocaleSwitch
          variant='difference'
          className='pointer-events-auto ml-[calc(16*var(--text-unit))]'
        />
      </div>
    </>
  )
}
