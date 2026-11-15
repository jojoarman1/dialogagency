import { DEVELOPER_SPRITES } from './developer.sprites'
import { MEETING_SPRITES } from './meeting.sprites'
import type { Service } from './services.types'
import { WEBSITE_SPRITES } from './website.sprites'

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
  // A sheet of well-known logos cut to the papers' 3:4, smearing after the mouse
  {
    id: 'identity',
    title: 'Айдентика',
    art: { background: '/services/identity/logos.webp', hasFlow: true }
  },
  {
    id: 'web-design',
    title: 'Дизайн сайта',
    art: { background: '/services/web-design/page.webp', sprites: WEBSITE_SPRITES }
  },
  {
    id: 'web-development',
    title: 'Разработка сайта',
    art: { background: '/services/web-development/paper.webp', sprites: DEVELOPER_SPRITES }
  }
] as const satisfies readonly Service[]

export type ServiceId = (typeof SERVICES)[number]['id']
