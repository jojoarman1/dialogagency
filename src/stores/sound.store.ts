import { useSyncExternalStore } from 'react'

import { SOUND_ENABLED_KEY } from '@/config/sound.constants'

const listeners = new Set<() => void>()
// Keeps the choice for this visit when the browser blocks storage
let isMemoryEnabled = false

// sessionStorage, not localStorage: every new visit starts muted, a reload or a language switch
// in the same tab keeps the choice
const readIsEnabled = () => {
  try {
    const stored = sessionStorage.getItem(SOUND_ENABLED_KEY)
    if (stored !== null) return stored === 'on'
  } catch {}
  return isMemoryEnabled
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const getIsSoundEnabled = readIsEnabled

export const setIsSoundEnabled = (isEnabled: boolean) => {
  isMemoryEnabled = isEnabled
  try {
    sessionStorage.setItem(SOUND_ENABLED_KEY, isEnabled ? 'on' : 'off')
  } catch {}
  for (const listener of listeners) listener()
}

export const useIsSoundEnabled = () => useSyncExternalStore(subscribe, readIsEnabled, () => false)
