import { MASTER_VOLUME, SOUND_SOURCES, SOUNDS, type Sound } from '@/config/sound.constants'
import { getIsSoundEnabled } from '@/stores/sound.store'

// Web Audio, not <audio>: no start delay (iOS), and fast repeats like typing overlap instead of
// cutting each other off
let context: AudioContext | null = null
const buffers = new Map<Sound, AudioBuffer[]>()

const loadBuffer = async (audioContext: AudioContext, file: string) => {
  const response = await fetch(file)
  return audioContext.decodeAudioData(await response.arrayBuffer())
}

// Browsers only allow audio after a user gesture, so this runs from the click that enables sound
export const unlockSounds = async () => {
  context ??= new AudioContext()
  if (context.state === 'suspended') await context.resume()
  if (buffers.size > 0) return

  const audioContext = context
  await Promise.all(
    SOUNDS.map(async sound => {
      const takes = await Promise.all(
        SOUND_SOURCES[sound].files.map(file => loadBuffer(audioContext, file))
      )
      buffers.set(sound, takes)
    })
  )
}

export const playSound = (sound: Sound) => {
  const takes = buffers.get(sound)
  if (!context || !takes?.length || !getIsSoundEnabled()) return

  const source = context.createBufferSource()
  source.buffer = takes[Math.floor(Math.random() * takes.length)]
  const gain = context.createGain()
  gain.gain.value = SOUND_SOURCES[sound].volume * MASTER_VOLUME
  source.connect(gain).connect(context.destination)
  source.start()
}
