import { useGSAP } from '@gsap/react'
import {
  target,
  useDisclosure,
  useEventListener,
  usePreferredReducedMotion
} from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { useRef } from 'react'

import { CHAT_GOALS, type MetrikaGoal } from '@/config/analytics'
import { useChatAutoOpen } from '@/hooks/useChatAutoOpen'
import { useChatFooterOffset } from '@/hooks/useChatFooterOffset'
import { useVisualViewportOffset } from '@/hooks/useVisualViewportOffset'
import { createPanelClosing, createPanelOpening, type PanelMorphParams } from '@/lib/chat.panel'
import { CHAT_OPEN_EVENT } from '@/lib/chatEvents'
import { reachGoal } from '@/lib/metrika'
import { getButtonInset, type MorphInset, toClipPath } from '@/lib/morphPanel'
import { playSound } from '@/lib/sound.player'

gsap.registerPlugin(useGSAP)

const WINDOW_TARGET = target(() => window)

export interface UseChatParams {
  onContentShow: () => void
  onClosed: () => void
}

export const useChat = ({ onContentShow, onClosed }: UseChatParams) => {
  const reduceMotion = usePreferredReducedMotion() === 'reduce'
  const panelDisclosure = useDisclosure()

  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const sideControlRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const clipRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline>(null)
  // Tweened as numbers: the browser shortens a zero inset() string, which breaks
  // GSAP's string interpolation and squares the corners
  const insetRef = useRef<MorphInset>({ top: 0, right: 0, bottom: 0, left: 0, radius: 0 })
  const hasOpenedRef = useRef(false)

  useVisualViewportOffset({ targetRef: panelRef, isEnabled: panelDisclosure.opened })
  useChatFooterOffset({ rootRef })

  const { context, contextSafe } = useGSAP({ scope: rootRef })

  const renderInset = contextSafe(() => {
    const clip = clipRef.current
    const closeButton = closeButtonRef.current
    if (!clip || !closeButton) return

    const inset = insetRef.current
    clip.style.clipPath = toClipPath(inset)
    closeButton.style.transform = `translate(${-inset.right}px, ${inset.top}px)`
  })

  const getMorphParams = (): PanelMorphParams | null => {
    const panel = panelRef.current
    const button = buttonRef.current
    if (!panel || !button) return null

    return {
      panel,
      button,
      content: contentRef.current,
      sideControl: sideControlRef.current,
      inset: insetRef.current,
      renderInset
    }
  }

  const playTimeline = contextSafe((timeline: gsap.core.Timeline) => {
    timelineRef.current?.kill()
    timelineRef.current = timeline
    if (reduceMotion) timeline.progress(1)
  })

  const openPanel = contextSafe((goal: MetrikaGoal) => {
    const morph = getMorphParams()
    if (!morph) return

    // Stop the previous transition without reverting its current position.
    context.kill()
    panelDisclosure.open()
    hasOpenedRef.current = true
    reachGoal(goal)
    playSound('transitionUp')

    // The panel size may have changed while it was hidden
    if (gsap.getProperty(morph.panel, 'visibility') === 'hidden') {
      Object.assign(insetRef.current, getButtonInset(morph.panel, morph.button))
      renderInset()
    }

    // The form owns its own animations; keep its context separate from the panel's.
    playTimeline(createPanelOpening(morph, () => context.ignore(onContentShow)))
  })

  const open = () => openPanel(CHAT_GOALS.open)

  // Someone who already opened the chat themselves isn't pushed into it again
  useChatAutoOpen({
    onReachEnd: () => {
      if (!hasOpenedRef.current) openPanel(CHAT_GOALS.autoOpen)
    }
  })

  const close = contextSafe(() => {
    const morph = getMorphParams()
    if (!morph) return

    context.kill()
    panelDisclosure.close()
    playSound('transitionDown')

    playTimeline(
      createPanelClosing(morph, () => {
        morph.button.focus()
        context.ignore(onClosed)
      })
    )
  })

  useEventListener(WINDOW_TARGET, CHAT_OPEN_EVENT, () => open())

  useEventListener(
    WINDOW_TARGET,
    'keydown',
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    },
    { enabled: panelDisclosure.opened }
  )

  return {
    state: { isOpen: panelDisclosure.opened },
    refs: { rootRef, buttonRef, sideControlRef, panelRef, clipRef, closeButtonRef, contentRef },
    functions: { open, close }
  }
}
