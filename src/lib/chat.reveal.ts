import gsap from 'gsap'

import { CHAT_CONTROLS_REVEAL, CHAT_OPTIONS_REVEAL, CHAT_THANKS } from '@/config/animation'

import { CHAT_SELECTORS, getHiddenChars, getHiddenElements } from './chat.dom'
import { addTyping } from './chat.typing'
import { playSound } from './sound.player'

interface StepRevealParams {
  form: HTMLElement | null
  text: string
  // An edited step was already typed once and shows its line at once
  isTyped: boolean
  onComplete: () => void
}

// Types out the step's line, then fades in its controls and options. Only the hidden ones play,
// so reopening the panel doesn't replay what is already shown
export const createStepReveal = ({ form, text, isTyped, onComplete }: StepRevealParams) => {
  const timeline = gsap.timeline({ onComplete })
  // Both collected before either fade-in hides anything
  const hiddenControls = getHiddenElements(form, CHAT_SELECTORS.control)
  const hiddenOptions = getHiddenElements(form, CHAT_SELECTORS.option)

  const title = form?.querySelector<HTMLElement>(CHAT_SELECTORS.title)
  if (title) {
    const hiddenChars = getHiddenChars(title, text)
    if (isTyped) gsap.set(hiddenChars, { opacity: 1 })
    else addTyping(timeline, hiddenChars, () => playSound('type'))
  }

  const fadeIn = (elements: HTMLElement[], vars: typeof CHAT_CONTROLS_REVEAL) => {
    if (elements.length) timeline.fromTo(elements, { autoAlpha: 0 }, { autoAlpha: 1, ...vars })
  }
  fadeIn(hiddenControls, CHAT_CONTROLS_REVEAL)
  fadeIn(hiddenOptions, CHAT_OPTIONS_REVEAL)

  return timeline
}

// The thanks replaces the form and stays long enough to read before onThanksRead
export const createThanksReveal = (
  body: HTMLElement | null,
  thanks: HTMLElement | null,
  onThanksRead: () => void
) => {
  const { duration, ease, hold } = CHAT_THANKS
  return gsap
    .timeline()
    .to(body, { autoAlpha: 0, duration, ease })
    .to(thanks, { autoAlpha: 1, duration, ease })
    .add(onThanksRead, `+=${hold}`)
}
