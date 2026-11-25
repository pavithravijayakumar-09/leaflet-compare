import { useEffect, useMemo, useState } from 'react'
import type { Medication } from '../data/types'
import { useI18n } from '../i18n/LanguageContext'
import { useSpeech } from '../speech/SpeechContext'
import { links } from '../lib/router'
import { BackLink, btn, Card, CheckIcon, ChevronLeft, ChevronRight, PageTitle, PharmacyButton, QuestionIcon, SpeakerIcon } from '../components/ui'

/*
 * UC1 S3 – "how to use" as numbered step cards with an audio guide.
 * Every card quotes the leaflet word for word and links to its source (no AI instructions).
 * Confirmation: "Understood" after every card. Recovery: back button on every card.
 */
export function Steps({ med }: { med: Medication }) {
  const { t } = useI18n()
  const speech = useSpeech()
  const steps = med.steps
  const [index, setIndex] = useState(0)
  const [understood, setUnderstood] = useState<string[]>([])
  const key = `steps:${med.id}`
  const done = index >= steps.length

  const segments = useMemo(() => steps.map((s, i) => ({ id: s.id, text: `${t.steps.stepOf(i + 1, steps.length)}. ${s.title}. ${s.text}` })), [steps, t])

  // While the audio guide runs, the card follows the step that is being read.
  useEffect(() => {
    if (speech.queueKey !== key || !speech.currentId) return
    const i = steps.findIndex((s) => s.id === speech.currentId)
    if (i >= 0) setIndex(i)
  }, [speech.currentId, speech.queueKey, key, steps])

  if (steps.length === 0) {
    return (
      <div className="space-y-6">
        <BackLink href={links.overview(med.id)}>{t.leaflet.back}</BackLink>
        <PageTitle>{t.steps.title}</PageTitle>
        <p>{t.steps.none}</p>
      </div>
    )
  }

  const step = steps[Math.min(index, steps.length - 1)]
  const confirm = () => {
    setUnderstood((u) => (u.includes(step.id) ? u : [...u, step.id]))
    setIndex(index + 1)
  }

  return (
    <div className="space-y-6">
      <BackLink href={links.overview(med.id)}>{t.leaflet.back}</BackLink>
      <div className="space-y-1">
        <PageTitle>{t.steps.title}</PageTitle>
        <p className="text-slate-600">{med.name} {med.strength} · {t.steps.intro}</p>
      </div>

      <button type="button" onClick={() => speech.play(segments, { key, title: t.steps.title })} disabled={!speech.supported} className={`${btn.secondary} w-full py-4 text-lg sm:w-auto`}>
        <SpeakerIcon className="size-6" /> {t.steps.audioGuide}
      </button>

      {/* progress dots */}
      <ol className="flex flex-wrap gap-2" aria-label={t.steps.title}>
        {steps.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-current={i === index ? 'step' : undefined}
              aria-label={`${t.steps.stepOf(i + 1, steps.length)}: ${s.title}${understood.includes(s.id) ? ` (${t.steps.understoodBadge})` : ''}`}
              className={`grid size-10 place-items-center rounded-full border-2 font-bold ${
                i === index ? 'border-teal-700 bg-teal-700 text-white' : understood.includes(s.id) ? 'border-teal-600 bg-teal-50 text-teal-800' : 'border-slate-300 bg-white text-slate-600'
              }`}
            >
              {understood.includes(s.id) && i !== index ? <CheckIcon className="size-5" /> : i + 1}
            </button>
          </li>
        ))}
      </ol>

      {done ? (
        <Card className="space-y-4 p-6 text-center">
          <CheckIcon className="mx-auto size-14 text-teal-700" />
          <h2 className="text-2xl font-bold">{t.steps.done}</h2>
          <p className="text-slate-700">{t.steps.doneText}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={links.ask(med.id)} className={btn.primary}><QuestionIcon /> {t.steps.askQuestion}</a>
            <PharmacyButton />
            <button type="button" onClick={() => setIndex(0)} className={btn.secondary}>{t.steps.restart}</button>
          </div>
        </Card>
      ) : (
        <Card className={`overflow-hidden ${speech.queueKey === key && speech.currentId === step.id ? 'ring-4 ring-yellow-300' : ''}`}>
          <div className="flex items-center justify-between bg-teal-700 px-5 py-3 text-white">
            <p className="font-semibold">{t.steps.stepOf(index + 1, steps.length)}</p>
            {understood.includes(step.id) && <p className="flex items-center gap-1 text-sm"><CheckIcon className="size-4" /> {t.steps.understoodBadge}</p>}
          </div>
          <div className="space-y-4 p-6">
            <div aria-hidden="true" className="text-6xl">{step.icon}</div>
            <h2 className="text-2xl font-bold">{step.title}</h2>
            <blockquote className="border-l-4 border-teal-600 pl-4 text-xl leading-relaxed text-slate-800">{step.text}</blockquote>
            <a href={links.leaflet(med.id, 'current', step.paragraphId)} className="inline-block text-sm font-medium text-teal-800 underline underline-offset-2">
              {t.steps.source}: {step.sectionTitle}
            </a>
            <div className="flex flex-wrap gap-3 pt-2">
              <button type="button" onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0} className={`${btn.secondary} disabled:opacity-40`}>
                <ChevronLeft /> {t.steps.back}
              </button>
              <button type="button" onClick={() => speech.play([segments[index]], { key: `step:${step.id}`, title: step.title })} disabled={!speech.supported} className={btn.secondary}>
                <SpeakerIcon /> {t.steps.readStep}
              </button>
              <button type="button" onClick={confirm} className={`${btn.primary} py-4 text-lg`}>
                <CheckIcon /> {index === steps.length - 1 ? t.steps.understoodLast : t.steps.understood} {index < steps.length - 1 && <ChevronRight />}
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
