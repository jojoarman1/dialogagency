import clsx from 'clsx'

import { ArrowUpIcon } from '@/components/icon/ArrowUpIcon'
import { getChatSendStatus } from '@/config/chat'
import type { useChatForm } from '@/hooks/useChatForm'
import { useDictionary } from '@/hooks/useDictionary'

import { TileButton } from '../TileButton'

interface ChatSendButtonProps {
  chatForm: ReturnType<typeof useChatForm>
  onThanksRead: () => void
}

// While sending and after a failed send the button spreads over the whole row (the email beside it
// folds away) and says what is going on; a failure turns it red
export const ChatSendButton = ({ chatForm, onThanksRead }: ChatSendButtonProps) => {
  const { isSending, isSendError, canSend } = chatForm.state
  const status = getChatSendStatus(isSending, isSendError)
  const { dictionary } = useDictionary()

  return (
    // The wrapper grows instead of the button: the tile's own transition is for its press
    <div className={clsx('flex transition-[flex-grow]', status === 'idle' ? 'grow-0' : 'grow')}>
      <TileButton
        ref={chatForm.refs.sendRef}
        label={dictionary.chat.send[status]}
        icon={<ArrowUpIcon className='size-[calc(18*var(--text-unit))]' />}
        aria-busy={isSending}
        variant={status === 'error' ? 'danger' : 'light'}
        // Stays bright while the arrow flies; send() itself ignores a second click
        disabled={!canSend && !isSending}
        onClick={() => chatForm.functions.send(onThanksRead)}
        className='w-full shrink-0 justify-between disabled:pointer-events-none disabled:opacity-40'
      />
    </div>
  )
}
