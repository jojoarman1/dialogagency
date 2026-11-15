// A mouse or trackpad: hover effects make sense. Touch screens get the in-view variants instead
export const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'

// A finger: no hover, and an on-screen keyboard that shouldn't pop up on its own
export const COARSE_POINTER_QUERY = '(pointer: coarse)'
