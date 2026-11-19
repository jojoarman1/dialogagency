import clsx from 'clsx'

import type { ChatStep, ChatStepId } from '@/config/chat'
import type { useChatForm } from '@/hooks/useChatForm'
import { useDictionary } from '@/hooks/useDictionary'

import { CHAT_HINT_CLASS_NAME, CHAT_NOTE_CLASS_NAME, CHAT_OPTION_CLASS_NAME } from './chat.styles'

interface ChatCurrentStepProps {
  stepId: ChatStepId
  step: ChatStep
  chatForm: ReturnType<typeof useChatForm>
}

export const ChatCurrentStep = ({ stepId, step, chatForm }: ChatCurrentStepProps) => {
  const { dictionary } = useDictionary()
  const texts = dictionary.chat
  const selectedCount = chatForm.state.selected.length

  if (step.options) {
    return (
      <>
        {step.options.map(option => (
          <button
            key={option.id}
            type='button'
            data-chat-option
            aria-pressed={
              step.isMultiselect ? chatForm.state.selected.includes(option.id) : undefined
            }
            onClick={() => chatForm.functions.selectOption(option)}
            className={CHAT_OPTION_CLASS_NAME}
          >
            {texts.options[option.id]}
          </button>
        ))}
        {step.isMultiselect && selectedCount > 0 ? (
          <button
            type='button'
            onClick={chatForm.functions.applySelection}
            className={CHAT_HINT_CLASS_NAME}
          >
            {texts.apply}
          </button>
        ) : null}
        {step.isMultiselect ? (
          // Kept mounted and only hidden, so it keeps its revealed state
          <span
            data-chat-option
            className={clsx(CHAT_NOTE_CLASS_NAME, selectedCount > 0 && 'hidden')}
          >
            {texts.several}
          </span>
        ) : null}
      </>
    )
  }

  return (
    <>
      <button
        type='button'
        aria-label={texts.reply}
        data-chat-control
        onClick={chatForm.functions.submitInput}
        className={clsx('invisible float-right ml-[6px]', CHAT_HINT_CLASS_NAME)}
      >
        [Enter]
      </button>
      {/* empty:ml-px keeps Chrome from collapsing the space before it */}
      {/* biome-ignore lint/a11y/useSemanticElements: an input can't wrap inline with the sentence */}
      <span
        ref={chatForm.refs.inputRef}
        role='textbox'
        aria-label={texts.steps[stepId].label}
        aria-multiline={step.isMultiline}
        aria-invalid={chatForm.state.isContactError}
        contentEditable='plaintext-only'
        inputMode={step.inputMode}
        enterKeyHint={step.isMultiline ? 'enter' : 'next'}
        autoCapitalize={step.inputMode === 'email' ? 'off' : 'sentences'}
        spellCheck={step.inputMode !== 'email'}
        tabIndex={0}
        data-chat-control
        onKeyDown={chatForm.functions.onInputKeyDown}
        onInput={chatForm.functions.onInput}
        className='invisible mr-[6px] break-all pr-[5px] outline-none empty:ml-px aria-invalid:rounded-[4px] aria-invalid:border aria-invalid:border-dashed aria-invalid:border-red-500 aria-invalid:px-[4px] aria-multiline:block aria-multiline:whitespace-pre-wrap'
      />
      {chatForm.state.isContactError ? (
        <span role='alert' className='block text-[14px] text-red-500'>
          {texts.contactError}
        </span>
      ) : null}
    </>
  )
}
