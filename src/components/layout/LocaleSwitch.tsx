'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { type MouseEvent, useState } from 'react'

import { LOCALE_LABELS, LOCALES, type Locale } from '@/config/locale.constants'
import { useDictionary } from '@/hooks/useDictionary'
import { switchPathLocale } from '@/lib/locale.utils'

const LOCALE_SWITCH_VARIANTS = ['difference', 'onDark'] as const
type LocaleSwitchVariant = (typeof LOCALE_SWITCH_VARIANTS)[number]

// The thumb is the page's background colour with dark letters. 'difference' sits in the header
// bar, which blends as difference itself, so its colours are the inverse of what shows: black
// turns into the page colour, white into dark
const VARIANT_CLASS_NAMES: Record<
  LocaleSwitchVariant,
  { root: string; thumb: string; active: string }
> = {
  difference: { root: 'bg-white text-black', thumb: 'bg-black', active: 'text-white' },
  onDark: {
    root: 'bg-background/15 text-background',
    thumb: 'bg-background',
    active: 'text-foreground'
  }
}

interface LocaleSwitchProps {
  variant: LocaleSwitchVariant
  className?: string
}

interface PickedLocale {
  locale: Locale
  href: string
}

const isPlainClick = (event: MouseEvent) =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey

// A segmented control the size of the md tile buttons. Changing the language remounts the whole
// page (the root layout's [lang]), so the thumb travels first and the navigation waits for it,
// otherwise it jumps to the end mid-way
export const LocaleSwitch = ({ variant, className }: LocaleSwitchProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const { locale, dictionary } = useDictionary()
  const [picked, setPicked] = useState<PickedLocale | null>(null)
  const [pickedOnLocale, setPickedOnLocale] = useState(locale)

  // A locale change from elsewhere (browser back) wins over an old pick
  if (locale !== pickedOnLocale) {
    setPickedOnLocale(locale)
    setPicked(null)
  }

  const thumbLocale = picked?.locale ?? locale
  const classNames = VARIANT_CLASS_NAMES[variant]

  const handleClick = (event: MouseEvent, other: PickedLocale) => {
    if (other.locale === locale || !isPlainClick(event)) return
    event.preventDefault()
    setPicked(other)
  }

  return (
    <nav
      aria-label={dictionary.nav.languages}
      className={clsx(
        'relative grid auto-cols-fr grid-flow-col rounded-[calc(2.4*var(--text-unit))] p-[calc(4.5*var(--text-unit))] text-[calc(20*var(--text-unit))] leading-[calc(20*var(--text-unit))] tracking-[calc(-0.2*var(--text-unit))]',
        classNames.root,
        className
      )}
    >
      <span
        aria-hidden
        onTransitionEnd={() => {
          if (picked) router.push(picked.href)
        }}
        className={clsx(
          'absolute inset-y-[calc(4.5*var(--text-unit))] left-[calc(4.5*var(--text-unit))] rounded-[calc(2.4*var(--text-unit))] transition-[translate] duration-300 ease-smooth',
          classNames.thumb
        )}
        style={{
          width: `calc((100% - 9 * var(--text-unit)) / ${LOCALES.length})`,
          translate: `${LOCALES.indexOf(thumbLocale) * 100}% 0`
        }}
      />
      {LOCALES.map(other => {
        const href = switchPathLocale(pathname, other)

        return (
          <Link
            key={other}
            href={href}
            hrefLang={other}
            lang={other}
            aria-current={other === locale ? 'page' : undefined}
            onClick={event => handleClick(event, { locale: other, href })}
            className={clsx(
              'relative px-[calc(6*var(--text-unit))] py-[calc(2*var(--text-unit))] text-center transition-[color,opacity] duration-300',
              other === thumbLocale ? classNames.active : 'opacity-60 hover:opacity-100'
            )}
          >
            {LOCALE_LABELS[other]}
          </Link>
        )
      })}
    </nav>
  )
}
