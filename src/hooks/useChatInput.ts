import {
  useAutoScroll,
  useEventListener,
  useMediaQuery,
  useResizeObserver
} from '@siberiacancode/reactuse'
import type { KeyboardEvent, RefObject } from 'react'

import { type ChatStep, getChatMaxLength, isChatContact } from '@/config/chat'
import { COARSE_POINTER_QUERY } from '@/config/media'
import { CHAT_SELECTORS, focusAtEnd } from '@/lib/chat.dom'

export interface UseChatInputParams {
  formRef: RefObject<HTMLDivElement | null>
  inputRef: RefObject<HTMLSpanElement | null>
  step: ChatStep | null
  isContactError: boolean
  toggleContactError: (value: boolean) => void
  onSubmit: (value: string) => void
}

// The typed answer: a contentEditable line that submits on Enter, keeps to the step's length,
// checks contacts, and stays reachable and in view inside the scrolling conversation
export const useChatInput = ({
  formRef,
  inputRef,
  step,
  isContactError,
  toggleContactError,
  onSubmit
}: UseChatInputParams) => {
  const isTouch = useMediaQuery(COARSE_POINTER_QUERY)

  const submitInput = () => {
    const value = inputRef.current?.innerText.trim()
    if (!step || !value) return

    if (step.isContact && !isChatContact(value)) {
      toggleContactError(true)
      return
    }

    onSubmit(value)
  }

  const onInputKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key !== 'Enter') return
    // Multiline answers take new lines from Shift+Enter, or from Enter on touch keyboards
    if (step?.isMultiline && (event.shiftKey || isTouch)) return

    event.preventDefault()
    submitInput()
  }

  const onInput = () => {
    if (isContactError) toggleContactError(false)

    // contentEditable has no maxlength
    const input = inputRef.current
    if (!input || !step) return
    const maxLength = getChatMaxLength(step)
    if (input.innerText.length <= maxLength) return

    input.textContent = input.innerText.slice(0, maxLength)
    focusAtEnd(input)
  }

  // The empty input is only a few pixels wide; a tap anywhere in the conversation reaches it
  useEventListener(formRef, 'click', (event: MouseEvent) => {
    const input = inputRef.current
    if (!input || !(event.target instanceof Element)) return
    if (event.target.closest(CHAT_SELECTORS.interactive)) return

    focusAtEnd(input)
  })

  // New lines and options appear at the bottom of the conversation
  useAutoScroll(formRef)

  // The on-screen keyboard shrinks the panel and would cover the input
  useResizeObserver(formRef, {
    onChange: () => {
      const form = formRef.current
      if (!form || document.activeElement !== inputRef.current) return

      form.scrollTo({ top: form.scrollHeight, behavior: 'smooth' })
    }
  })

  return {
    state: { isTouch },
    functions: { submitInput, onInputKeyDown, onInput }
  }
}
