import { MASTER_VOLUME, SOUND_SOURCES, SOUNDS, type Sound } from '@/config/sound.constants'
import { getIsSoundEnabled } from '@/stores/sound.store'

// Web Audio, not <audio>: no start delay (iOS), and fast repeats like typing overlap instead of
// cutting each other off
let context: AudioContext | null = null
let files: Promise<Map<string, ArrayBuffer>> | null = null
let decoding: Promise<void> | null = null
const buffers = new Map<Sound, AudioBuffer[]>()

const fetchFile = async (file: string) => {
  const response = await fetch(file)
  if (!response.ok) throw new Error(`Sound ${file}: ${response.status}`)
  return [file, await response.arrayBuffer()] as const
}

// Only downloads the bytes: an AudioContext made before a user gesture starts suspended and the
// browser warns about it, so decoding waits for unlockSounds
export const prefetchSounds = () => {
  files ??= Promise.all(SOUNDS.flatMap(sound => SOUND_SOURCES[sound].files).map(fetchFile)).then(
    entries => new Map(entries)
  )
  return files
}

const decodeSounds = async (audioContext: AudioContext) => {
  const bytes = await prefetchSounds()
  await Promise.all(
    SOUNDS.map(async sound => {
      const takes = await Promise.all(
        SOUND_SOURCES[sound].files.map(file => {
          const data = bytes.get(file)
          if (!data) throw new Error(`Sound ${file} was not fetched`)
          return audioContext.decodeAudioData(data)
        })
      )
      buffers.set(sound, takes)
    })
  )
}

// Browsers only allow audio after a user gesture, so this runs from the click that enables sound
export const unlockSounds = async () => {
  context ??= new AudioContext()
  if (context.state === 'suspended') await context.resume()
  decoding ??= decodeSounds(context).catch(error => {
    // Lets the next gesture try again instead of staying silent for the whole visit
    decoding = null
    files = null
    throw error
  })
  await decoding
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
