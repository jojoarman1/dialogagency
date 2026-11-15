import type gsap from 'gsap'

const CHAR_DELAY = 0.04
const CHAR_JITTER = 0.06
const WORD_PAUSE = 0.08
const PUNCTUATION_PAUSE = 0.3
const PUNCTUATION = /[.,!?:;]/

// Like a person typing: each character pops in at once, at an uneven pace, with a short break
// between words and a longer one after punctuation. An even fade per character reads as a wipe
export const addTyping = (
  timeline: gsap.core.Timeline,
  chars: Element[],
  onKeystroke: () => void
) => {
  let time = timeline.duration()
  for (const char of chars) {
    const text = char.textContent ?? ''
    timeline.set(char, { opacity: 1 }, time)
    if (text.trim()) timeline.call(onKeystroke, undefined, time)

    time += CHAR_DELAY + Math.random() * CHAR_JITTER
    if (text === ' ') time += WORD_PAUSE
    else if (PUNCTUATION.test(text)) time += PUNCTUATION_PAUSE
  }
}
