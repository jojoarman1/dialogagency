import { useBoolean } from '@siberiacancode/reactuse'
import { useRef, useState } from 'react'

import { getChatAnswerGoal } from '@/config/analytics'
import { CHAT_FIRST_STEP_ID, CHAT_STEPS, type ChatOption, type ChatStepId } from '@/config/chat'
import { fillTemplate } from '@/lib/format'
import type { LeadAnswer } from '@/lib/lead.schema'
import { reachGoal } from '@/lib/metrika'

import { useDictionary } from './useDictionary'

// The conversation's answers and current step: answering moves on along the step's branch,
// editing an earlier answer goes back to it and drops everything after it
export const useChatSteps = () => {
  const { dictionary } = useDictionary()
  const [answers, setAnswers] = useState<LeadAnswer[]>([])
  const [stepId, setStepId] = useState<ChatStepId | null>(CHAT_FIRST_STEP_ID)
  const [selected, setSelected] = useState<string[]>([])
  const [isContactError, toggleContactError] = useBoolean()
  // Read by the step's reveal: an edited step shows its line at once, with the earlier answer
  const editRef = useRef({ isEditing: false, value: '' })

  const step = stepId ? CHAT_STEPS[stepId] : null

  const completeStep = (values: string[], next?: ChatStepId) => {
    if (!stepId || !step) return

    setAnswers(prevAnswers => [...prevAnswers, { stepId, values }])
    // Only picked options go to Metrika, as their language-independent ids: typed answers are
    // names and contacts
    reachGoal(getChatAnswerGoal(stepId), step.options ? { [stepId]: values.join(', ') } : undefined)
    setStepId(next ?? step.next ?? null)
    setSelected([])
    toggleContactError(false)
  }

  const selectOption = (option: ChatOption) => {
    if (!step?.isMultiselect) {
      completeStep([option.id], option.next)
      return
    }

    setSelected(prevSelected =>
      prevSelected.includes(option.id)
        ? prevSelected.filter(value => value !== option.id)
        : [...prevSelected, option.id]
    )
  }

  const applySelection = () => {
    if (selected.length) completeStep(selected)
  }

  const editAnswer = (index: number) => {
    const answer = answers[index]
    const answerStep = CHAT_STEPS[answer.stepId]

    editRef.current = {
      isEditing: true,
      value: answerStep.options ? '' : answer.values.join('')
    }
    setAnswers(prevAnswers => prevAnswers.slice(0, index))
    setStepId(answer.stepId)
    setSelected(answerStep.isMultiselect ? answer.values : [])
    toggleContactError(false)
  }

  const reset = () => {
    setAnswers([])
    setStepId(CHAT_FIRST_STEP_ID)
    setSelected([])
  }

  return {
    state: {
      answers,
      step,
      stepId,
      selected,
      isContactError,
      // The current step's line in the page's language, typed out by the reveal
      stepText: stepId ? dictionary.chat.steps[stepId].text : '',
      thanks: fillTemplate(dictionary.chat.thanks, { name: answers[0]?.values[0] ?? '' })
    },
    refs: { editRef },
    functions: {
      completeStep,
      selectOption,
      applySelection,
      editAnswer,
      reset,
      toggleContactError
    }
  }
}
