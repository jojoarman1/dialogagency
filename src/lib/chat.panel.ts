import gsap from 'gsap'

import {
  CHAT_LABEL_RISE,
  PANEL_CONTENT_DURATION,
  PANEL_CONTENT_EASE,
  PANEL_CONTENT_HIDE_DURATION,
  PANEL_CONTENT_OVERLAP,
  PANEL_EXPAND_DURATION,
  PANEL_EXPAND_EASE
} from '@/config/animation'

import { getButtonInset, getOpenInset, type MorphInset } from './morphPanel'

const ARROW_SELECTOR = '[data-chat-arrow]'
const MINUS_SELECTOR = '[data-chat-minus]'
// The button's label (RollingLabel) rises from under its line as the button comes back
const LABEL_SELECTOR = '[data-rolling-label]'

const EXPAND = { duration: PANEL_EXPAND_DURATION, ease: PANEL_EXPAND_EASE }

export interface PanelMorphParams {
  panel: HTMLElement
  button: HTMLElement
  content: HTMLElement | null
  // Sits next to the button and rides along to the open panel's side, keeping its gap
  sideControl: HTMLElement | null
  inset: MorphInset
  renderInset: () => void
}

// The button grows into the panel by its clip; its arrow tile turns into the close tile over the
// whole expansion, and the content comes in before the panel lands. Selectors resolve in the
// calling GSAP context's scope
export const createPanelOpening = (
  { panel, button, content, sideControl, inset, renderInset }: PanelMorphParams,
  onContentShow: () => void
) => {
  const timeline = gsap
    .timeline()
    .set(button, { autoAlpha: 0 })
    .set(panel, { autoAlpha: 1 })
    .to(inset, { ...getOpenInset(panel), ...EXPAND, onUpdate: renderInset })
    .to(ARROW_SELECTOR, { opacity: 0, ...EXPAND }, 0)
    .to(MINUS_SELECTOR, { opacity: 1, ...EXPAND }, 0)

  if (sideControl) {
    const shift = panel.getBoundingClientRect().right - button.getBoundingClientRect().right
    timeline.to(sideControl, { x: shift, ...EXPAND }, 0)
  }

  return timeline
    .to(
      content,
      { autoAlpha: 1, duration: PANEL_CONTENT_DURATION, ease: PANEL_CONTENT_EASE },
      `-=${PANEL_CONTENT_OVERLAP}`
    )
    .add(onContentShow, '<')
}

export const createPanelClosing = (
  { panel, button, content, sideControl, inset, renderInset }: PanelMorphParams,
  onClosed: () => void
) => {
  const timeline = gsap
    .timeline({ onComplete: onClosed })
    .to(content, { autoAlpha: 0, duration: PANEL_CONTENT_HIDE_DURATION })
    .to(inset, { ...getButtonInset(panel, button), ...EXPAND, onUpdate: renderInset })
    .to(MINUS_SELECTOR, { opacity: 0, ...EXPAND }, '<')
    .to(ARROW_SELECTOR, { opacity: 1, ...EXPAND }, '<')

  if (sideControl) timeline.to(sideControl, { x: 0, ...EXPAND }, '<')

  return timeline
    .set(panel, { autoAlpha: 0 })
    .set(button, { autoAlpha: 1 })
    .fromTo(
      button.querySelector(LABEL_SELECTOR),
      { yPercent: 110 },
      {
        yPercent: 0,
        ...CHAT_LABEL_RISE,
        // GSAP leaves translate: none inline, which would switch off the CSS hover roll for good
        clearProps: 'transform,translate'
      }
    )
}
