import { useGSAP } from '@gsap/react'
import {
  useBoolean,
  useIsomorphicLayoutEffect,
  useLatest,
  useMutation,
  usePreferredReducedMotion
} from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { useRef } from 'react'

import { CHAT_GOALS } from '@/config/analytics'
import { CHAT_SELECTORS, focusAtEnd } from '@/lib/chat.dom'
import { createStepReveal, createThanksReveal } from '@/lib/chat.reveal'
import { sendLead } from '@/lib/lead.api'
import { reachGoal } from '@/lib/metrika'
import { playSound } from '@/lib/sound.player'

import { useChatInput } from './useChatInput'
import { useChatSteps } from './useChatSteps'

gsap.registerPlugin(useGSAP)

export const useChatForm = () => {
  const reduceMotion = usePreferredReducedMotion() === 'reduce'
  const steps = useChatSteps()
  const { answers, step, stepId } = steps.state
  const [isSent, toggleSent] = useBoolean()
  const [isConsentGiven, toggleConsent] = useBoolean()
  // onClosed may run from a closure created before sending (the auto-close after the thanks)
  const latestIsSent = useLatest(isSent)
  const leadMutation = useMutation(sendLead)

  const formRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const thanksRef = useRef<HTMLParagraphElement>(null)
  const inputRef = useRef<HTMLSpanElement>(null)
  const sendRef = useRef<HTMLButtonElement>(null)
  // Steps change only while the panel is shown; the first reveal comes from opening it
  const isShownRef = useRef(false)

  const input = useChatInput({
    formRef,
    inputRef,
    step,
    isContactError: steps.state.isContactError,
    toggleContactError: steps.functions.toggleContactError,
    onSubmit: value => steps.functions.completeStep([value])
  })

  const canSend = !isSent && !step && isConsentGiven && !leadMutation.isLoading

  const { context, contextSafe } = useGSAP({ scope: formRef })

  const revealStep = contextSafe(() => {
    isShownRef.current = true
    // Release earlier steps and their detached character spans, keeping the visible state.
    context.kill()

    if (!step) {
      sendRef.current?.focus()
      return
    }

    const inputElement = inputRef.current
    const edit = steps.refs.editRef.current
    if (inputElement && edit.value) inputElement.textContent = edit.value

    const timeline = createStepReveal({
      form: formRef.current,
      text: steps.state.stepText,
      isTyped: edit.isEditing,
      onComplete: () => {
        // A sudden on-screen keyboard or focus ring would get in the way on touch screens
        if (input.state.isTouch) return

        if (inputElement) focusAtEnd(inputElement)
        else formRef.current?.querySelector<HTMLElement>(CHAT_SELECTORS.option)?.focus()
      }
    })
    steps.refs.editRef.current = { isEditing: false, value: '' }
    if (reduceMotion) timeline.progress(1)
  })

  const latestRevealStep = useLatest(revealStep)
  useIsomorphicLayoutEffect(() => {
    if (isShownRef.current) latestRevealStep.ref.current()
  }, [answers.length, stepId, latestRevealStep.ref])

  const showThanks = contextSafe((onThanksRead: () => void) => {
    // A request may finish after the form has unmounted.
    if (!formRef.current) return
    toggleSent(true)

    context.kill()
    // Closing the panel must not attach its context to the form's context.
    createThanksReveal(bodyRef.current, thanksRef.current, () => context.ignore(onThanksRead))
  })

  const send = async (onThanksRead: () => void) => {
    if (!canSend) return

    reachGoal(CHAT_GOALS.send)
    try {
      await leadMutation.mutateAsync({ answers, consent: true })
    } catch {
      reachGoal(CHAT_GOALS.sendError)
      return
    }
    reachGoal(CHAT_GOALS.sent)
    playSound('notification')
    showThanks(onThanksRead)
  }

  const onClosed = contextSafe(() => {
    // Also stops a pending auto-close after sending when the chat was closed by hand
    context.kill()
    isShownRef.current = false
    if (!latestIsSent.ref.current) return

    steps.functions.reset()
    toggleSent(false)
    toggleConsent(false)
    gsap.set(bodyRef.current, { autoAlpha: 1 })
    gsap.set(thanksRef.current, { autoAlpha: 0 })
  })

  const { selectOption, applySelection, editAnswer } = steps.functions
  return {
    state: {
      ...steps.state,
      canSend,
      isSending: leadMutation.isLoading,
      // A retry hides the last error while it is sending
      isSendError: leadMutation.isError && !leadMutation.isLoading && !step,
      isConsentGiven
    },
    refs: { formRef, bodyRef, thanksRef, inputRef, sendRef },
    functions: {
      ...input.functions,
      revealStep,
      onClosed,
      selectOption,
      applySelection,
      editAnswer,
      send,
      toggleConsent
    }
  }
}
