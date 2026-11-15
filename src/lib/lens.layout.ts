import { LENS_BACKGROUND_INSET, LENS_OVERFLOW } from '@/config/lens'
import type { LensSprite } from '@/config/lens.types'

import type { Box } from './lens.sprites'

// The paper's box in the canvas: the column sits inside it, past its overflow margins, and the
// paper keeps its own proportions, fitted into the inset column and centred. A sheet (no aspect)
// is stretched over the whole column instead
export const layoutPaper = (
  canvasWidth: number,
  canvasHeight: number,
  paperAspect: number | null
): Box => {
  const columnWidth = canvasWidth / (1 + LENS_OVERFLOW.x * 2)
  const columnHeight = canvasHeight / (1 + LENS_OVERFLOW.y * 2)
  const aspect = paperAspect ?? columnWidth / columnHeight
  const inset = paperAspect ? LENS_BACKGROUND_INSET : 0
  const width = Math.min(columnWidth * (1 - inset * 2), columnHeight * (1 - inset * 2) * aspect)
  const height = width / aspect

  return {
    x: columnWidth * LENS_OVERFLOW.x + (columnWidth - width) / 2,
    y: columnHeight * LENS_OVERFLOW.y + (columnHeight - height) / 2,
    width,
    height
  }
}

// Each cut-out's place at rest, from its fractions of the paper; its height follows the image
export const layoutSprites = (
  paper: Box,
  layers: readonly { sprite: LensSprite; image: HTMLImageElement }[]
): Box[] =>
  layers.map(({ sprite, image }) => {
    const width = paper.width * sprite.width
    return {
      x: paper.x + paper.width * sprite.x,
      y: paper.y + paper.height * sprite.y,
      width,
      height: (width * image.naturalHeight) / image.naturalWidth
    }
  })
