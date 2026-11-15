// Cursor "flowmap", after supersolid.agency's hero logo: falloff 0.18, alpha 0.97, dissipation
// 0.965. The map is 8-bit (WebGL 1), so it stores flow / (2 * FLOW_RANGE) + 0.5
export const FLOW_DECODE = /* glsl */ `
  const float FLOW_RANGE = 2.0;

  vec2 decodeFlow(vec4 texel) {
    return (texel.rg - 0.5) * 2.0 * FLOW_RANGE;
  }
`

// Accumulates the pointer's velocity around the pointer and lets the whole map fade out
export const FLOW_FRAGMENT_SHADER = /* glsl */ `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  ${FLOW_DECODE}

  uniform sampler2D uFlow;
  uniform vec2 uPointer;
  uniform vec2 uVelocity;
  uniform float uAspect;
  varying vec2 vUv;

  const float FALLOFF = 0.18;
  const float ALPHA = 0.97;
  const float DISSIPATION = 0.965;
  // Beyond the fade: 8-bit steps would otherwise keep tiny values from ever reaching zero
  const float FLOOR = 0.01;

  void main() {
    vec2 flow = decodeFlow(texture2D(uFlow, vUv)) * DISSIPATION;
    flow = sign(flow) * max(abs(flow) - FLOOR, 0.0);

    vec2 delta = vUv - uPointer;
    delta.x *= uAspect;
    float influence = 1.0 - smoothstep(0.0, FALLOFF, length(delta));
    flow = clamp(flow + uVelocity * influence * ALPHA, -FLOW_RANGE, FLOW_RANGE);

    gl_FragColor = vec4(flow / (2.0 * FLOW_RANGE) + 0.5, 0.0, 1.0);
  }
`
