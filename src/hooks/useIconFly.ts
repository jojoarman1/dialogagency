import { useGSAP } from '@gsap/react'
import { useEventListener, usePreferredReducedMotion } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { type RefObject, useRef } from 'react'

import { createIconFlight, ICON_FLY_SELECTOR } from '@/lib/icon.flight'

gsap.registerPlugin(useGSAP)

export interface UseIconFlyParams {
  targetRef: RefObject<HTMLElement | null>
}

// On hover the [data-fly-icon] inside the target flies out of its clip and back. A started flight
// always finishes
export const useIconFly = ({ targetRef }: UseIconFlyParams) => {
  const reduceMotion = usePreferredReducedMotion() === 'reduce'
  const timelineRef = useRef<gsap.core.Timeline>(null)

  useGSAP(
    () => {
      const icon = targetRef.current?.querySelector(ICON_FLY_SELECTOR)
      if (icon) timelineRef.current = createIconFlight(icon, { paused: true })
    },
    { scope: targetRef }
  )

  useEventListener(targetRef, 'pointerenter', (event: PointerEvent) => {
    if (reduceMotion || event.pointerType !== 'mouse') return

    if (!timelineRef.current?.isActive()) timelineRef.current?.restart()
  })
}
