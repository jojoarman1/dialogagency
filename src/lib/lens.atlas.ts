import type { Rect } from './rect'

// A transparent gap around each image, so linear filtering at one's edge never picks up its
// neighbour
const PADDING = 2

// Packs the cut-outs side by side into one canvas, uploaded as a single texture. Returns each
// image's part of it in uv, bottom-up like the flipped upload
export const createSpriteAtlas = (images: readonly HTMLImageElement[]) => {
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(
    images.reduce((sum, image) => sum + image.naturalWidth + PADDING * 2, 0),
    1
  )
  canvas.height = Math.max(0, ...images.map(image => image.naturalHeight)) + PADDING * 2
  const context = canvas.getContext('2d')

  let x = PADDING
  const sources = images.map(image => {
    context?.drawImage(image, x, PADDING)
    const source: Rect = [
      x / canvas.width,
      1 - (PADDING + image.naturalHeight) / canvas.height,
      (x + image.naturalWidth) / canvas.width,
      1 - PADDING / canvas.height
    ]
    x += image.naturalWidth + PADDING * 2
    return source
  })

  return { canvas, sources }
}
