import { useState, type FormEvent } from 'react'
import type { Medication } from '../data/types'
import { useI18n } from '../i18n/LanguageContext'
import { useSpeech } from '../speech/SpeechContext'
import { answerQuestion, type Answer, type Citation } from '../lib/qa'
import { links } from '../lib/router'
import { BackLink, btn, Card, CompareIcon, DocIcon, InfoIcon, PageTitle, PharmacyButton, SpeakerIcon } from '../components/ui'

/*
 * UC1 S4 / UC3 S4 – ask a question about the leaflet.
 * Hard rule: the answer is a QUOTE from the leaflet with a link to the cited passage.
 * Nothing found → "not in the leaflet" + call the pharmacy. Questions are not stored.
 */
export function Ask({ med, initialQuestion }: { med: Medication; initialQuestion?: string }) {
  const { t } = useI18n()
  const speech = useSpeech()
  const [question, setQuestion] = useState(initialQuestion ?? '')
  const [asked, setAsked] = useState<{ q: string; a: Answer } | null>(() =>
    initialQuestion ? { q: initialQuestion, a: answerQuestion(med, initialQuestion) } : null,
  )

  const ask = (q: string) => {
    if (!q.trim()) return
    setQuestion(q)
    setAsked({ q, a: answerQuestion(med, q) })
  }
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    ask(question)
  }

  return (
    <div className="space-y-6">
      <BackLink href={links.overview(med.id)}>{t.leaflet.back}</BackLink>
      <div className="space-y-1">
        <PageTitle>{t.ask.title}</PageTitle>
        <p className="text-slate-600">{med.name} {med.strength} · {t.ask.intro}</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-2">
        <label htmlFor="question" className="font-semibold">{t.ask.label}</label>
        <div className="flex gap-2">
          <input
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t.ask.placeholder}
            autoComplete="off"
            className="min-w-0 flex-1 rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-lg focus:border-teal-600 focus:outline-none"
          />
          <button type="submit" className={btn.primary}>{t.ask.submit}</button>
        </div>
        <p className="text-sm text-slate-500">{t.ask.privacy}</p>
      </form>

      <div>
        <p className="mb-2 text-sm font-semibold text-slate-700">{t.ask.suggestions}</p>
        <div className="flex flex-wrap gap-2">
          {t.ask.examples.map((ex) => (
            <button key={ex} type="button" onClick={() => ask(ex)} className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm hover:border-teal-600 hover:text-teal-800">
              {ex}
            </button>
          ))}
        </div>
      </div>

      {asked && (
        <section aria-live="polite" className="space-y-4">
          <p className="text-sm text-slate-600"><span className="font-semibold">{t.ask.yourQuestion}:</span> „{asked.q}“</p>
          {asked.a.found && asked.a.best ? (
            <>
              <CitationCard med={med} c={asked.a.best} main onRead={(c) => speech.play([{ id: `qa:${c.paragraphId}`, text: c.sentence }], { key: 'qa', title: t.ask.answerHeading })} />
              {asked.a.more.length > 0 && (
                <details className="rounded-xl border border-slate-200 bg-white p-4">
                  <summary className="cursor-pointer font-medium">{t.ask.more} ({asked.a.more.length})</summary>
                  <div className="mt-3 space-y-3">
                    {asked.a.more.map((c) => <CitationCard key={c.paragraphId} med={med} c={c} />)}
                  </div>
                </details>
              )}
            </>
          ) : (
            <Card className="space-y-3 border-2 border-slate-300 p-5">
              <h2 className="flex items-center gap-2 text-lg font-semibold"><InfoIcon /> {t.ask.notFoundTitle}</h2>
              <p className="text-slate-700">{t.ask.notFoundText}</p>
              <PharmacyButton className={btn.primary} />
            </Card>
          )}
        </section>
      )}
    </div>
  )
}

function CitationCard({ med, c, main = false, onRead }: { med: Medication; c: Citation; main?: boolean; onRead?: (c: Citation) => void }) {
  const { t } = useI18n()
  return (
    <Card className={`space-y-3 p-5 ${main ? 'border-2 border-teal-600' : ''}`}>
      {main && <h2 className="text-sm font-semibold uppercase tracking-wide text-teal-800">{t.ask.answerHeading}</h2>}
      <blockquote className={`border-l-4 border-teal-600 pl-4 ${main ? 'text-xl' : ''} leading-relaxed text-slate-900`}>„{c.sentence}“</blockquote>
      <p className="text-sm text-slate-600">{t.ask.inSection(c.sectionTitle)} · v{med.current.version}</p>
      {c.change && (
        <p className="flex flex-wrap items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm font-medium text-amber-950">
          <InfoIcon className="size-4" /> {t.ask.changedNote(med.current.version)}
          <a href={links.compare(med.id)} className="inline-flex items-center gap-1 underline"><CompareIcon className="size-4" /> {t.ask.viewChange}</a>
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <a href={links.leaflet(med.id, 'current', c.paragraphId)} className={btn.small}><DocIcon className="size-4" /> {t.ask.showSource}</a>
        {onRead && (
          <button type="button" onClick={() => onRead(c)} className={btn.small}><SpeakerIcon className="size-4" /> {t.ask.readAnswer}</button>
        )}
      </div>
    </Card>
  )
}
