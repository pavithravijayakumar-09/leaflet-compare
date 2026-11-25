import { useI18n } from '../i18n/LanguageContext'
import { useSettings, VOICE_RATES } from '../settings/SettingsContext'
import { useSpeech } from '../speech/SpeechContext'
import { PauseIcon, PlayIcon, SpeakerIcon, StopIcon } from './ui'

/** Player bar that stays at the bottom of the screen while something is read aloud. */
export function AudioBar() {
  const { t } = useI18n()
  const speech = useSpeech()
  const { rate, setRate } = useSettings()
  if (speech.status === 'idle') return null

  return (
    <section
      aria-label={t.audio.region}
      className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-slate-300 bg-white/95 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur"
    >
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3 px-4 py-3">
        <SpeakerIcon className="size-6 text-teal-700" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500" aria-live="polite">
            {speech.status === 'playing' ? t.audio.reading : t.audio.paused} · {speech.title}
          </p>
          <p className="truncate text-sm text-slate-800">{speech.currentText}</p>
        </div>
        <div className="flex items-center gap-2">
          {speech.status === 'playing' ? (
            <button type="button" onClick={speech.pause} className="grid size-11 place-items-center rounded-full bg-teal-700 text-white hover:bg-teal-800" aria-label={t.audio.pause}>
              <PauseIcon />
            </button>
          ) : (
            <button type="button" onClick={speech.resume} className="grid size-11 place-items-center rounded-full bg-teal-700 text-white hover:bg-teal-800" aria-label={t.audio.resume}>
              <PlayIcon />
            </button>
          )}
          <button type="button" onClick={speech.stop} className="grid size-11 place-items-center rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100" aria-label={t.audio.stop}>
            <StopIcon />
          </button>
          <label className="flex items-center gap-1 text-sm text-slate-700">
            <span className="sr-only sm:not-sr-only">{t.audio.speed}</span>
            <select value={rate} onChange={(e) => setRate(Number(e.target.value))} className="rounded-lg border border-slate-300 bg-white px-2 py-2">
              {VOICE_RATES.map((r) => (
                <option key={r} value={r}>{r.toLocaleString()}×</option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </section>
  )
}
