import { MEETING_SPRITES } from './meeting.sprites'
import type { Service, ServiceArt } from './services.types'
import { WEBSITE_SPRITES } from './website.sprites'

const PAPER_SHEET: ServiceArt = { background: '/services/paper.webp', isSheet: true }

export const SERVICES = [
  {
    id: 'brand-strategy',
    title: 'Стратегия бренда',
    art: {
      background: '/services/brand-strategy/background.webp',
      // Bigger than the paper and a little lower, over its edges; rises from below its place
      sprites: [
        {
          src: '/services/brand-strategy/foreground.webp',
          x: -0.07,
          y: -0.12,
          width: 1.14,
          from: 'bottom',
          depth: 1,
          delay: 0,
          travel: 1
        }
      ]
    }
  },
  {
    id: 'growth-strategy',
    title: 'Стратегия развития',
    art: { background: '/services/growth-strategy/table.webp', sprites: MEETING_SPRITES }
  },
  { id: 'identity', title: 'Айдентика', art: PAPER_SHEET },
  {
    id: 'web-design',
    title: 'Дизайн сайта',
    art: { background: '/services/web-design/page.webp', sprites: WEBSITE_SPRITES }
  },
  { id: 'web-development', title: 'Разработка сайта', art: PAPER_SHEET }
] as const satisfies readonly Service[]

export type ServiceId = (typeof SERVICES)[number]['id']
