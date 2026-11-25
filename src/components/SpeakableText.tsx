import { useEffect, useRef } from 'react'
import { useSpeech, type Segment } from '../speech/SpeechContext'
import { sentenceId, splitSentences } from '../lib/sentences'

/** Turn a paragraph into read-aloud segments (one per sentence). */
export function paragraphSegments(paragraphId: string, text: string): Segment[] {
  return splitSentences(text).map((s, i) => ({ id: sentenceId(paragraphId, i), text: s }))
}

/**
 * A paragraph whose sentences light up while they are read aloud.
 * While reading, tapping a sentence continues reading from there ("select line to hear again").
 */
export function SpeakableText({ paragraphId, text, className = '' }: { paragraphId: string; text: string; className?: string }) {
  const speech = useSpeech()
  const sentences = splitSentences(text)
  const activeRef = useRef<HTMLSpanElement>(null)
  const activeIndex = sentences.findIndex((_, i) => speech.currentId === sentenceId(paragraphId, i))

  // Keep the sentence that is being read visible.
  useEffect(() => {
    const el = activeRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    if (r.top < 80 || r.bottom > window.innerHeight - 120) el.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [activeIndex])

  const canJump = speech.status !== 'idle'

  return (
    <p className={`leading-relaxed ${className}`}>
      {sentences.map((s, i) => {
        const id = sentenceId(paragraphId, i)
        const active = speech.currentId === id
        return (
          <span key={id}>
            <span
              ref={active ? activeRef : undefined}
              data-sentence={id}
              onClick={canJump ? () => speech.jumpTo(id) : undefined}
              aria-current={active ? 'true' : undefined}
              className={`rounded px-0.5 transition-colors ${active ? 'bg-yellow-200 text-slate-950 underline decoration-yellow-600 decoration-2 underline-offset-4' : ''} ${
                canJump ? 'cursor-pointer hover:bg-yellow-50' : ''
              }`}
            >
              {s}
            </span>{' '}
          </span>
        )
      })}
    </p>
  )
}
