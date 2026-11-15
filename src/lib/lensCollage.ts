import { LENS_FLOW_STRENGTH, LENS_PAPER_BULGE, LENS_PARALLAX } from '@/config/lens'
import type { LensSprite } from '@/config/lens.types'

import { createSpriteAtlas } from './lens.atlas'
import { createLensFlow } from './lens.flow'
import { layoutPaper, layoutSprites } from './lens.layout'
import {
  type Box,
  findLinkedSprites,
  orderSprites,
  placeSprite,
  type SpriteState
} from './lens.sprites'
import { LENS_FRAGMENT_SHADER, LENS_MAX_SPRITES, LENS_UNIFORMS } from './lensShader'
import { boxToRect, type Rect, rectToBox, scaleRect, shiftRect } from './rect'
import { createQuadProgram, createTexture, drawQuad, switchProgram, uploadTexture } from './webgl'

const MAX_PIXEL_RATIO = 2
const NOT_CARRIED = { x: 0, y: 0 }
const UNITS = { background: 0, atlas: 1, flow: 2 }

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
  // The paper smears after the mouse (stir())
  hasFlow: boolean
}

export type LensCollage = NonNullable<ReturnType<typeof createLensCollage>>

// Draws the collage, each layer shifted by its own parallax depth and placed by its entrance.
// Nothing moves on its own: resize() lays it out, render() draws one frame of a view and returns
// where each cut-out ended up (canvas CSS px), for anything laid over them. Only a stirred flow
// runs frames by itself, until it settles.
// Returns null without WebGL, so the caller can show plain images
export const createLensCollage = (
  canvas: HTMLCanvasElement,
  { background, sprites, isSheet, hasFlow }: LensLayers
) => {
  const quad = createQuadProgram(canvas, LENS_FRAGMENT_SHADER, LENS_UNIFORMS)
  if (!quad) return null

  const { gl, uniforms } = quad
  const layers = sprites.slice(0, LENS_MAX_SPRITES)
  const atlas = createSpriteAtlas(layers.map(layer => layer.image))
  // Both created before either upload: createTexture binds to the active unit, so creating the
  // second one after the first upload would replace the first on unit 0
  const textures = [createTexture(gl), createTexture(gl)]
  uploadTexture(gl, textures[0], UNITS.background, background)
  uploadTexture(gl, textures[1], UNITS.atlas, atlas.canvas)
  gl.uniform1i(uniforms.uBackground, UNITS.background)
  gl.uniform1i(uniforms.uAtlas, UNITS.atlas)
  gl.uniform1i(uniforms.uFlow, UNITS.flow)
  gl.uniform1i(uniforms.uSpriteCount, layers.length)
  gl.uniform1f(uniforms.uFlowStrength, hasFlow ? LENS_FLOW_STRENGTH : 0)

  const layerSprites = layers.map(layer => layer.sprite)
  const carriers = findLinkedSprites(layerSprites, 'parent')
  const origins = findLinkedSprites(layerSprites, 'emergeFrom')
  const spriteRects = new Float32Array(LENS_MAX_SPRITES * 4)
  const spriteSources = new Float32Array(LENS_MAX_SPRITES * 4)
  const spriteAlphas = new Float32Array(LENS_MAX_SPRITES)
  const spriteBulges = new Float32Array(LENS_MAX_SPRITES)
  let backgroundRect: Rect = [0, 0, 1, 1]
  let spriteBoxes: Box[] = []
  let lastView: LensView | null = null

  const render = (view: LensView) => {
    lastView = view
    const { offset, paper } = view
    const { clientWidth, clientHeight } = canvas
    // A flow step may have switched to its own program
    switchProgram(gl, quad.program)
    // uv runs bottom-up, so a pointer lower on the screen moves the layers up
    const shift = (depth: number) => [-offset.x * depth, offset.y * depth] as const
    // The paper grows out of its own middle, starting rounder and flattening to its rest bulge as
    // it comes in
    const paperRect = shiftRect(
      scaleRect(backgroundRect, paper),
      ...shift(LENS_PARALLAX.background)
    )
    gl.uniform4f(uniforms.uBackgroundRect, ...paperRect)
    flow?.setPaperRect(paperRect)
    flow?.bind()

    const layout = layers.map(({ sprite }, index) => {
      const carried = view.sprites[carriers[index]]?.drag ?? NOT_CARRIED
      const origin = spriteBoxes[origins[index]]
      const placed = placeSprite(spriteBoxes[index], sprite, view.sprites[index], carried, origin)
      const rect = shiftRect(
        boxToRect(placed.box, clientWidth, clientHeight),
        ...shift(LENS_PARALLAX.sprite * sprite.depth)
      )
      return { ...placed, rect }
    })
    orderSprites(view.sprites, carriers).forEach((index, slot) => {
      spriteRects.set(layout[index].rect, slot * 4)
      spriteSources.set(atlas.sources[index], slot * 4)
      spriteAlphas[slot] = layout[index].alpha
      spriteBulges[slot] = layout[index].bulge
    })
    gl.uniform4fv(uniforms.uSpriteRects, spriteRects)
    gl.uniform4fv(uniforms.uSpriteSources, spriteSources)
    gl.uniform1fv(uniforms.uSpriteAlphas, spriteAlphas)
    gl.uniform1fv(uniforms.uSpriteBulges, spriteBulges)
    const bulgeFade = 1 - Math.min(paper, 1)
    gl.uniform1f(
      uniforms.uPaperBulge,
      LENS_PAPER_BULGE.rest + (LENS_PAPER_BULGE.entering - LENS_PAPER_BULGE.rest) * bulgeFade
    )
    drawQuad(gl)
    return layout.map(({ rect }) => rectToBox(rect, clientWidth, clientHeight))
  }

  const flow = hasFlow
    ? createLensFlow(canvas, UNITS.flow, () => lastView && render(lastView))
    : null

  const resize = () => {
    const pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO)
    const { clientWidth, clientHeight } = canvas
    canvas.width = Math.floor(clientWidth * pixelRatio)
    canvas.height = Math.floor(clientHeight * pixelRatio)
    const aspect = isSheet ? null : background.naturalWidth / background.naturalHeight
    const paper = layoutPaper(clientWidth, clientHeight, aspect)
    backgroundRect = boxToRect(paper, clientWidth, clientHeight)
    spriteBoxes = layoutSprites(paper, layers)
  }

  resize()
  const dispose = () => {
    flow?.dispose()
    for (const texture of textures) gl.deleteTexture(texture)
    quad.dispose()
  }

  // stir(): the pointer moved; the paper smears where it is, if this collage has a flow
  return { resize, render, dispose, stir: (x: number, y: number) => flow?.stir(x, y) }
}
