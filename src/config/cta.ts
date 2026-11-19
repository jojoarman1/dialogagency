export const CTA_WORD_EFFECTS = ['rise', 'cascade', 'focus', 'drop', 'flip', 'slide'] as const
export type CtaWordEffect = (typeof CTA_WORD_EFFECTS)[number]

export const CTA_WORD_IDS = [
  'start',
  'create',
  'impressions',
  'which',
  'surprise',
  'people'
] as const
export type CtaWordId = (typeof CTA_WORD_IDS)[number]

export interface CtaWord {
  id: CtaWordId
  effect: CtaWordEffect
}

export interface CtaLine {
  id: string
  words: CtaWord[]
  // The design's staircase: some lines step right, the last one sits at the right edge
  align: 'start' | 'indent' | 'end'
}

// Every word comes in its own way (useCtaReveal); the words themselves are in the dictionaries
export const CTA_LINES: CtaLine[] = [
  { id: 'start', align: 'start', words: [{ id: 'start', effect: 'rise' }] },
  { id: 'create', align: 'start', words: [{ id: 'create', effect: 'cascade' }] },
  { id: 'impressions', align: 'indent', words: [{ id: 'impressions', effect: 'focus' }] },
  {
    id: 'which',
    align: 'start',
    words: [
      { id: 'which', effect: 'drop' },
      { id: 'surprise', effect: 'flip' }
    ]
  },
  { id: 'people', align: 'end', words: [{ id: 'people', effect: 'slide' }] }
]
