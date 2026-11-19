// The order on the page; the questions and answers are in the dictionaries
export const FAQ_IDS = [
  'clients',
  'team',
  'timeline',
  'rebrand',
  'process',
  'start',
  'after-launch',
  'budget'
] as const
export type FaqId = (typeof FAQ_IDS)[number]

export interface FaqItem {
  id: FaqId
  question: string
  answer: string
}
