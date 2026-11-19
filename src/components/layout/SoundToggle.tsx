'use client'

import clsx from 'clsx'
import type { Ref } from 'react'

import { SoundIcon } from '@/components/icon/SoundIcon'
import { useDictionary } from '@/hooks/useDictionary'
import { playSound, unlockSounds } from '@/lib/sound.player'
import { setIsSoundEnabled, useIsSoundEnabled } from '@/stores/sound.store'

import { TILE_VARIANT_CLASS_NAMES, type TileVariant } from './tile.styles'

// The height and rounding of the md tile buttons it sits next to ("Меню", "Начать диалог")
const SOUND_TOGGLE_CLASS_NAME =
  'size-[calc(33*var(--text-unit))] justify-center rounded-[calc(2.4*var(--text-unit))]'

interface SoundToggleProps {
  variant: Extract<TileVariant, 'dark' | 'difference'>
  className?: string
  ref?: Ref<HTMLButtonElement>
}

export const SoundToggle = ({ variant, className, ref }: SoundToggleProps) => {
  const isSoundEnabled = useIsSoundEnabled()
  const { dictionary } = useDictionary()

  const toggle = async () => {
    if (isSoundEnabled) {
      setIsSoundEnabled(false)
      return
    }
    setIsSoundEnabled(true)
    await unlockSounds()
    playSound('toggleOn')
  }

  return (
    <button
      ref={ref}
      type='button'
      aria-label={isSoundEnabled ? dictionary.sound.off : dictionary.sound.on}
      aria-pressed={isSoundEnabled}
      onClick={toggle}
      data-own-sound
      className={clsx(
        // The tiles' press: a quick squeeze, then a spring back with a small overshoot
        'group pointer-events-auto flex cursor-pointer items-center transition-[opacity,scale] duration-600 ease-spring hover:opacity-70 active:scale-85 active:duration-100 active:ease-out',
        SOUND_TOGGLE_CLASS_NAME,
        TILE_VARIANT_CLASS_NAMES[variant].root,
        className
      )}
    >
      <SoundIcon className='size-[calc(18*var(--text-unit))]' />
    </button>
  )
}
