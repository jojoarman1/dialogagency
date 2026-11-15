import { LENS_OVERFLOW } from '@/config/lens'

// The collage canvas, and the controls laid over it, reach past the column on every side. Explicit
// size: left + right don't stretch a canvas
export const LENS_CANVAS_STYLE = {
  left: `${-LENS_OVERFLOW.x * 100}%`,
  top: `${-LENS_OVERFLOW.y * 100}%`,
  width: `${(1 + LENS_OVERFLOW.x * 2) * 100}%`,
  height: `${(1 + LENS_OVERFLOW.y * 2) * 100}%`
}
