import { FLOW_DECODE } from './flow.shader'

export const LENS_MAX_SPRITES = 12

export const LENS_UNIFORMS = [
  'uBackground',
  'uAtlas',
  'uFlow',
  'uBackgroundRect',
  'uSpriteRects',
  'uSpriteSources',
  'uSpriteAlphas',
  'uSpriteBulges',
  'uSpriteCount',
  'uPaperBulge',
  'uFlowStrength'
] as const

// A collage seen through a lens: the paper and each cut-out are drawn into their own rect of the
// canvas and bulge like a barrel (the corners pulled in, so the edges bow out), with the colour
// channels split towards the rim. The cut-outs share one atlas texture and are composited over the
// paper in order. The paper can also smear after the mouse along a flow map, its colours split
// along the flow (uFlowStrength 0 switches that off)
export const LENS_FRAGMENT_SHADER = /* glsl */ `
  precision mediump float;

  #define MAX_SPRITES ${LENS_MAX_SPRITES}

  ${FLOW_DECODE}

  uniform sampler2D uBackground;
  uniform sampler2D uAtlas;
  uniform sampler2D uFlow;
  // Rects in canvas uv: xy = bottom-left, zw = top-right
  uniform vec4 uBackgroundRect;
  uniform vec4 uSpriteRects[MAX_SPRITES];
  // Each cut-out's part of the atlas, in the atlas' uv
  uniform vec4 uSpriteSources[MAX_SPRITES];
  uniform float uSpriteAlphas[MAX_SPRITES];
  // Each cut-out's own bulge: mild at rest, hard while it comes out of another one
  uniform float uSpriteBulges[MAX_SPRITES];
  uniform int uSpriteCount;
  // The paper's bulge, animated as it comes in
  uniform float uPaperBulge;
  uniform float uFlowStrength;
  varying vec2 vUv;

  const float ABERRATION = 0.12;
  // How far the flow splits the colours, as a share of how far it pushes the picture
  const float FLOW_SPLIT = 0.2;

  vec4 sampleChannel(sampler2D image, vec4 source, vec2 local, float bulge) {
    vec2 p = local - 0.5;
    // Normalised so the middle of each edge still reaches the rect's edge
    vec2 point = 0.5 + p * (1.0 + bulge * dot(p, p)) / (1.0 + bulge * 0.25);
    bool isInside = all(greaterThanEqual(point, vec2(0.0))) && all(lessThanEqual(point, vec2(1.0)));
    return isInside ? texture2D(image, mix(source.xy, source.zw, point)) : vec4(0.0);
  }

  // flow: how far the picture is pushed, in the layer's own units
  vec4 sampleLayer(sampler2D image, vec4 source, vec4 rect, float bulge, vec2 flow) {
    vec2 local = (vUv - rect.xy) / (rect.zw - rect.xy) - flow;
    vec2 split = flow * FLOW_SPLIT;
    vec4 red = sampleChannel(image, source, local + split, bulge * (1.0 + ABERRATION));
    vec4 green = sampleChannel(image, source, local, bulge);
    vec4 blue = sampleChannel(image, source, local - split, bulge * (1.0 - ABERRATION));
    float alpha = max(max(red.a, green.a), blue.a);
    // Premultiplied, so the split edges fade out instead of turning dark
    return vec4(red.r * red.a, green.g * green.a, blue.b * blue.a, alpha);
  }

  void main() {
    vec2 paperUv = (vUv - uBackgroundRect.xy) / (uBackgroundRect.zw - uBackgroundRect.xy);
    // Only inside the paper: past its edge the clamped map would drag paper out over the page
    float isOnPaper = step(0.0, paperUv.x) * step(paperUv.x, 1.0) * step(0.0, paperUv.y) * step(paperUv.y, 1.0);
    vec2 flow = decodeFlow(texture2D(uFlow, paperUv)) * uFlowStrength * isOnPaper;
    vec4 color = sampleLayer(
      uBackground, vec4(0.0, 0.0, 1.0, 1.0), uBackgroundRect, uPaperBulge, flow
    );
    for (int i = 0; i < MAX_SPRITES; i++) {
      if (i >= uSpriteCount) break;
      vec4 sprite = sampleLayer(
        uAtlas, uSpriteSources[i], uSpriteRects[i], uSpriteBulges[i], vec2(0.0)
      ) * uSpriteAlphas[i];
      color = sprite + color * (1.0 - sprite.a);
    }
    gl_FragColor = color;
  }
`
