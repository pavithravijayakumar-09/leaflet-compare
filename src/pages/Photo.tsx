import { useState, type ChangeEvent } from 'react'
import { getMedications } from '../data/medications'
import type { Medication } from '../data/types'
import { useI18n } from '../i18n/LanguageContext'
import { matchBlisterText } from '../lib/search'
import { links } from '../lib/router'
import { BackLink, btn, CameraIcon, Card, ChevronRight, KeyboardIcon, PageTitle } from '../components/ui'
import { ProductCard } from '../components/ProductCard'

/*
 * UC2 step S1 – photo of the blister strip → text recognition (OCR) → matching medicines.
 * The user must tap the medicine that matches the blister (explicit confirmation with deliberate effort).
 * Text recognition: tesseract.js, runs in the browser. The photo is not uploaded anywhere.
 */
type State =
  | { kind: 'idle' }
  | { kind: 'reading'; progress: number }
  | { kind: 'done'; text: string; matches: Medication[] }
  | { kind: 'error' }

export function Photo() {
  const { t, lang } = useI18n()
  const [state, setState] = useState<State>({ kind: 'idle' })
  const [preview, setPreview] = useState<string | null>(null)

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (preview) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(file))
    setState({ kind: 'reading', progress: 0 })
    try {
      // Loaded only when needed, because the text recognition engine is large.
      const { createWorker } = await import('tesseract.js')
      const worker = await createWorker('eng', undefined, {
        logger: (m) => {
          if (m.status === 'recognizing text') setState({ kind: 'reading', progress: Math.round(m.progress * 100) })
        },
      })
      const { data } = await worker.recognize(file)
      await worker.terminate()
      const text = data.text.replace(/\s+/g, ' ').trim()
      setState({ kind: 'done', text, matches: matchBlisterText(getMedications(lang), text) })
    } catch {
      setState({ kind: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      <BackLink href={links.home()}>{t.product.back}</BackLink>
      <div className="space-y-1">
        <PageTitle>{t.photo.title}</PageTitle>
        <p className="text-slate-600">{t.photo.intro}</p>
      </div>

      <Card className="space-y-4 p-5">
        <label className={`${btn.primary} w-full cursor-pointer py-4 text-lg sm:w-auto`}>
          <input type="file" accept="image/*" capture="environment" onChange={onFile} className="sr-only" />
          <CameraIcon className="size-6" /> {state.kind === 'idle' ? t.photo.take : t.photo.retake}
        </label>
        <p className="text-sm text-slate-500">{t.photo.privacy} {t.photo.firstUse}</p>
        {preview && <img src={preview} alt="" className="max-h-56 rounded-xl border border-slate-200 object-contain" />}
      </Card>

      {state.kind === 'reading' && (
        <div role="status" className="space-y-2">
          <p className="font-medium">{t.photo.reading} {state.progress > 0 ? `${state.progress} %` : ''}</p>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full bg-teal-600 transition-all" style={{ width: `${state.progress}%` }} />
          </div>
        </div>
      )}

      {state.kind === 'error' && (
        <p role="alert" className="rounded-xl bg-rose-50 p-4 font-medium text-rose-900">{t.photo.error}</p>
      )}

      {state.kind === 'done' && (
        <section aria-live="polite" className="space-y-4">
          <div className="rounded-xl bg-slate-100 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.photo.recognized}</p>
            <p className="mt-1 font-mono text-slate-800">{state.text || '–'}</p>
          </div>
          {state.matches.length === 0 ? (
            <Card className="space-y-2 p-5">
              <h2 className="text-lg font-semibold">{t.photo.none}</h2>
              <p className="text-slate-700">{t.photo.noneText}</p>
            </Card>
          ) : (
            <>
              <h2 className="text-lg font-semibold">{t.photo.candidates}</h2>
              <ul className="space-y-3">
                {state.matches.map((med) => (
                  <li key={med.id}>
                    <a href={links.overview(med.id, 'photo')} className="group block rounded-2xl">
                      <Card className="flex flex-col gap-4 p-4 transition group-hover:border-teal-500 group-hover:shadow-md sm:flex-row sm:items-center">
                        <div className="min-w-0 flex-1"><ProductCard med={med} compact /></div>
                        <span className={`${btn.primary} shrink-0`}>{t.search.select} <ChevronRight /></span>
                      </Card>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      <a href={links.home()} className={btn.secondary}>
        <KeyboardIcon className="size-5" /> {t.photo.typeInstead}
      </a>
    </div>
  )
}
