'use client'

import clsx from 'clsx'

import { ArrowUpIcon } from '@/components/icon/ArrowUpIcon'
import { MinusIcon } from '@/components/icon/MinusIcon'
import { SITE_CONFIG } from '@/config/site'
import { useChat } from '@/hooks/useChat'
import { useChatForm } from '@/hooks/useChatForm'

import { ChatConsent } from './chat/ChatConsent'
import { ChatConversation } from './chat/ChatConversation'
import { ChatSendButton } from './chat/ChatSendButton'
import { SoundToggle } from './SoundToggle'
import { TileButton } from './TileButton'

const PANEL_ID = 'chat-panel'

const ICON_TILE_CLASS_NAME =
  'flex size-[calc(24*var(--text-unit))] items-center justify-center rounded-[calc(2.4*var(--text-unit))] bg-background/30 text-background'

export const Chat = () => {
  const chatForm = useChatForm()
  const chat = useChat({
    onContentShow: chatForm.functions.revealStep,
    onClosed: chatForm.functions.onClosed
  })
  const isSendSpread = chatForm.state.isSending || chatForm.state.isSendError

  return (
    <div ref={chat.refs.rootRef} className='font-sans'>
      {/* The blend goes on this fixed wrapper: it is the stacking context, so blending only the
          buttons inside it would mix them with its empty background */}
      <div className='fixed bottom-[calc(24*var(--text-unit)+var(--chat-footer-offset,0px))] left-[calc(24*var(--text-unit))] z-40 flex gap-[calc(6*var(--text-unit))] mix-blend-difference'>
        <TileButton
          ref={chat.refs.buttonRef}
          label='Начать диалог'
          icon={<ArrowUpIcon className='size-[calc(18*var(--text-unit))]' />}
          aria-controls={PANEL_ID}
          aria-expanded={chat.state.isOpen}
          onClick={chat.functions.open}
          data-own-sound
          variant='difference'
        />
        <SoundToggle
          ref={chat.refs.sideControlRef}
          variant='difference'
          className='max-lg:hidden'
        />
      </div>

      {/* The shadow sits outside the element that gets clipped, or the clip would cut it off. The
          radius here only sets the clip's open rounding: the inner layer has none, so its corners
          don't round before the clip does */}
      <section
        ref={chat.refs.panelRef}
        id={PANEL_ID}
        aria-label='Чат'
        className='invisible fixed top-[min(calc(106*var(--text-unit)+var(--chat-viewport-top,0px)),calc(100svh-324*var(--text-unit)-var(--chat-viewport-bottom,0px)-var(--chat-footer-offset,0px)))] bottom-[calc(24*var(--text-unit)+var(--chat-viewport-bottom,0px)+var(--chat-footer-offset,0px))] left-[calc(24*var(--text-unit))] z-50 w-[min(400px,calc(100vw-48*var(--text-unit)))] rounded-[calc(2.4*var(--text-unit))] drop-shadow-[0_0_calc(40*var(--text-unit))_rgb(0_0_0/0.4)] max-lg:drop-shadow-none max-lg:right-[calc(24*var(--text-unit))] max-lg:w-auto'
      >
        <div
          ref={chat.refs.clipRef}
          className='relative h-full bg-foreground text-background selection:bg-background selection:text-foreground'
        >
          {/* Starts over the button's arrow tile and follows the panel's corner while it expands */}
          <button
            ref={chat.refs.closeButtonRef}
            type='button'
            aria-label='Свернуть чат'
            onClick={chat.functions.close}
            data-own-sound
            className={clsx(
              ICON_TILE_CLASS_NAME,
              'absolute top-[calc(4.5*var(--text-unit))] right-[calc(4.5*var(--text-unit))] z-10 cursor-pointer focus-visible:outline-2 focus-visible:outline-background'
            )}
          >
            <ArrowUpIcon data-chat-arrow className='absolute size-[calc(18*var(--text-unit))]' />
            <MinusIcon
              data-chat-minus
              className='absolute w-[calc(16*var(--text-unit))] opacity-0'
            />
          </button>

          <div ref={chat.refs.contentRef} className='invisible relative h-full'>
            <div ref={chatForm.refs.bodyRef} className='flex h-full flex-col'>
              <p className='px-[calc(6*var(--text-unit))] pt-[calc(5*var(--text-unit))] pb-[10px] text-[calc(14*var(--text-unit))] leading-[calc(20*var(--text-unit))] tracking-[calc(-0.2*var(--text-unit))] capitalize'>
                To: {SITE_CONFIG.name}
              </p>

              <div
                ref={chatForm.refs.formRef}
                className='flex-1 overflow-y-auto px-[calc(12*var(--text-unit))] py-[20px] text-[max(18px,calc(20*var(--text-unit)))] leading-[1.6]'
              >
                <ChatConversation chatForm={chatForm} />
              </div>

              {!chatForm.state.step && <ChatConsent chatForm={chatForm} />}

              <div
                className={clsx(
                  'flex items-end justify-between px-[calc(12*var(--text-unit))] pt-[20px] pb-[calc(12*var(--text-unit))] transition-[gap]',
                  isSendSpread ? 'gap-0' : 'gap-[calc(16*var(--text-unit))]'
                )}
              >
                {/* Folds away while the button spreads over the row (sending, failed) */}
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className={clsx(
                    'overflow-hidden whitespace-nowrap text-[14px] leading-snug text-background/50 underline underline-offset-2 transition-[max-width,opacity]',
                    isSendSpread ? 'max-w-0 opacity-0' : 'max-w-[300px]'
                  )}
                >
                  <span aria-hidden='true'>↳ </span>
                  {SITE_CONFIG.email}
                </a>
                {/* The button shows the failure; screen readers also get the email to write to */}
                {chatForm.state.isSendError && (
                  <p role='alert' className='sr-only'>
                    Не получилось отправить. Попробуйте ещё раз или напишите нам на{' '}
                    {SITE_CONFIG.email}
                  </p>
                )}
                <ChatSendButton chatForm={chatForm} onThanksRead={chat.functions.close} />
              </div>
            </div>

            <p
              ref={chatForm.refs.thanksRef}
              className='invisible absolute inset-0 flex items-center justify-center px-[calc(6*var(--text-unit))] text-center text-[calc(20*var(--text-unit))]'
            >
              {chatForm.state.thanks}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
