import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { type PointerEvent, type RefObject, useRef } from 'react'

import { LENS_INTERACTION } from '@/config/lens'
import type { LensSprite } from '@/config/lens.types'
import type { SpriteState } from '@/lib/lens.sprites'
import type { LensView } from '@/lib/lensCollage'
import { playSound } from '@/lib/sound.player'

gsap.registerPlugin(useGSAP)

export interface UseLensInteractionParams {
  viewRef: RefObject<LensView>
  sprites: readonly LensSprite[]
  redraw: () => void
}

interface Drag {
  index: number
  start: { x: number; y: number }
  origin: { x: number; y: number }
  isMoved: boolean
}

type ControlEvent = PointerEvent<HTMLElement>

const isPointerInside = (event: ControlEvent) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const { clientX: x, clientY: y } = event
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
}

// The labelled cut-outs under a mouse: hovered ones lift, a dragged one follows the pointer and
// springs back to its place when let go, and pressable ones squeeze and click like buttons. Their
// DOM controls only catch the pointer; the cut-outs themselves move in the WebGL view
export const useLensInteraction = ({ viewRef, sprites, redraw }: UseLensInteractionParams) => {
  const dragRef = useRef<Drag | null>(null)
  const { contextSafe } = useGSAP()

  const tween = contextSafe(
    (index: number, vars: Partial<Pick<SpriteState, 'lift' | 'press'>> & gsap.TweenVars) => {
      gsap.to(viewRef.current.sprites[index], { ...vars, overwrite: 'auto', onUpdate: redraw })
    }
  )

  const lift = (index: number, value: number) =>
    tween(index, { lift: value, ...LENS_INTERACTION.hover })

  const startDrag = contextSafe((index: number, event: ControlEvent) => {
    if (event.button !== 0) return
    const { drag } = viewRef.current.sprites[index]
    event.currentTarget.setPointerCapture(event.pointerId)
    gsap.killTweensOf(drag)
    dragRef.current = {
      index,
      start: { x: event.clientX, y: event.clientY },
      origin: { ...drag },
      isMoved: false
    }
    if (sprites[index].isPressable) tween(index, { press: 1, ...LENS_INTERACTION.pressIn })
  })

  const moveDrag = (event: ControlEvent) => {
    const current = dragRef.current
    if (!current) return
    const dx = event.clientX - current.start.x
    const dy = event.clientY - current.start.y
    if (!current.isMoved && Math.hypot(dx, dy) < LENS_INTERACTION.dragThreshold) return

    current.isMoved = true
    const { drag } = viewRef.current.sprites[current.index]
    drag.x = current.origin.x + dx
    drag.y = current.origin.y + dy
    redraw()
  }

  const endDrag = contextSafe((event: ControlEvent) => {
    const current = dragRef.current
    if (!current) return
    dragRef.current = null

    const { index, isMoved } = current
    if (sprites[index].isPressable) {
      tween(index, { press: 0, ...LENS_INTERACTION.release })
      if (!isMoved) playSound('tap')
    }
    gsap.to(viewRef.current.sprites[index].drag, {
      x: 0,
      y: 0,
      ...LENS_INTERACTION.release,
      onUpdate: redraw
    })
    // The pointer may have left it mid-drag; the capture held back the leave until now
    if (!isPointerInside(event)) lift(index, 0)
  })

  const getControlProps = (index: number) => ({
    onPointerEnter: () => lift(index, 1),
    onPointerLeave: () => {
      if (dragRef.current?.index !== index) lift(index, 0)
    },
    onPointerDown: (event: ControlEvent) => startDrag(index, event),
    onPointerMove: moveDrag,
    onPointerUp: endDrag,
    onPointerCancel: endDrag
  })

  return { functions: { getControlProps } }
}
