// SND01 "sine" by Yasuhiro Tsuchiya (snd.dev): free for commercial use, credit appreciated
export const SOUNDS = [
  'tap',
  'type',
  'transitionUp',
  'transitionDown',
  'notification',
  'toggleOn'
] as const
export type Sound = (typeof SOUNDS)[number]

interface SoundSource {
  // Several takes of one sound; a random one plays, so repeats don't sound mechanical
  files: string[]
  volume: number
}

const takes = (name: string) =>
  [1, 2, 3, 4, 5].map(take => `/sounds/${name}_${String(take).padStart(2, '0')}.mp3`)

export const SOUND_SOURCES: Record<Sound, SoundSource> = {
  tap: { files: takes('tap'), volume: 0.35 },
  type: { files: takes('type'), volume: 0.25 },
  transitionUp: { files: ['/sounds/transition_up.mp3'], volume: 0.6 },
  transitionDown: { files: ['/sounds/transition_down.mp3'], volume: 0.6 },
  notification: { files: ['/sounds/notification.mp3'], volume: 0.7 },
  toggleOn: { files: ['/sounds/toggle_on.mp3'], volume: 0.6 }
}

export const SOUND_ENABLED_KEY = 'dialog:sound'

// Scales every sound's own volume
export const MASTER_VOLUME = 0.6

// Set on controls that play their own sound (the toggle, the chat button), so a click doesn't
// layer the generic one on top
export const OWN_SOUND_SELECTOR = '[data-own-sound]'
