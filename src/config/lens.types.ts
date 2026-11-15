import type { LENS_SPRITE_SIDES } from './lens'

export type LensSpriteSide = (typeof LENS_SPRITE_SIDES)[number]

// A cut-out over the paper. Its box is in fractions of the paper: x / width of the paper's width,
// y of its height; the height follows the image's proportions
export interface LensSprite {
  src: string
  x: number
  y: number
  width: number
  from: LensSpriteSide
  // Multiplies LENS_PARALLAX.sprite, so cut-outs at different depths drift apart
  depth: number
  // Seconds after the first cut-out starts coming in
  delay: number
  // Overrides LENS_SPRITE_ENTRANCE.travel
  travel?: number
  id?: string
  // The id of the cut-out this one rides on when that one is dragged (a card in its section)
  parent?: string
  // A name makes the cut-out interactive with a mouse: a Figma-like selection frame, dragging
  label?: string
  // Squeezes and springs back with a click when pressed, like a real button
  isPressable?: boolean
  // The id of the cut-out this one comes out of: it starts in that one's place and size, bulging
  // hard, and moves out to its own while straightening (instead of coming in from its side)
  emergeFrom?: string
}
