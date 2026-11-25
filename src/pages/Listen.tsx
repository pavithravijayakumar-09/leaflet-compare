import { useEffect, useMemo } from 'react'
import type { Medication } from '../data/types'
import { useI18n } from '../i18n/LanguageContext'
import { useSettings, VOICE_RATES } from '../settings/SettingsContext'
import { useSpeech } from '../speech/SpeechContext'
import { links } from '../lib/router'
import { BackLink, btn, Card, ChevronLeft, ChevronRight, PauseIcon, PlayIcon, SpeakerIcon, StopIcon } from '../components/ui'
import { SpeakableText } from '../components/SpeakableText'
import { leafletSegments } from './LeafletViewer'

/*
 * Read-aloud mode (UC2 S5 "dad taps on read out" – also opened by the QR code on the printout).
 * Big buttons, saved voice speed, text highlighted as it is read, tap a sentence to hear it again.
 * Recovery: change speed, go back a sentence, switch to the text view.
 */
export function Listen({ med, autoplay }: { med: Medication; autoplay: boolean }) {
  const { t } = useI18n()
  const speech = useSpeech()
  const { rate, setRate } = useSettings()
  const segments = useMemo(() => leafletSegments(med.current.sections), [med])
  const key = `listen:${med.id}`
  const active = speech.queueKey === key
  const status = active ? speech.status : 'idle'

  const start = () => speech.play(segments, { key, title: t.listen.title(med.name) })

  // Opened from the QR code: try to start right away (some browsers need a tap first).
  useEffect(() => {
    if (autoplay && speech.supported) start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay])

  const speedLabels = [t.listen.speeds.slow, t.listen.speeds.normal, t.listen.speeds.fast]
  const bigBtn = 'flex min-h-20 flex-col items-center justify-center gap-1 rounded-2xl border-2 px-3 py-3 text-base font-semibold transition'

  return (
    <div className="space-y-6">
      <BackLink href={links.overview(med.id)}>{t.leaflet.back}</BackLink>
      <div className="space-y-1">
        <h1 tabIndex={-1} className="text-2xl font-bold sm:text-3xl">{t.listen.title(`${med.name} ${med.strength}`)}</h1>
        <p className="text-slate-600">{t.listen.intro}</p>
        {autoplay && <p className="text-sm font-medium text-teal-800">{t.listen.fromQr}</p>}
      </div>

      {!speech.supported && <p role="alert" className="rounded-xl bg-amber-50 p-4 font-medium text-amber-950">{t.listen.notSupported}</p>}

      <Card className="no-print sticky top-2 z-30 space-y-4 p-4 sm:p-5">
        <div className="grid grid-cols-3 gap-3">
          <button type="button" onClick={speech.previous} disabled={!active} className={`${bigBtn} border-slate-300 bg-white text-slate-800 hover:border-teal-600 disabled:opacity-40`}>
            <ChevronLeft className="size-8" /> {t.listen.back}
          </button>
          {status === 'playing' ? (
            <button type="button" onClick={speech.pause} className={`${bigBtn} border-teal-700 bg-teal-700 text-lg text-white hover:bg-teal-800`}>
              <PauseIcon className="size-9" /> {t.listen.pause}
            </button>
          ) : (
            <button
              type="button"
              onClick={status === 'paused' ? speech.resume : start}
              disabled={!speech.supported}
              className={`${bigBtn} border-teal-700 bg-teal-700 text-lg text-white hover:bg-teal-800 disabled:opacity-40`}
            >
              <PlayIcon className="size-9" /> {status === 'paused' ? t.listen.resume : t.listen.start}
            </button>
          )}
          <button type="button" onClick={speech.next} disabled={!active} className={`${bigBtn} border-slate-300 bg-white text-slate-800 hover:border-teal-600 disabled:opacity-40`}>
            <ChevronRight className="size-8" /> {t.listen.forward}
          </button>
        </div>

        <fieldset>
          <legend className="mb-2 font-semibold">{t.listen.speed}</legend>
          <div className="grid grid-cols-3 gap-2">
            {VOICE_RATES.map((r, i) => (
              <button
                key={r}
                type="button"
                aria-pressed={rate === r}
                onClick={() => setRate(r)}
                className={`rounded-xl border-2 px-3 py-3 text-base font-semibold ${rate === r ? 'border-teal-700 bg-teal-50 text-teal-950' : 'border-slate-200 bg-white hover:border-slate-400'}`}
              >
                {speedLabels[i]}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-slate-500">{t.listen.speedSaved}</p>
        </fieldset>

        <div className="flex flex-wrap gap-3">
          {active && (
            <button type="button" onClick={speech.stop} className={btn.secondary}><StopIcon /> {t.listen.stop}</button>
          )}
          <a href={links.leaflet(med.id)} className={btn.secondary}>{t.listen.switchToText}</a>
        </div>
      </Card>

      {!active && speech.supported && (
        <p className="flex items-center gap-2 text-slate-600"><SpeakerIcon /> {t.listen.tapToStart}</p>
      )}

      <Card className="space-y-6 p-5 text-lg sm:p-6">
        {med.current.sections.map((sec) => (
          <section key={sec.id} className="space-y-2">
            <h2 className={`rounded text-xl font-semibold ${speech.currentId === `${sec.id}::title` ? 'bg-yellow-200' : ''}`}>{sec.title}</h2>
            {sec.paragraphs.map((p) => (
              <SpeakableText key={p.id} paragraphId={p.id} text={p.text} className="text-slate-800" />
            ))}
          </section>
        ))}
      </Card>
    </div>
  )
}
