import { useGSAP } from '@gsap/react'
import { usePreferredReducedMotion } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

import { COVER_SCROLL_OVERSCAN } from '@/config/animation'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const PHOTO_SELECTOR = '[data-cover-photo]'
// The photo's travel either way, in its own heights (it is 1 + overscan covers tall)
const SHIFT_PERCENT = (COVER_SCROLL_OVERSCAN / 2 / (1 + COVER_SCROLL_OVERSCAN)) * 100

// The photo scrolls inside its cover, slower than the page, from the moment the cover's top enters
// the screen until its bottom leaves it
export const useCoverScroll = () => {
  const coverRef = useRef<HTMLDivElement>(null)
  const reduceMotion = usePreferredReducedMotion() === 'reduce'

  useGSAP(
    () => {
      if (reduceMotion) return

      gsap.fromTo(
        PHOTO_SELECTOR,
        { yPercent: -SHIFT_PERCENT },
        {
          yPercent: SHIFT_PERCENT,
          ease: 'none',
          scrollTrigger: {
            trigger: coverRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      )
    },
    { dependencies: [reduceMotion], scope: coverRef, revertOnUpdate: true }
  )

  return { refs: { coverRef } }
}
