import Link from 'next/link'

import { Checkbox } from '@/components/ui/Checkbox'
import { LEGAL_LINKS } from '@/config/legal'
import type { useChatForm } from '@/hooks/useChatForm'
import { useDictionary } from '@/hooks/useDictionary'
import { localizePath } from '@/lib/locale.utils'

const LINK_CLASS_NAME = 'underline underline-offset-2 hover:text-background'

interface ChatConsentProps {
  chatForm: ReturnType<typeof useChatForm>
}

// 152-FZ: an unticked box the visitor ticks themselves; "Отправить" stays off until then
export const ChatConsent = ({ chatForm }: ChatConsentProps) => {
  const { locale, dictionary } = useDictionary()
  const texts = dictionary.chat.consent

  return (
    <label className='flex cursor-pointer items-start gap-[calc(8*var(--text-unit))] px-[calc(12*var(--text-unit))] text-[14px] leading-snug text-background/70'>
      <Checkbox
        checked={chatForm.state.isConsentGiven}
        onChange={() => chatForm.functions.toggleConsent()}
        className='mt-[2px] size-[16px] text-background'
      />
      <span>
        {texts.give}{' '}
        <Link
          href={localizePath(locale, LEGAL_LINKS.consent)}
          target='_blank'
          className={LINK_CLASS_NAME}
        >
          {texts.consentLink}
        </Link>{' '}
        {texts.accept}{' '}
        <Link
          href={localizePath(locale, LEGAL_LINKS.privacy)}
          target='_blank'
          className={LINK_CLASS_NAME}
        >
          {texts.policyLink}
        </Link>
      </span>
    </label>
  )
}
