'use client'

import { FAQ_IDS } from '@/config/faq'
import { useDictionary } from '@/hooks/useDictionary'
import { useFaqList } from '@/hooks/useFaqList'

import { FaqEntry } from './FaqEntry'

export const FaqList = () => {
  const faqList = useFaqList()
  const { faq } = useDictionary().dictionary

  return (
    <ul
      ref={faqList.refs.listRef}
      className='text-[calc(24*var(--text-unit))] leading-[calc(28*var(--text-unit))] max-lg:text-[calc(18*var(--text-unit))] max-lg:leading-[calc(24*var(--text-unit))]'
    >
      {FAQ_IDS.map(id => (
        <FaqEntry
          key={id}
          item={{ id, ...faq[id] }}
          isOpen={id === faqList.state.openId}
          onToggle={() => faqList.functions.toggle(id)}
        />
      ))}
    </ul>
  )
}
