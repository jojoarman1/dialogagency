import type { ChatOptionId, ChatSendStatus, ChatStepId } from '../chat'
import type { CtaWordId } from '../cta'
import type { FaqId } from '../faq'
import type { LegalSection } from '../legal'
import type { ProjectSlug } from '../projects'
import type { ServiceId } from '../services'

export interface ProjectTexts {
  title: string
  description: string
  metricLabel?: string
}

// Every visible text of the site in one language. Keys come from the configs' ids, so a missing
// translation fails to compile. "{name}"-style placeholders are filled with fillTemplate
export interface Dictionary {
  meta: { title: string; description: string; slogan: string; country: string; ogAlt: string }
  nav: {
    works: string
    services: string
    about: string
    faq: string
    start: string
    mainMenu: string
    footerMenu: string
    menu: string
    closeMenu: string
    languages: string
  }
  projects: {
    heading: string
    visitSite: string
    items: Record<ProjectSlug, ProjectTexts>
  }
  testimonial: { label: string; text: string; name: string; role: string }
  services: { heading: string; catalog: string; titles: Record<ServiceId, string> }
  faq: Record<FaqId, { question: string; answer: string }>
  cta: { words: Record<CtaWordId, string>; button: string; quote: string }
  chat: {
    open: string
    panel: string
    collapse: string
    steps: Record<ChatStepId, { text: string; label: string }>
    options: Record<ChatOptionId, string>
    apply: string
    several: string
    reply: string
    contactError: string
    editAnswer: string
    consent: { give: string; consentLink: string; accept: string; policyLink: string }
    send: Record<ChatSendStatus, string>
    sendErrorAlert: string
    thanks: string
  }
  sound: { on: string; off: string }
  cookies: { text: string; policyLink: string; accept: string; decline: string }
  footer: { privacy: string }
  notFound: { title: string; text: string }
}

export interface LegalDocumentText {
  title: string
  sections: LegalSection[]
}

// The legal pages, kept apart from Dictionary: only the server renders them
export interface LegalDictionary {
  operatorName: string
  updatedLabel: string
  operatorLabel: string
  // Shown on a translation: which version is legally binding
  translationNote?: string
  privacy: LegalDocumentText
  consent: LegalDocumentText
}
