import type { LensSprite } from './lens.types'

const DEVELOPER = '/services/web-development/developer.webp'

// "Разработка сайта": the same developer three times in a row going back on a pink sheet, like
// the design's reference. The nearest one rises in first, then the other two come out of him,
// bulging, behind him; the nearer ones drift further with the pointer, so the row reads in depth
export const DEVELOPER_SPRITES: readonly LensSprite[] = [
  {
    src: DEVELOPER,
    emergeFrom: 'nearest',
    x: 0.461,
    y: 0.064,
    width: 0.549,
    from: 'bottom',
    depth: 0.5,
    delay: 0.55
  },
  {
    src: DEVELOPER,
    emergeFrom: 'nearest',
    x: 0.228,
    y: 0.181,
    width: 0.772,
    from: 'bottom',
    depth: 0.85,
    delay: 0.35
  },
  {
    src: DEVELOPER,
    id: 'nearest',
    x: 0,
    y: 0.388,
    width: 0.935,
    from: 'bottom',
    travel: 0.3,
    depth: 1.25,
    delay: 0
  }
]
