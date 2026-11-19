'use client'

import { CloseIcon } from '@/components/icon/CloseIcon'
import { NAVIGATION_LINKS } from '@/config/navigation'
import { useDictionary } from '@/hooks/useDictionary'
import type { useMenu } from '@/hooks/useMenu'
import { localizePath } from '@/lib/locale.utils'

import { LocaleSwitch } from '../LocaleSwitch'
import { TileButton } from '../TileButton'
import { MenuLink } from './MenuLink'
import { MenuReveal } from './MenuReveal'

export const MENU_PANEL_ID = 'menu-panel'

interface MenuPanelProps {
  menu: ReturnType<typeof useMenu>
}

// Mobile layout only: from 1024px up the links sit in the header itself (HeaderNav). It opens
// level with the header's menu button, 10 from the top, and is as tall as its content
export const MenuPanel = ({ menu }: MenuPanelProps) => {
  const { locale, dictionary } = useDictionary()

  return (
    <section
      ref={menu.refs.panelRef}
      id={MENU_PANEL_ID}
      aria-label={dictionary.nav.menu}
      className='invisible fixed top-[calc(10*var(--text-unit))] right-[calc(24*var(--text-unit))] left-[calc(59*var(--text-unit))] z-50 rounded-[calc(2.4*var(--text-unit))]'
    >
      <div
        ref={menu.refs.clipRef}
        className='relative bg-foreground text-background selection:bg-background selection:text-foreground'
      >
        <div
          ref={menu.refs.contentRef}
          className='invisible relative px-[calc(16*var(--text-unit))] pt-[calc(56*var(--text-unit))] pb-[calc(26*var(--text-unit))]'
        >
          <TileButton
            label={dictionary.nav.closeMenu}
            icon={<CloseIcon className='size-[calc(12*var(--text-unit))]' />}
            variant='light'
            onClick={menu.functions.close}
            tileClassName='hidden'
            className='absolute top-[calc(12*var(--text-unit))] right-[calc(14*var(--text-unit))] pr-[calc(8*var(--text-unit))]'
          />

          <nav aria-label={dictionary.nav.mainMenu}>
            <ul>
              {NAVIGATION_LINKS.map(link => (
                <li key={link.href} className='border-b border-dotted border-background/40'>
                  <MenuReveal>
                    <MenuLink
                      href={localizePath(locale, link.href)}
                      label={dictionary.nav[link.labelKey]}
                      onClick={menu.functions.close}
                    />
                  </MenuReveal>
                </li>
              ))}
            </ul>
          </nav>

          <MenuReveal className='mt-[calc(20*var(--text-unit))]'>
            <LocaleSwitch variant='onDark' className='w-fit' />
          </MenuReveal>
        </div>
      </div>
    </section>
  )
}
