import { Fragment } from 'react'

import { CHAT_STEPS } from '@/config/chat'
import type { useChatForm } from '@/hooks/useChatForm'
import { useDictionary } from '@/hooks/useDictionary'
import { fillTemplate } from '@/lib/format'

import { ChatCurrentStep } from './ChatCurrentStep'
import { CHAT_ANSWER_CLASS_NAME } from './chat.styles'

const PARAGRAPH_GAP = <span aria-hidden='true' className='block h-[30px]' />

interface ChatConversationProps {
  chatForm: ReturnType<typeof useChatForm>
}

export const ChatConversation = ({ chatForm }: ChatConversationProps) => {
  const { dictionary } = useDictionary()
  const texts = dictionary.chat
  const options: Record<string, string> = texts.options
  const { step: currentStep, stepId } = chatForm.state

  return (
    <p>
      {chatForm.state.answers.map((answer, index) => {
        const step = CHAT_STEPS[answer.stepId]

        return (
          <Fragment key={answer.stepId}>
            {step.isNewParagraph ? PARAGRAPH_GAP : null}
            <span className='mr-[6px] select-none'>{texts.steps[answer.stepId].text}</span>
            {answer.values.map(value => {
              // Picked options are stored by id, typed answers as they are
              const text = step.options ? (options[value] ?? value) : value
              return (
                <button
                  key={value}
                  type='button'
                  aria-label={fillTemplate(texts.editAnswer, { value: text })}
                  onClick={() => chatForm.functions.editAnswer(index)}
                  className={CHAT_ANSWER_CLASS_NAME}
                >
                  {text}
                </button>
              )
            })}
          </Fragment>
        )
      })}

      {currentStep && stepId ? (
        <Fragment key={`current-${stepId}`}>
          {currentStep.isNewParagraph ? PARAGRAPH_GAP : null}
          <span className='sr-only'>{texts.steps[stepId].text}</span>
          {/* Filled by the typing animation. A space, not a margin: Safari ignores it for the caret */}
          <span aria-hidden='true' data-chat-title className='select-none' />{' '}
          <ChatCurrentStep stepId={stepId} step={currentStep} chatForm={chatForm} />
        </Fragment>
      ) : null}
    </p>
  )
}
