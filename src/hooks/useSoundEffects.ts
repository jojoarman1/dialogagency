import { target, useEventListener } from '@siberiacancode/reactuse'
import { useRef } from 'react'

import { OWN_SOUND_SELECTOR } from '@/config/sound.constants'
import { playSound, unlockSounds } from '@/lib/sound.player'
import { getIsSoundEnabled } from '@/stores/sound.store'

const DOCUMENT_TARGET = target(() => document)
const INTERACTIVE_SELECTOR = 'a, button, [role="button"], label'
const DISABLED_SELECTOR = ':disabled, [aria-disabled="true"]'

const getInteractive = (eventTarget: EventTarget | null) => {
  const interactive =
    eventTarget instanceof Element ? eventTarget.closest(INTERACTIVE_SELECTOR) : null
  return interactive?.matches(DISABLED_SELECTOR) ? null : interactive
}

// One listener for the whole page instead of a handler on every link and button
export const useSoundEffects = () => {
  const hoveredRef = useRef<Element | null>(null)
  const clickedRef = useRef<Element | null>(null)
  const clickedAtRef = useRef(0)

  // Sound switched on in an earlier visit still needs a gesture before the browser plays it
  useEventListener(DOCUMENT_TARGET, 'pointerdown', () => {
    if (getIsSoundEnabled()) void unlockSounds()
  })

  useEventListener(DOCUMENT_TARGET, 'pointerover', (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return
    const interactive = getInteractive(event.target)
    // Moving between children of the same button must not tap again
    if (interactive === hoveredRef.current) return
    hoveredRef.current = interactive
    if (interactive) playSound('tap')
  })

  useEventListener(DOCUMENT_TARGET, 'click', (event: MouseEvent) => {
    const interactive = getInteractive(event.target)
    if (!interactive || interactive.closest(OWN_SOUND_SELECTOR)) return
    // A click on a label's text is passed on to its checkbox as a second click on the same label
    if (interactive === clickedRef.current && event.timeStamp - clickedAtRef.current < 50) return
    clickedRef.current = interactive
    clickedAtRef.current = event.timeStamp
    playSound('tap')
  })

  // `input`, not keydown: only real edits (typing, deleting, pasting) sound, not arrows or Tab.
  // Ticking a checkbox fires a plain Event here, typing an InputEvent
  useEventListener(DOCUMENT_TARGET, 'input', (event: Event) => {
    if (event instanceof InputEvent) playSound('type')
  })
}
