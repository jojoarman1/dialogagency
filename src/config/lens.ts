// How far the collage canvas reaches past its column on every side (fractions of the column's
// width / height): room for the cut-outs sticking out, the paper's spring overshoot and the parallax
export const LENS_OVERFLOW = { x: 0.23, y: 0.18 }

// The paper is inset in the column
export const LENS_BACKGROUND_INSET = 0.04

// The column is 469 of the 1920 artboard; for the plain <img> fallback without WebGL
export const LENS_IMAGE_SIZES = '25vw'
export const LENS_SPRITE_IMAGE_SIZES = '10vw'

// How far each layer drifts with the pointer, in canvas widths at the screen's edge: the cut-outs
// further than the paper (times their own depth), so they read as in front of it
export const LENS_PARALLAX = { background: 0.012, sprite: 0.035 }
// How quickly the drift catches up with the pointer (damp lambda, per second)
export const LENS_PARALLAX_DAMPING = 5

// The paper's lens bulge at rest (it flattens out completely), and how much rounder it starts
// while it comes in
export const LENS_PAPER_BULGE = { rest: 0, entering: 1.4 }

export const LENS_SPRITE_SIDES = ['left', 'right', 'top', 'bottom'] as const

// The collage coming in: the paper grows smoothly out of its own middle, then each cut-out comes
// in from its side after its own delay
export const LENS_ENTRANCE = {
  paperDuration: 1.4,
  paperEase: 'expo.out',
  cutoutDuration: 1,
  cutoutEase: 'expo.out',
  cutoutDelay: 0.25
}

// A cut-out on its way in travels this share of its own size (unless it sets its own), grows
// from `scale` and is fully opaque after `fade` of the way, so none of it lingers once it's out.
// One that comes out of another bulges by `emergeBulge` more at the start
export const LENS_SPRITE_ENTRANCE = { travel: 0.5, scale: 0.92, fade: 0.4, emergeBulge: 1.2 }

// The cut-outs' own lens bulge at rest, milder than the paper's entrance
export const LENS_SPRITE_BULGE = 0.07

// How far the paper is pushed along the mouse's flow, in paper sizes per unit of flow
export const LENS_FLOW_STRENGTH = 0.04

// The cut-outs leave in reverse order, their delays shortened by staggerScale to fit the exit
// Interactive cut-outs: hovered ones lift a little, pressed buttons squeeze, and a dragged one
// springs back to its place when let go. A press that moves further than dragThreshold px drags
export const LENS_INTERACTION = {
  lift: 0.03,
  press: 0.08,
  dragThreshold: 4,
  hover: { duration: 0.3, ease: 'power2.out' },
  pressIn: { duration: 0.1, ease: 'power2.out' },
  release: { duration: 0.9, ease: 'elastic.out(1, 0.45)' }
}

export const LENS_EXIT = { duration: 0.55, ease: 'power3.in', staggerScale: 0.4 }
