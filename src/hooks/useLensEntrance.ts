import { useGSAP } from '@gsap/react'
import { usePreferredReducedMotion } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import type { RefObject } from 'react'

import { LENS_ENTRANCE, LENS_EXIT } from '@/config/lens'
import type { LensSprite } from '@/config/lens.types'
import type { LensView } from '@/lib/lensCollage'

gsap.registerPlugin(useGSAP)

export interface UseLensEntranceParams {
  viewRef: RefObject<LensView>
  redraw: () => void
  isPlaying: boolean
  sprites: readonly LensSprite[]
}

// Not reverted on update: that would snap the paper back to 0 mid-switch. Every tween starts from
// the current values, so cutting an entrance or exit short turns it around without a jump
export const useLensEntrance = ({ viewRef, redraw, isPlaying, sprites }: UseLensEntranceParams) => {
  const reduceMotion = usePreferredReducedMotion() === 'reduce'

  useGSAP(
    context => {
      // Release previous tweens without resetting the current entrance/exit position.
      context.kill()
      const view = viewRef.current
      const target = isPlaying ? 1 : 0

      if (reduceMotion) {
        view.paper = target
        for (const sprite of view.sprites) sprite.progress = target
        redraw()
        return
      }

      const delays = sprites.map(sprite => sprite.delay)
      const lastDelay = Math.max(0, ...delays)

      if (!isPlaying) {
        gsap.to(view, {
          paper: 0,
          duration: LENS_EXIT.duration,
          ease: LENS_EXIT.ease,
          onUpdate: redraw
        })
        // The last to sit down leaves first
        if (view.sprites.length) {
          gsap.to(view.sprites, {
            progress: 0,
            duration: LENS_EXIT.duration,
            ease: LENS_EXIT.ease,
            stagger: index => (lastDelay - delays[index]) * LENS_EXIT.staggerScale,
            onUpdate: redraw
          })
        }
        return
      }

      gsap.to(view, {
        paper: 1,
        duration: LENS_ENTRANCE.paperDuration,
        ease: LENS_ENTRANCE.paperEase,
        onUpdate: redraw
      })
      if (view.sprites.length) {
        gsap.to(view.sprites, {
          progress: 1,
          duration: LENS_ENTRANCE.cutoutDuration,
          ease: LENS_ENTRANCE.cutoutEase,
          delay: LENS_ENTRANCE.cutoutDelay,
          stagger: index => delays[index],
          onUpdate: redraw
        })
      }
    },
    { dependencies: [isPlaying, reduceMotion, sprites] }
  )
}
