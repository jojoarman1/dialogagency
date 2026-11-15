import { useSyncExternalStore } from 'react'

import { SOUND_ENABLED_KEY } from '@/config/sound.constants'

const listeners = new Set<() => void>()
// Keeps the choice for this visit when the browser blocks localStorage
let isMemoryEnabled = false

const readIsEnabled = () => {
  try {
    const stored = localStorage.getItem(SOUND_ENABLED_KEY)
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
    localStorage.setItem(SOUND_ENABLED_KEY, isEnabled ? 'on' : 'off')
  } catch {}
  for (const listener of listeners) listener()
}

export const useIsSoundEnabled = () => useSyncExternalStore(subscribe, readIsEnabled, () => false)
