import {
  target,
  useEventListener,
  useIntersectionObserver,
  useIsomorphicLayoutEffect,
  useMediaQuery,
  usePreferredReducedMotion
} from '@siberiacancode/reactuse'
import { useEffect, useRef, useState } from 'react'

import type { LensSprite } from '@/config/lens.types'
import { FINE_POINTER_QUERY } from '@/config/media'
import type { ServiceArt } from '@/config/services.types'
import { type Box, createSpriteState } from '@/lib/lens.sprites'
import { createLensCollage, type LensCollage, type LensView } from '@/lib/lensCollage'
import { loadImage } from '@/lib/loadImage'

import { useLensEntrance } from './useLensEntrance'
import { useLensInteraction } from './useLensInteraction'
import { useLensParallax } from './useLensParallax'

// Share of the collage on screen before it comes in
const IN_VIEW_THRESHOLD = 0.35
const PRELOAD_MARGIN = '300px 0px'
const WINDOW_TARGET = target(() => window)
// A stable empty list, so the entrance's dependencies don't change on every render
const NO_SPRITES: readonly LensSprite[] = []

// Keeps each control's box on its cut-out after every frame
const placeControls = (controls: (HTMLElement | null)[], boxes: Box[]) => {
  boxes.forEach((box, index) => {
    const control = controls[index]
    if (!control) return
    control.style.transform = `translate(${box.x}px, ${box.y}px)`
    control.style.width = `${box.width}px`
    control.style.height = `${box.height}px`
  })
}

export interface UseLensCollageParams {
  art: ServiceArt
  // The shown service: its collage comes in and follows the pointer
  isActive: boolean
}

// Loads the paper and the cut-outs and keeps the collage drawn at the canvas size; once it is the
// shown service and on screen, the entrance and the pointer parallax change the view and redraw
// it, and with a mouse its labelled cut-outs can be played with
export const useLensCollage = ({ art, isActive }: UseLensCollageParams) => {
  const sprites = art.sprites ?? NO_SPRITES
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controlRefs = useRef<(HTMLDivElement | null)[]>([])
  const collageRef = useRef<LensCollage>(null)
  // Starts hidden, so nothing flashes before the entrance plays
  const viewRef = useRef<LensView>({
    offset: { x: 0, y: 0 },
    paper: 0,
    sprites: sprites.map(createSpriteState)
  })
  const [isSupported, setIsSupported] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [hasApproached, setHasApproached] = useState(false)
  const isFinePointer = useMediaQuery(FINE_POINTER_QUERY)

  // Compile shaders and upload textures shortly before the collage reaches the screen.
  useIntersectionObserver(canvasRef, {
    rootMargin: PRELOAD_MARGIN,
    enabled: !hasApproached,
    onChange: ([entry]) => {
      if (entry.isIntersecting) setHasApproached(true)
    }
  })

  const redraw = () => {
    const boxes = collageRef.current?.render(viewRef.current)
    if (boxes) placeControls(controlRefs.current, boxes)
  }

  // WebGL and a ResizeObserver are external systems, which is what an effect is for
  useEffect(() => {
    if (!hasApproached) return
    const canvas = canvasRef.current
    if (!canvas) return
    let resizeObserver: ResizeObserver | undefined
    let isCancelled = false

    Promise.all([loadImage(art.background), ...sprites.map(sprite => loadImage(sprite.src))])
      .then(([background, ...spriteImages]) => {
        if (isCancelled) return
        const collage = createLensCollage(canvas, {
          background,
          sprites: sprites.map((sprite, index) => ({ sprite, image: spriteImages[index] })),
          isSheet: !!art.isSheet,
          hasFlow: !!art.hasFlow
        })
        if (!collage) {
          setIsSupported(false)
          return
        }
        collageRef.current = collage
        resizeObserver = new ResizeObserver(() => {
          collage.resize()
          placeControls(controlRefs.current, collage.render(viewRef.current))
        })
        resizeObserver.observe(canvas)
        setIsReady(true)
      })
      .catch(() => {
        if (!isCancelled) setIsSupported(false)
      })

    return () => {
      isCancelled = true
      resizeObserver?.disconnect()
      collageRef.current?.dispose()
      collageRef.current = null
    }
  }, [art, sprites, hasApproached])

  // Comes in when scrolled to, not as soon as the page loads; leaving and coming back replays it
  const intersectionObserver = useIntersectionObserver(canvasRef, { threshold: IN_VIEW_THRESHOLD })
  const isInView = !!intersectionObserver.entries?.[0]?.isIntersecting

  const isShown = isReady && isActive && isInView
  const isInteractive = isShown && isFinePointer && sprites.some(sprite => !!sprite.label)
  useLensEntrance({ viewRef, redraw, isPlaying: isShown, sprites })
  useLensParallax({ viewRef, redraw, isEnabled: isShown })
  const interaction = useLensInteraction({ viewRef, sprites, redraw })

  // The paper's liquid smear after the mouse
  const reduceMotion = usePreferredReducedMotion() === 'reduce'
  useEventListener(
    WINDOW_TARGET,
    'pointermove',
    (event: PointerEvent) => collageRef.current?.stir(event.clientX, event.clientY),
    { passive: true, enabled: isShown && isFinePointer && !reduceMotion && !!art.hasFlow }
  )

  // The controls mount at their origin; put them on their cut-outs at once
  useIsomorphicLayoutEffect(() => {
    if (isInteractive) redraw()
  }, [isInteractive])

  return {
    state: { isSupported, isInteractive },
    refs: { canvasRef, controlRefs },
    functions: interaction.functions
  }
}
