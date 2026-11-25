import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useI18n } from '../i18n/LanguageContext'
import { useSettings } from '../settings/SettingsContext'

/*
 * Read-aloud ("text to speech") using the browser's built-in Web Speech API.
 * No server, no API key – works offline when the device has a voice installed.
 *
 * Text is spoken as a queue of short segments (sentences). This lets the screen
 * highlight the sentence that is being read, and lets the user tap a sentence
 * to hear it again (UC1/UC2: "text highlighted as the audio goes on").
 */

export interface Segment {
  id: string
  text: string
}

interface PlayOptions {
  /** What is being read, shown in the audio bar. */
  title: string
  /** Start at this segment instead of the first one. */
  startId?: string
  /** Called after each segment has been spoken completely. */
  onSegmentDone?: (id: string) => void
}

export type SpeechStatus = 'idle' | 'playing' | 'paused'

interface SpeechApi {
  supported: boolean
  status: SpeechStatus
  currentId: string | null
  currentText: string | null
  title: string | null
  /** Identifies the queue that is playing, so a screen knows whether "its" text is being read. */
  queueKey: string | null
  play: (segments: Segment[], options: PlayOptions & { key: string }) => void
  pause: () => void
  resume: () => void
  stop: () => void
  next: () => void
  previous: () => void
  jumpTo: (id: string) => void
}

const SpeechContext = createContext<SpeechApi | null>(null)

export function SpeechProvider({ children }: { children: ReactNode }) {
  const { lang } = useI18n()
  const { rate } = useSettings()
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  const [status, setStatus] = useState<SpeechStatus>('idle')
  const [index, setIndex] = useState(-1)
  const [title, setTitle] = useState<string | null>(null)
  const [queueKey, setQueueKey] = useState<string | null>(null)
  const [queue, setQueue] = useState<Segment[]>([])

  const segmentsRef = useRef<Segment[]>([])
  const indexRef = useRef(-1)
  const tokenRef = useRef(0) // increases on every new utterance so old "end" events are ignored
  const optionsRef = useRef<PlayOptions | null>(null)
  const rateRef = useRef(rate)
  const langRef = useRef(lang)
  const timerRef = useRef<number | undefined>(undefined)

  const pickVoice = useCallback((): SpeechSynthesisVoice | undefined => {
    const voices = window.speechSynthesis.getVoices()
    const wanted = langRef.current === 'de' ? 'de' : 'en'
    const matching = voices.filter((v) => v.lang.toLowerCase().startsWith(wanted))
    return matching.find((v) => v.localService) ?? matching[0]
  }, [])

  const speakAt = useCallback(
    (i: number) => {
      if (!supported) return
      const synth = window.speechSynthesis
      const token = ++tokenRef.current
      synth.cancel()
      window.clearTimeout(timerRef.current)

      const segments = segmentsRef.current
      if (i < 0 || i >= segments.length) {
        indexRef.current = -1
        setIndex(-1)
        setStatus('idle')
        return
      }
      indexRef.current = i
      setIndex(i)
      setStatus('playing')

      // A short delay after cancel() avoids a Chrome bug where the next utterance is dropped.
      timerRef.current = window.setTimeout(() => {
        if (token !== tokenRef.current) return
        const utterance = new SpeechSynthesisUtterance(segments[i].text)
        utterance.lang = langRef.current === 'de' ? 'de-DE' : 'en-GB'
        utterance.rate = rateRef.current
        const voice = pickVoice()
        if (voice) utterance.voice = voice
        utterance.onend = () => {
          if (token !== tokenRef.current) return
          optionsRef.current?.onSegmentDone?.(segments[i].id)
          speakAt(i + 1)
        }
        utterance.onerror = (e) => {
          if (token !== tokenRef.current) return
          if (e.error === 'interrupted' || e.error === 'canceled') return
          speakAt(i + 1)
        }
        synth.speak(utterance)
      }, 60)
    },
    [supported, pickVoice],
  )

  const stop = useCallback(() => {
    tokenRef.current++
    window.clearTimeout(timerRef.current)
    if (supported) window.speechSynthesis.cancel()
    indexRef.current = -1
    setIndex(-1)
    setStatus('idle')
    setTitle(null)
    setQueueKey(null)
  }, [supported])

  const play = useCallback(
    (segments: Segment[], options: PlayOptions & { key: string }) => {
      segmentsRef.current = segments.filter((s) => s.text.trim())
      setQueue(segmentsRef.current)
      optionsRef.current = options
      setTitle(options.title)
      setQueueKey(options.key)
      const start = options.startId ? segmentsRef.current.findIndex((s) => s.id === options.startId) : 0
      speakAt(Math.max(0, start))
    },
    [speakAt],
  )

  // Pause = stop speaking but remember the sentence; resume starts that sentence again.
  // (More reliable across browsers than speechSynthesis.pause().)
  const pause = useCallback(() => {
    tokenRef.current++
    window.clearTimeout(timerRef.current)
    if (supported) window.speechSynthesis.cancel()
    setStatus('paused')
  }, [supported])

  const resume = useCallback(() => speakAt(Math.max(0, indexRef.current)), [speakAt])
  const next = useCallback(() => speakAt(Math.min(indexRef.current + 1, segmentsRef.current.length - 1)), [speakAt])
  const previous = useCallback(() => speakAt(Math.max(indexRef.current - 1, 0)), [speakAt])
  const jumpTo = useCallback(
    (id: string) => {
      const i = segmentsRef.current.findIndex((s) => s.id === id)
      if (i >= 0) speakAt(i)
    },
    [speakAt],
  )

  // Changing the speed restarts the current sentence at the new speed.
  useEffect(() => {
    rateRef.current = rate
    if (status === 'playing') speakAt(indexRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rate])

  // Changing the language stops reading (the text on screen changes).
  useEffect(() => {
    langRef.current = lang
    stop()
  }, [lang, stop])

  // Stop reading when the app is closed.
  useEffect(() => () => {
    if (supported) window.speechSynthesis.cancel()
  }, [supported])

  const current = index >= 0 ? queue[index] : undefined
  const value = useMemo<SpeechApi>(
    () => ({
      supported,
      status,
      currentId: status === 'idle' ? null : current?.id ?? null,
      currentText: current?.text ?? null,
      title,
      queueKey,
      play,
      pause,
      resume,
      stop,
      next,
      previous,
      jumpTo,
    }),
    [supported, status, current, title, queueKey, play, pause, resume, stop, next, previous, jumpTo],
  )

  return <SpeechContext.Provider value={value}>{children}</SpeechContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSpeech(): SpeechApi {
  const ctx = useContext(SpeechContext)
  if (!ctx) throw new Error('useSpeech must be used inside <SpeechProvider>')
  return ctx
}
