import { FLOW_FRAGMENT_SHADER } from './flow.shader'
import type { Rect } from './rect'
import { createQuadProgram, createRenderTarget, drawQuad, switchProgram } from './webgl'

const FLOW_SIZE = 128
// Per-frame pointer smoothing and velocity, as on supersolid.agency
const POINTER_FOLLOW = 0.7
const VELOCITY_SCALE = 80
const VELOCITY_FOLLOW = 0.6
const VELOCITY_DAMPING = 0.85
// The flow has faded out this many frames after the last movement (0.965 per frame), so drawing
// can stop. Counted in frames, not time: a slow device draws fewer frames in the same time
const SETTLE_FRAMES = 150
// The pointer stirs the paper from a little past its edges too, in paper widths
const REACH = 0.2

export type LensFlow = NonNullable<ReturnType<typeof createLensFlow>>

// The paper's liquid smear after the mouse: a small flow map over the paper, fed its own last
// frame on every animation frame while the pointer moves and until the flow has faded out; then
// nothing runs. onFrame redraws the collage, which samples the map through bind()
export const createLensFlow = (canvas: HTMLCanvasElement, unit: number, onFrame: () => void) => {
  const quad = createQuadProgram(canvas, FLOW_FRAGMENT_SHADER, [
    'uFlow',
    'uPointer',
    'uVelocity',
    'uAspect'
  ] as const)
  if (!quad) return null

  const { gl, uniforms } = quad
  const targets = [
    createRenderTarget(gl, FLOW_SIZE, FLOW_SIZE),
    createRenderTarget(gl, FLOW_SIZE, FLOW_SIZE)
  ]
  // Encoded zero flow
  gl.clearColor(0.5, 0.5, 0, 1)
  for (const { framebuffer } of targets) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.clear(gl.COLOR_BUFFER_BIT)
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.clearColor(0, 0, 0, 0)

  const pointer = { x: 0.5, y: 0.5 }
  const target = { x: 0.5, y: 0.5 }
  const velocity = { x: 0, y: 0 }
  let paperRect: Rect = [0, 0, 1, 1]
  let frame = 0
  let framesSinceMove = 0

  const bind = () => {
    gl.activeTexture(gl.TEXTURE0 + unit)
    gl.bindTexture(gl.TEXTURE_2D, targets[0].texture)
  }

  const step = () => {
    const lastX = pointer.x
    const lastY = pointer.y
    pointer.x += (target.x - pointer.x) * POINTER_FOLLOW
    pointer.y += (target.y - pointer.y) * POINTER_FOLLOW
    velocity.x += ((pointer.x - lastX) * VELOCITY_SCALE - velocity.x) * VELOCITY_FOLLOW
    velocity.y += ((pointer.y - lastY) * VELOCITY_SCALE - velocity.y) * VELOCITY_FOLLOW
    velocity.x *= VELOCITY_DAMPING
    velocity.y *= VELOCITY_DAMPING

    const [x0, y0, x1, y1] = paperRect
    switchProgram(gl, quad.program)
    bind()
    gl.bindFramebuffer(gl.FRAMEBUFFER, targets[1].framebuffer)
    gl.uniform1i(uniforms.uFlow, unit)
    gl.uniform2f(uniforms.uPointer, pointer.x, pointer.y)
    gl.uniform2f(uniforms.uVelocity, velocity.x, velocity.y)
    gl.uniform1f(
      uniforms.uAspect,
      ((x1 - x0) * canvas.clientWidth) / ((y1 - y0) * canvas.clientHeight)
    )
    drawQuad(gl, FLOW_SIZE, FLOW_SIZE)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    targets.reverse()
  }

  const tick = () => {
    step()
    onFrame()
    framesSinceMove += 1
    frame = framesSinceMove > SETTLE_FRAMES ? 0 : requestAnimationFrame(tick)
  }

  const stir = (clientX: number, clientY: number) => {
    const box = canvas.getBoundingClientRect()
    const [x0, y0, x1, y1] = paperRect
    const x = ((clientX - box.left) / box.width - x0) / (x1 - x0)
    const y = (1 - (clientY - box.top) / box.height - y0) / (y1 - y0)
    if (x < -REACH || x > 1 + REACH || y < -REACH || y > 1 + REACH) return

    Object.assign(target, { x, y })
    framesSinceMove = 0
    if (frame) return
    // Coming back after a rest doesn't count as a swipe from wherever the pointer last was
    Object.assign(pointer, target)
    frame = requestAnimationFrame(tick)
  }

  const dispose = () => {
    cancelAnimationFrame(frame)
    for (const { texture, framebuffer } of targets) {
      gl.deleteFramebuffer(framebuffer)
      gl.deleteTexture(texture)
    }
    quad.dispose()
  }

  // setPaperRect: where the paper is drawn now (canvas uv), so the pointer lands on the right spot
  return { bind, stir, dispose, setPaperRect: (rect: Rect) => (paperRect = rect) }
}
