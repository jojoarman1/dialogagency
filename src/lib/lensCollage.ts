import { LENS_PAPER_BULGE, LENS_PARALLAX } from '@/config/lens'
import type { LensSprite } from '@/config/lens.types'

import { createSpriteAtlas } from './lens.atlas'
import { layoutPaper, layoutSprites } from './lens.layout'
import { type Box, placeSprite, type SpriteState } from './lens.sprites'
import { LENS_FRAGMENT_SHADER, LENS_MAX_SPRITES } from './lensShader'
import { boxToRect, type Rect, rectToBox, scaleRect, shiftRect } from './rect'
import { createQuadProgram, createTexture, drawQuad, uploadTexture } from './webgl'

const MAX_PIXEL_RATIO = 2
const NOT_CARRIED = { x: 0, y: 0 }
const RAISED_LIFT = 0.01

// What a frame shows: the pointer offset for the parallax (-1…1 from the middle of the screen),
// how far the paper has come in (0 hidden, 1 in place) and each cut-out's own state, tweened on
// its own so an interrupted entrance or exit turns around from wherever it is
export interface LensView {
  offset: { x: number; y: number }
  paper: number
  sprites: SpriteState[]
}

export interface LensLayers {
  background: HTMLImageElement
  sprites: readonly { sprite: LensSprite; image: HTMLImageElement }[]
  isSheet: boolean
}

export type LensCollage = NonNullable<ReturnType<typeof createLensCollage>>

// Draws the collage, each layer shifted by its own parallax depth and placed by its entrance.
// Nothing moves on its own, so there is no frame loop: resize() lays it out, render() draws one
// frame of a view and returns where each cut-out ended up (canvas CSS px), for anything laid
// over them.
// Returns null without WebGL, so the caller can show plain images
export const createLensCollage = (
  canvas: HTMLCanvasElement,
  { background, sprites, isSheet }: LensLayers
) => {
  const quad = createQuadProgram(canvas, LENS_FRAGMENT_SHADER, [
    'uBackground',
    'uAtlas',
    'uBackgroundRect',
    'uSpriteRects',
    'uSpriteSources',
    'uSpriteAlphas',
    'uSpriteCount',
    'uPaperBulge'
  ] as const)
  if (!quad) return null

  const { gl, uniforms } = quad
  const layers = sprites.slice(0, LENS_MAX_SPRITES)
  const atlas = createSpriteAtlas(layers.map(layer => layer.image))
  // Both created before either upload: createTexture binds to the active unit, so creating the
  // second one after the first upload would replace the first on unit 0
  const textures = [createTexture(gl), createTexture(gl)]
  uploadTexture(gl, textures[0], 0, background)
  uploadTexture(gl, textures[1], 1, atlas.canvas)
  gl.uniform1i(uniforms.uBackground, 0)
  gl.uniform1i(uniforms.uAtlas, 1)
  gl.uniform1i(uniforms.uSpriteCount, layers.length)

  // The cut-out each one rides on when that one is dragged
  const carriers = layers.map(({ sprite }) =>
    layers.findIndex(layer => !!sprite.parent && layer.sprite.id === sprite.parent)
  )
  const spriteRects = new Float32Array(LENS_MAX_SPRITES * 4)
  const spriteSources = new Float32Array(LENS_MAX_SPRITES * 4)
  const spriteAlphas = new Float32Array(LENS_MAX_SPRITES)
  let backgroundRect: Rect = [0, 0, 1, 1]
  let spriteBoxes: Box[] = []

  const render = (view: LensView) => {
    const { offset, paper } = view
    const { clientWidth, clientHeight } = canvas
    // uv runs bottom-up, so a pointer lower on the screen moves the layers up
    const shift = (depth: number) => [-offset.x * depth, offset.y * depth] as const
    // The paper grows out of its own middle, starting rounder and flattening to its rest bulge as
    // it comes in
    const paperRect = scaleRect(backgroundRect, paper)
    gl.uniform4f(
      uniforms.uBackgroundRect,
      ...shiftRect(paperRect, ...shift(LENS_PARALLAX.background))
    )
    const layout = layers.map(({ sprite }, index) => {
      const state = view.sprites[index]
      const carried = view.sprites[carriers[index]]?.drag ?? NOT_CARRIED
      const { box, alpha } = placeSprite(spriteBoxes[index], sprite, state, carried)
      const rect = shiftRect(
        boxToRect(box, clientWidth, clientHeight),
        ...shift(LENS_PARALLAX.sprite * sprite.depth)
      )
      return { rect, alpha }
    })
    // A lifted cut-out (hovered or dragged) and whatever rides on it are drawn over the rest
    const isRaised = (index: number) =>
      Math.max(view.sprites[index].lift, view.sprites[carriers[index]]?.lift ?? 0) > RAISED_LIFT
    const order = [...layers.keys()].sort(
      (a, b) => Number(isRaised(a)) - Number(isRaised(b)) || a - b
    )
    order.forEach((index, slot) => {
      spriteRects.set(layout[index].rect, slot * 4)
      spriteSources.set(atlas.sources[index], slot * 4)
      spriteAlphas[slot] = layout[index].alpha
    })
    gl.uniform4fv(uniforms.uSpriteRects, spriteRects)
    gl.uniform4fv(uniforms.uSpriteSources, spriteSources)
    gl.uniform1fv(uniforms.uSpriteAlphas, spriteAlphas)
    const bulgeFade = 1 - Math.min(paper, 1)
    gl.uniform1f(
      uniforms.uPaperBulge,
      LENS_PAPER_BULGE.rest + (LENS_PAPER_BULGE.entering - LENS_PAPER_BULGE.rest) * bulgeFade
    )
    drawQuad(gl)
    return layout.map(({ rect }) => rectToBox(rect, clientWidth, clientHeight))
  }

  const resize = () => {
    const pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO)
    canvas.width = Math.floor(canvas.clientWidth * pixelRatio)
    canvas.height = Math.floor(canvas.clientHeight * pixelRatio)

    const paper = layoutPaper(
      canvas.clientWidth,
      canvas.clientHeight,
      isSheet ? null : background.naturalWidth / background.naturalHeight
    )
    backgroundRect = boxToRect(paper, canvas.clientWidth, canvas.clientHeight)
    spriteBoxes = layoutSprites(paper, layers)
  }

  resize()
  const dispose = () => {
    for (const texture of textures) gl.deleteTexture(texture)
    quad.dispose()
  }

  return { resize, render, dispose }
}
