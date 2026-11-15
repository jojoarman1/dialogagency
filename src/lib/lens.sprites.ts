import gsap from 'gsap'

import { LENS_INTERACTION, LENS_SPRITE_ENTRANCE } from '@/config/lens'
import type { LensSprite, LensSpriteSide } from '@/config/lens.types'

// In canvas CSS pixels, top-down
export interface Box {
  x: number
  y: number
  width: number
  height: number
}

// Everything that moves a cut-out, each tweened on its own: the entrance (0…1, already eased), a
// drag offset in px, the hover lift and the press (0…1)
export interface SpriteState {
  progress: number
  drag: { x: number; y: number }
  lift: number
  press: number
}

export const createSpriteState = (): SpriteState => ({
  progress: 0,
  drag: { x: 0, y: 0 },
  lift: 0,
  press: 0
})

const SIDE_DIRECTIONS: Record<LensSpriteSide, { x: number; y: number }> = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  top: { x: 0, y: -1 },
  bottom: { x: 0, y: 1 }
}

const clampProgress = gsap.utils.clamp(0, 1)

// A cut-out's box and opacity: it comes from its side, growing and fading in, then follows its own
// drag plus the one of the cut-out it rides on
export const placeSprite = (
  rest: Box,
  sprite: LensSprite,
  state: SpriteState,
  carried: SpriteState['drag']
) => {
  const { progress } = state
  const travel = (1 - progress) * (sprite.travel ?? LENS_SPRITE_ENTRANCE.travel)
  const scale =
    (LENS_SPRITE_ENTRANCE.scale + (1 - LENS_SPRITE_ENTRANCE.scale) * progress) *
    (1 + LENS_INTERACTION.lift * state.lift) *
    (1 - LENS_INTERACTION.press * state.press)
  const direction = SIDE_DIRECTIONS[sprite.from]
  const width = rest.width * scale
  const height = rest.height * scale

  const box: Box = {
    x:
      rest.x +
      (rest.width - width) / 2 +
      direction.x * travel * rest.width +
      state.drag.x +
      carried.x,
    y:
      rest.y +
      (rest.height - height) / 2 +
      direction.y * travel * rest.height +
      state.drag.y +
      carried.y,
    width,
    height
  }
  return { box, alpha: clampProgress(progress / LENS_SPRITE_ENTRANCE.fade) }
}
