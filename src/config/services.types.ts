import type { LensSprite } from './lens.types'

// A service's picture is a lens collage: a background and transparent cut-outs laid over it (files
// in public/services/<id>/)
export interface ServiceArt {
  background: string
  sprites?: readonly LensSprite[]
  // A plain sheet covers the whole column (stretched: the paper's proportions differ from the
  // column's by ~2%, which doesn't show)
  isSheet?: boolean
  // With a mouse, the paper smears after it like liquid and settles back
  hasFlow?: boolean
}

export interface Service {
  id: string
  art: ServiceArt
}
