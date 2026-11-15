import type { LensSprite } from './lens.types'

const seat = (name: string) => `/services/growth-strategy/${name}.webp`

// "Стратегия развития": a meeting seen from above around a white table the size of the paper, laid
// out like the design's reference. Each of the four pictures sits down from its own side at its
// own moment and drifts at its own depth. The left one reaches furthest over the table and drifts
// least: past it there is little room before the screen's edge
export const MEETING_SPRITES: readonly LensSprite[] = [
  { src: seat('top'), x: 0.353, y: -0.178, width: 0.295, from: 'top', depth: 1.25, delay: 0.3 },
  { src: seat('left'), x: -0.228, y: 0.078, width: 0.438, from: 'left', depth: 0.6, delay: 0.15 },
  { src: seat('right'), x: 0.8, y: 0.082, width: 0.402, from: 'right', depth: 1.15, delay: 0 },
  {
    src: seat('bottom'),
    x: 0.343,
    y: 0.939,
    width: 0.314,
    from: 'bottom',
    depth: 0.95,
    delay: 0.4
  }
]
