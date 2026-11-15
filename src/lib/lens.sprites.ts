import gsap from 'gsap'

import { LENS_INTERACTION, LENS_SPRITE_BULGE, LENS_SPRITE_ENTRANCE } from '@/config/lens'
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
const RAISED_LIFT = 0.01

const mix = (from: number, to: number, progress: number) => from + (to - from) * progress

// Where a cut-out is partway in: coming from its side and growing, or moving out of another
// cut-out's box into its own
const getEntranceBox = (rest: Box, sprite: LensSprite, progress: number, origin?: Box): Box => {
  if (origin) {
    return {
      x: mix(origin.x, rest.x, progress),
      y: mix(origin.y, rest.y, progress),
      width: mix(origin.width, rest.width, progress),
      height: mix(origin.height, rest.height, progress)
    }
  }
  const travel = (1 - progress) * (sprite.travel ?? LENS_SPRITE_ENTRANCE.travel)
  const scale = mix(LENS_SPRITE_ENTRANCE.scale, 1, progress)
  const direction = SIDE_DIRECTIONS[sprite.from]
  const width = rest.width * scale
  const height = rest.height * scale
  return {
    x: rest.x + (rest.width - width) / 2 + direction.x * travel * rest.width,
    y: rest.y + (rest.height - height) / 2 + direction.y * travel * rest.height,
    width,
    height
  }
}

// A cut-out's box, opacity and lens bulge: its entrance, then the hover lift and press about its
// middle, then its own drag plus the one of the cut-out it rides on. Coming out of another one, it
// bulges hard at first and straightens out on the way
export const placeSprite = (
  rest: Box,
  sprite: LensSprite,
  state: SpriteState,
  carried: SpriteState['drag'],
  origin?: Box
) => {
  const { progress } = state
  const entrance = getEntranceBox(rest, sprite, progress, origin)
  const scale =
    (1 + LENS_INTERACTION.lift * state.lift) * (1 - LENS_INTERACTION.press * state.press)
  const width = entrance.width * scale
  const height = entrance.height * scale

  const box: Box = {
    x: entrance.x + (entrance.width - width) / 2 + state.drag.x + carried.x,
    y: entrance.y + (entrance.height - height) / 2 + state.drag.y + carried.y,
    width,
    height
  }
  const emergeBulge = origin ? LENS_SPRITE_ENTRANCE.emergeBulge * (1 - progress) : 0
  return {
    box,
    alpha: clampProgress(progress / LENS_SPRITE_ENTRANCE.fade),
    bulge: LENS_SPRITE_BULGE + emergeBulge
  }
}

// The draw order: a lifted cut-out (hovered or dragged) and whatever rides on it go over the rest
export const orderSprites = (states: SpriteState[], carriers: number[]) => {
  const isRaised = (index: number) =>
    Math.max(states[index].lift, states[carriers[index]]?.lift ?? 0) > RAISED_LIFT
  return [...states.keys()].sort((a, b) => Number(isRaised(a)) - Number(isRaised(b)) || a - b)
}

// For each cut-out, the index of the one its `key` (parent, emergeFrom) names, or -1
export const findLinkedSprites = (sprites: readonly LensSprite[], key: 'parent' | 'emergeFrom') =>
  sprites.map(sprite => sprites.findIndex(other => !!sprite[key] && other.id === sprite[key]))
