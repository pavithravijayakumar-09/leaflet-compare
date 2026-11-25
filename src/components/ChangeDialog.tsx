import { useEffect, useRef, useState } from 'react'
import type { Medication } from '../data/types'
import { wordDiff, type LeafletChange } from '../lib/compare'
import { useI18n } from '../i18n/LanguageContext'
import { links } from '../lib/router'
import { btn, ChangeBadge, CloseIcon, DocIcon, InfoIcon, PharmacyButton, SafetyNote, SpeakerIcon } from './ui'
import { useSpeech } from '../speech/SpeechContext'

/** Modal with previous text, current text, inline word diff, explanation and links to the original leaflet. */
export function ChangeDialog({ med, change, onClose }: { med: Medication; change: LeafletChange | null; onClose: () => void }) {
  const { t, formatDate } = useI18n()
  const speech = useSpeech()
  const ref = useRef<HTMLDialogElement>(null)
  const [showDiff, setShowDiff] = useState(true)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (change && !dialog.open) dialog.showModal()
    if (!change && dialog.open) dialog.close()
  }, [change])

  return (
    <dialog
      ref={ref}
      aria-labelledby="change-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()} // click on backdrop closes
      className="m-auto w-[min(100%-1.5rem,44rem)] max-h-[92vh] rounded-2xl bg-slate-50 p-0 shadow-2xl"
    >
      {change && (
        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <ChangeBadge type={change.type} />
              <h2 id="change-title" className="text-xl font-bold">{change.sectionTitle}</h2>
            </div>
            <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-600 hover:bg-slate-200" aria-label={t.dialog.close}>
              <CloseIcon />
            </button>
          </div>

          {/* Plain-language explanation */}
          <section aria-labelledby="explain-heading" className="flex gap-3 rounded-xl bg-teal-50 p-4 text-teal-950">
            <InfoIcon className="mt-0.5 size-5 text-teal-700" />
            <div>
              <h3 id="explain-heading" className="font-semibold">{t.dialog.explainHeading}</h3>
              <p className="mt-1">{change.explanation ?? t.dialog.noExplanation}</p>
            </div>
          </section>

          {/* Old vs new */}
          <div className="grid gap-3 sm:grid-cols-2">
            <TextBox
              title={t.dialog.previousText}
              meta={t.dialog.versionMeta(med.previous?.version ?? '', med.previous ? formatDate(med.previous.publishedOn) : '')}
              text={change.previousText}
              emptyText={t.dialog.emptyPrevious}
              variant="previous"
            />
            <TextBox
              title={t.dialog.currentText}
              meta={t.dialog.versionMeta(med.current.version, formatDate(med.current.publishedOn))}
              text={change.currentText}
              emptyText={t.dialog.emptyCurrent}
              variant="current"
            />
          </div>

          {change.type === 'changed' && change.previousText && change.currentText && (
            <section aria-labelledby="diff-heading" className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 id="diff-heading" className="font-semibold">{t.dialog.diffHeading}</h3>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={showDiff} onChange={(e) => setShowDiff(e.target.checked)} className="size-4 accent-teal-700" />
                  {t.dialog.highlight}
                </label>
              </div>
              <p className="mt-2 leading-relaxed">
                {showDiff
                  ? wordDiff(change.previousText, change.currentText).map((part, i) =>
                      part.kind === 'same' ? (
                        <span key={i}>{part.text}</span>
                      ) : part.kind === 'inserted' ? (
                        <ins key={i} className="rounded bg-blue-100 px-0.5 font-semibold text-blue-900 underline decoration-2 underline-offset-2">
                          <span className="sr-only">{t.dialog.srAdded}</span>
                          {part.text}
                          <span className="sr-only">]</span>
                        </ins>
                      ) : (
                        <del key={i} className="rounded bg-rose-100 px-0.5 text-rose-900">
                          <span className="sr-only">{t.dialog.srRemoved}</span>
                          {part.text}
                          <span className="sr-only">]</span>
                        </del>
                      ),
                    )
                  : change.currentText}
              </p>
            </section>
          )}

          {/* Verify against original */}
          <section aria-labelledby="verify-heading" className="space-y-2">
            <h3 id="verify-heading" className="font-semibold">{t.dialog.verifyHeading}</h3>
            <div className="flex flex-wrap gap-2">
              {change.currentText && (
                <a
                  href={links.leaflet(med.id, 'current', change.id)}
                  className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 font-medium text-white hover:bg-teal-800"
                >
                  <DocIcon /> {t.dialog.viewCurrent}
                </a>
              )}
              {change.previousText && (
                <a
                  href={links.leaflet(med.id, 'previous', change.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-medium hover:border-teal-600 hover:text-teal-800"
                >
                  <DocIcon /> {t.dialog.viewPrevious}
                </a>
              )}
            </div>
          </section>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!speech.supported}
              onClick={() =>
                speech.play(
                  [
                    { id: 'd-exp', text: change.explanation ?? t.dialog.noExplanation },
                    ...(change.previousText ? [{ id: 'd-prev', text: `${t.dialog.speakPrevious} ${change.previousText}` }] : []),
                    ...(change.currentText ? [{ id: 'd-curr', text: `${t.dialog.speakCurrent} ${change.currentText}` }] : []),
                  ],
                  { key: `change:${change.id}`, title: t.dialog.readAloud },
                )
              }
              className={btn.small}
            >
              <SpeakerIcon className="size-4" /> {t.dialog.readAloud}
            </button>
            <PharmacyButton className={btn.small} />
          </div>

          <SafetyNote compact />
        </div>
      )}
    </dialog>
  )
}

function TextBox({
  title,
  meta,
  text,
  emptyText,
  variant,
}: {
  title: string
  meta: string
  text: string | null
  emptyText: string
  variant: 'previous' | 'current'
}) {
  return (
    <section
      aria-label={title}
      className={`rounded-xl border bg-white p-4 ${variant === 'current' ? 'border-teal-300' : 'border-slate-300 border-dashed'}`}
    >
      <h3 className="font-semibold">{title}</h3>
      <p className="text-xs text-slate-500">{meta}</p>
      {text ? (
        <blockquote className="mt-2 text-slate-800">{text}</blockquote>
      ) : (
        <p className="mt-2 italic text-slate-500">{emptyText}</p>
      )}
    </section>
  )
}
