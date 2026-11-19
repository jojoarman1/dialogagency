import { useIntersectionObserver } from '@siberiacancode/reactuse'
import { useState } from 'react'

import { FAQ_IDS, type FaqId } from '@/config/faq'

// The list's top has to come a third of the way up the screen, so the opening is seen
const AUTO_OPEN_ROOT_MARGIN = '0px 0px -35% 0px'

// One answer open at a time. None is open on load: the first opens by itself once the list is
// scrolled to, unless the visitor has already opened or closed one
export const useFaqList = () => {
  const [openId, setOpenId] = useState<FaqId | null>(null)
  const [shouldAutoOpen, setShouldAutoOpen] = useState(true)

  const listObserver = useIntersectionObserver<HTMLUListElement>({
    rootMargin: AUTO_OPEN_ROOT_MARGIN,
    enabled: shouldAutoOpen,
    onChange: entries => {
      if (!entries[0]?.isIntersecting) return
      setOpenId(FAQ_IDS[0])
      setShouldAutoOpen(false)
    }
  })

  const toggle = (id: FaqId) => {
    setShouldAutoOpen(false)
    setOpenId(prevId => (prevId === id ? null : id))
  }

  return {
    state: { openId },
    refs: { listRef: listObserver.ref },
    functions: { toggle }
  }
}
