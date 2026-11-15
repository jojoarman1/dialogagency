import type { LensSprite } from './lens.types'

const block = (name: string) => `/services/web-design/${name}.webp`

// A block rises a fifth of its height into place; the cards and buttons pop up a little more
const RISE = { from: 'bottom', travel: 0.2 } as const
const POP = { from: 'bottom', travel: 0.3 } as const

// "Дизайн сайта": a site's wireframe built up on a white page, top to bottom: the header, the first
// screen (picture, heading, text, button), a dark section with its cards, then the footer. Every
// block can be hovered and dragged like a layer in Figma; cards and buttons ride on their section,
// and the green buttons press. They come after their section and sit a little higher in depth
export const WEBSITE_SPRITES: readonly LensSprite[] = [
  {
    ...RISE,
    src: block('nav'),
    id: 'nav',
    label: 'Header',
    x: 0.064,
    y: 0.048,
    width: 0.872,
    depth: 0.45,
    delay: 0
  },
  {
    ...POP,
    src: block('nav-button'),
    parent: 'nav',
    label: 'Button',
    isPressable: true,
    x: 0.76,
    y: 0.071,
    width: 0.144,
    depth: 0.8,
    delay: 0.08
  },
  {
    ...RISE,
    src: block('hero-image'),
    label: 'Image',
    x: 0.064,
    y: 0.174,
    width: 0.3,
    depth: 0.6,
    delay: 0.12
  },
  {
    ...POP,
    src: block('heading'),
    label: 'Heading',
    x: 0.412,
    y: 0.186,
    width: 0.34,
    depth: 0.5,
    delay: 0.2
  },
  {
    ...RISE,
    src: block('text'),
    label: 'Text',
    x: 0.412,
    y: 0.24,
    width: 0.524,
    depth: 0.45,
    delay: 0.26
  },
  {
    ...POP,
    src: block('button'),
    label: 'Button',
    isPressable: true,
    x: 0.756,
    y: 0.417,
    width: 0.18,
    depth: 0.8,
    delay: 0.36
  },
  {
    ...RISE,
    src: block('band'),
    id: 'band',
    label: 'Section',
    x: 0.064,
    y: 0.51,
    width: 0.872,
    depth: 0.45,
    delay: 0.44
  },
  {
    ...POP,
    src: block('band-left'),
    parent: 'band',
    label: 'Card',
    x: 0.088,
    y: 0.529,
    width: 0.2,
    depth: 0.75,
    delay: 0.6
  },
  {
    ...POP,
    src: block('band-center'),
    parent: 'band',
    label: 'Content',
    x: 0.312,
    y: 0.529,
    width: 0.452,
    depth: 0.65,
    delay: 0.66
  },
  {
    ...POP,
    src: block('band-right'),
    parent: 'band',
    label: 'List',
    x: 0.788,
    y: 0.529,
    width: 0.124,
    depth: 0.7,
    delay: 0.72
  },
  {
    ...RISE,
    src: block('footer'),
    id: 'footer',
    label: 'Footer',
    x: 0.596,
    y: 0.873,
    width: 0.34,
    depth: 0.55,
    delay: 0.82
  },
  {
    ...POP,
    src: block('footer-button'),
    parent: 'footer',
    label: 'Button',
    isPressable: true,
    x: 0.804,
    y: 0.903,
    width: 0.096,
    depth: 0.85,
    delay: 0.9
  }
]
