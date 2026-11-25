import { useEffect, useMemo, useState } from 'react'
import type { LeafletSection, LeafletVersion, Medication } from '../data/types'
import { compareMedication, wordDiff, type ChangeType, type LeafletChange } from '../lib/compare'
import { frequenciesIn, FREQUENCY_ORDER, isSideEffectSection, isWarningSection, type Frequency } from '../lib/leafletInsights'
import { splitSentences } from '../lib/sentences'
import { getReadSections, setSectionRead } from '../lib/storage'
import { useI18n } from '../i18n/LanguageContext'
import { useSpeech, type Segment } from '../speech/SpeechContext'
import { links } from '../lib/router'
import {
  BackLink, btn, Card, ChangeBadge, changeStyle, CheckIcon, InfoIcon, PlayIcon, PulseIcon, SpeakerIcon, WarningIcon,
} from '../components/ui'
import { paragraphSegments, SpeakableText } from '../components/SpeakableText'

/** All read-aloud segments of a leaflet: chapter title, then its sentences. */
// eslint-disable-next-line react-refresh/only-export-components
export function leafletSegments(sections: LeafletSection[]): Segment[] {
  return sections.flatMap((sec) => [
    { id: `${sec.id}::title`, text: sec.title.replace(/^\d+\.\s*/, '') },
    ...sec.paragraphs.flatMap((p) => paragraphSegments(p.id, p.text)),
  ])
}

/** Background colour per change type. Each one also has a badge, an icon and its own border style. */
const changeBg: Record<ChangeType, string> = {
  added: 'bg-blue-50',
  changed: 'bg-amber-50',
  removed: 'bg-rose-50',
}

/*
 * The leaflet itself (UC1 "reads all the chapters", UC2 "opens leaflet and checks the date", UC3 "verify a change").
 *  - chapter list at a glance + reading progress (saved on this device)
 *  - read aloud the whole leaflet or one chapter, text highlighted as it is read
 *  - changes since the previous version coloured and labelled, removed text shown where it used to be
 *  - warnings and side effects highlighted (side effects with the frequency the leaflet states)
 */
export function LeafletViewer({ med, which, paragraphId }: { med: Medication; which: 'current' | 'previous'; paragraphId?: string }) {
  const { t, formatDate } = useI18n()
  const speech = useSpeech()
  const leaflet: LeafletVersion = (which === 'previous' && med.previous) || med.current
  const isPrevious = leaflet !== med.current
  const changes = useMemo(() => compareMedication(med), [med])
  const progressKey = `${med.id}@${leaflet.version}`
  const [readIds, setReadIds] = useState<string[]>(() => getReadSections(progressKey))
  const [showChanges, setShowChanges] = useState(true)
  useEffect(() => setReadIds(getReadSections(progressKey)), [progressKey])
  const queueKey = `leaflet:${progressKey}`
  const highlight = showChanges && changes.length > 0

  // Which paragraphs to mark in this version (added/changed in current, changed/removed in previous).
  const changeById = useMemo(() => {
    const m = new Map<string, LeafletChange>()
    for (const c of changes) {
      if (!isPrevious && c.type !== 'removed') m.set(c.id, c)
      if (isPrevious && c.type !== 'added') m.set(c.id, c)
    }
    return m
  }, [changes, isPrevious])

  /** Changes per chapter (for the chapter list and chapter headings). */
  const changesPerSection = useMemo(() => {
    const m = new Map<string, number>()
    for (const c of changes) m.set(c.sectionId, (m.get(c.sectionId) ?? 0) + 1)
    return m
  }, [changes])

  // Jump to the paragraph we came from (a change, a question's source or a step card).
  useEffect(() => {
    if (!paragraphId) return
    const el = document.getElementById(`p-${paragraphId}`)
    if (el) {
      el.scrollIntoView({ block: 'center' })
      el.focus({ preventScroll: true })
    }
  }, [paragraphId, which])

  const markRead = (sectionId: string, read: boolean) => setReadIds(setSectionRead(progressKey, sectionId, read))

  // A chapter counts as read when its last sentence has been read aloud.
  const lastSegmentOf = useMemo(() => {
    const map = new Map<string, string>()
    for (const sec of leaflet.sections) {
      const segs = leafletSegments([sec])
      map.set(segs[segs.length - 1].id, sec.id)
    }
    return map
  }, [leaflet])

  const play = (sections: LeafletSection[], title: string) =>
    speech.play(leafletSegments(sections), {
      key: queueKey,
      title,
      onSegmentDone: (id) => {
        const sectionId = lastSegmentOf.get(id)
        if (sectionId) markRead(sectionId, true)
      },
    })

  const jumpTo = (id: string) => {
    const el = document.getElementById(id)
    el?.scrollIntoView({ block: 'center' })
    el?.focus({ preventScroll: true })
  }

  const readCount = leaflet.sections.filter((s) => readIds.includes(s.id)).length
  const isPlayingHere = speech.queueKey === queueKey && speech.status !== 'idle'
  const warningParas = leaflet.sections.filter((s) => isWarningSection(s.id)).flatMap((s) => s.paragraphs)
  const sideEffectParas = leaflet.sections.filter((s) => isSideEffectSection(s.id)).flatMap((s) => s.paragraphs)

  return (
    <div className="space-y-6">
      <BackLink href={links.overview(med.id)}>{t.leaflet.back}</BackLink>

      <header className="space-y-3">
        <h1 tabIndex={-1} className="text-2xl font-bold tracking-tight sm:text-3xl">{t.leaflet.title(med.name, med.strength)}</h1>
        {med.previous && (
          <nav aria-label={t.leaflet.versionNav} className="inline-flex rounded-xl bg-slate-200 p-1">
            {(['current', 'previous'] as const).map((w) => (
              <a
                key={w}
                href={links.leaflet(med.id, w, paragraphId)}
                aria-current={w === which ? 'page' : undefined}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${w === which ? 'bg-white text-teal-900 shadow' : 'text-slate-700 hover:text-slate-950'}`}
              >
                {w === 'current' ? t.leaflet.current : t.leaflet.previous} (v{(w === 'current' ? med.current : med.previous!).version})
              </a>
            ))}
          </nav>
        )}
        <p className="text-sm text-slate-600">{t.leaflet.intro(leaflet.version, formatDate(leaflet.publishedOn))}</p>
        {isPrevious ? (
          <p role="note" className="flex items-center gap-2 rounded-xl border-2 border-dashed border-amber-500 bg-amber-50 p-3 font-medium text-amber-950">
            <InfoIcon /> {t.leaflet.outdated}
          </p>
        ) : (
          <p className="flex items-center gap-2 text-sm font-medium text-teal-900"><CheckIcon className="size-4" /> {t.leaflet.isCurrent}</p>
        )}
      </header>

      {/* Read aloud controls */}
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => play(leaflet.sections, `${med.name} – ${t.leaflet.chapters}`)} className={`${btn.primary} py-4 text-lg`} disabled={!speech.supported}>
          <SpeakerIcon className="size-6" /> {t.leaflet.readAll}
        </button>
        <a href={links.listen(med.id)} className={btn.secondary}>{t.leaflet.listenMode}</a>
      </div>
      {isPlayingHere && <p className="text-sm text-slate-600">{t.leaflet.tapHint}</p>}

      {/* Colour legend + switch for change highlighting */}
      <Card className="space-y-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">{t.leaflet.legendTitle}</h2>
          {changes.length > 0 && (
            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
              <span>{t.leaflet.highlightChanges}</span>
              <input type="checkbox" role="switch" checked={showChanges} onChange={(e) => setShowChanges(e.target.checked)} className="peer sr-only" />
              <span aria-hidden="true" className="relative h-7 w-12 rounded-full bg-slate-300 transition peer-checked:bg-teal-700 peer-focus-visible:outline-3 peer-focus-visible:outline-teal-600 after:absolute after:left-1 after:top-1 after:size-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
            </label>
          )}
        </div>
        {highlight && med.previous && !isPrevious && (
          <p className="text-sm font-medium text-slate-800">{t.leaflet.changesSince(changes.length, med.previous.version, formatDate(med.previous.publishedOn))}</p>
        )}
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {highlight &&
            (['added', 'changed', 'removed'] as ChangeType[]).map((type) => (
              <li key={type} className="flex items-center gap-2">
                <span aria-hidden="true" className={`h-5 w-6 rounded ${changeBg[type]} ${changeStyle[type].card}`} />
                <ChangeBadge type={type} />
              </li>
            ))}
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="grid h-5 w-6 place-items-center rounded border-2 border-orange-500 bg-orange-50 text-orange-700"><WarningIcon className="size-3.5" /></span>
            {t.leaflet.warningLegend}
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="grid h-5 w-6 place-items-center rounded border-2 border-violet-500 bg-violet-50 text-violet-700"><PulseIcon className="size-3.5" /></span>
            {t.leaflet.sideEffectLegend}
          </li>
        </ul>
      </Card>

      {/* Chapters at a glance + progress */}
      <Card className="p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold">{t.leaflet.chapters}</h2>
          <p className="text-sm text-slate-600">{t.leaflet.progress(readCount, leaflet.sections.length)}</p>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
          <div className="h-full bg-teal-600 transition-all" style={{ width: `${(readCount / leaflet.sections.length) * 100}%` }} />
        </div>
        <ol className="mt-3 grid gap-1 sm:grid-cols-2">
          {leaflet.sections.map((sec) => {
            const n = changesPerSection.get(sec.id) ?? 0
            return (
              <li key={sec.id}>
                <a
                  href={`#h-${sec.id}`}
                  onClick={(e) => { e.preventDefault(); document.getElementById(`h-${sec.id}`)?.scrollIntoView({ block: 'start' }) }}
                  className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-slate-100"
                >
                  {readIds.includes(sec.id) ? (
                    <CheckIcon className="size-5 text-teal-700" />
                  ) : (
                    <span aria-hidden="true" className="size-5 shrink-0 rounded-full border-2 border-slate-300" />
                  )}
                  <span className="font-medium">{sec.title}</span>
                  {readIds.includes(sec.id) && <span className="sr-only">({t.leaflet.isRead})</span>}
                  {isWarningSection(sec.id) && <WarningIcon className="size-4 text-orange-600" />}
                  {isSideEffectSection(sec.id) && <PulseIcon className="size-4 text-violet-600" />}
                  {highlight && n > 0 && (
                    <span className="ml-auto shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900 ring-1 ring-amber-300">
                      {t.leaflet.changesInSection(n)}
                    </span>
                  )}
                </a>
              </li>
            )
          })}
        </ol>
      </Card>

      {/* Important at a glance: warnings + side effects (quoted) */}
      {(warningParas.length > 0 || sideEffectParas.length > 0) && (
        <section aria-labelledby="glance-heading" className="space-y-3 rounded-2xl border-2 border-orange-300 bg-white p-5 shadow-sm">
          <div>
            <h2 id="glance-heading" className="flex items-center gap-2 text-lg font-bold text-orange-900">
              <WarningIcon className="size-6 text-orange-600" /> {t.leaflet.atAGlance}
            </h2>
            <p className="text-sm text-slate-600">{t.leaflet.atAGlanceText}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <GlanceList title={t.leaflet.warningsLabel} icon={<WarningIcon className="size-5" />} tone="warning" items={warningParas.map((p) => ({ id: p.id, text: p.text }))} onJump={jumpTo} changeIds={highlight ? changeById : undefined} />
            <GlanceList title={t.leaflet.sideEffectsLabel} icon={<PulseIcon className="size-5" />} tone="side" items={sideEffectParas.map((p) => ({ id: p.id, text: p.text }))} onJump={jumpTo} changeIds={highlight ? changeById : undefined} />
          </div>
        </section>
      )}

      {/* Leaflet text */}
      <div className="space-y-4">
        {leaflet.sections.map((section) => {
          const titleActive = speech.currentId === `${section.id}::title`
          const read = readIds.includes(section.id)
          const warn = isWarningSection(section.id)
          const side = isSideEffectSection(section.id)
          const removedHere = highlight && !isPrevious ? changes.filter((c) => c.type === 'removed' && c.sectionId === section.id) : []
          const n = changesPerSection.get(section.id) ?? 0
          const frame = warn
            ? 'border-2 border-orange-400 bg-orange-50/40'
            : side
              ? 'border-2 border-violet-300 bg-violet-50/40'
              : 'border border-slate-200 bg-white'
          return (
            <section key={section.id} aria-labelledby={`h-${section.id}`} className={`scroll-mt-4 overflow-hidden rounded-2xl shadow-sm ${frame}`}>
              {(warn || side) && (
                <p className={`flex items-center gap-2 px-5 py-2 text-sm font-bold uppercase tracking-wide text-white ${warn ? 'bg-orange-600' : 'bg-violet-700'}`}>
                  {warn ? <WarningIcon className="size-5" /> : <PulseIcon className="size-5" />}
                  {warn ? t.leaflet.warningsLabel : t.leaflet.sideEffectsLabel}
                </p>
              )}
              <div className="space-y-3 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 id={`h-${section.id}`} className={`scroll-mt-4 rounded text-lg font-semibold ${titleActive ? 'bg-yellow-200' : ''}`}>
                    {section.title}
                    {highlight && n > 0 && (
                      <span className="ml-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 align-middle text-xs font-semibold text-amber-900 ring-1 ring-amber-300">
                        {t.leaflet.changesInSection(n)}
                      </span>
                    )}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => play([section], section.title)} className={btn.small} disabled={!speech.supported}>
                      <PlayIcon className="size-4" /> {t.leaflet.readChapter}
                    </button>
                    <button type="button" onClick={() => markRead(section.id, !read)} aria-pressed={read} className={`${btn.small} ${read ? 'border-teal-600 bg-teal-50 text-teal-900' : ''}`}>
                      <CheckIcon className="size-4" /> {read ? t.leaflet.isRead : t.leaflet.markRead}
                    </button>
                  </div>
                </div>

                {section.paragraphs.map((p) => {
                  const change = highlight ? changeById.get(p.id) : undefined
                  const isTarget = p.id === paragraphId
                  const freqs = side ? frequenciesIn(p.text) : []
                  return (
                    <div
                      key={`${which}-${p.id}`}
                      id={`p-${p.id}`}
                      tabIndex={-1}
                      className={`space-y-2 rounded-lg ${change ? `${changeBg[change.type]} py-3 pl-4 pr-3 ${changeStyle[change.type].card}` : ''} ${
                        isTarget ? 'flash outline-3 outline-offset-2 outline-teal-600' : ''
                      } focus:outline-none`}
                    >
                      {(change || freqs.length > 0) && (
                        <div className="flex flex-wrap items-center gap-2">
                          {change && <ChangeBadge type={change.type} />}
                          {freqs.map((f) => <FrequencyBadge key={f} f={f} />)}
                        </div>
                      )}
                      <div className="flex gap-2">
                        {warn && <WarningIcon className="mt-1 size-5 text-orange-600" />}
                        <SpeakableText paragraphId={p.id} text={p.text} className="text-slate-800" />
                      </div>
                      {/* Changed paragraph: show exactly which words changed */}
                      {change?.type === 'changed' && change.previousText && change.currentText && (
                        <div className="rounded-lg border border-amber-200 bg-white/80 p-3 text-sm">
                          <p className="mb-1 font-semibold text-amber-950">{t.leaflet.whatChanged}</p>
                          <DiffText before={change.previousText} after={change.currentText} />
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Text that was removed in the newest version, shown where it used to be */}
                {removedHere.map((c) => (
                  <div key={c.id} id={`p-${c.id}`} tabIndex={-1} className={`space-y-2 rounded-lg ${changeBg.removed} py-3 pl-4 pr-3 ${changeStyle.removed.card} focus:outline-none`}>
                    <ChangeBadge type="removed" />
                    <p className="text-sm font-medium text-rose-950">{t.leaflet.removedHere}</p>
                    <p className="text-slate-600 line-through decoration-rose-500 decoration-2">{c.previousText}</p>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

/** Word-level difference: new words underlined (blue), removed words struck through (rose). */
function DiffText({ before, after }: { before: string; after: string }) {
  const { t } = useI18n()
  return (
    <p className="leading-relaxed text-slate-800">
      {wordDiff(before, after).map((part, i) =>
        part.kind === 'same' ? (
          <span key={i}>{part.text}</span>
        ) : part.kind === 'inserted' ? (
          <ins key={i} className="rounded bg-blue-100 px-0.5 font-semibold text-blue-900 underline decoration-2 underline-offset-2">
            <span className="sr-only">{t.dialog.srAdded}</span>{part.text}<span className="sr-only">]</span>
          </ins>
        ) : (
          <del key={i} className="rounded bg-rose-100 px-0.5 text-rose-900">
            <span className="sr-only">{t.dialog.srRemoved}</span>{part.text}<span className="sr-only">]</span>
          </del>
        ),
      )}
    </p>
  )
}

/** Frequency as stated in the leaflet: text + 1–4 bars (never colour alone). */
function FrequencyBadge({ f }: { f: Frequency }) {
  const { t } = useI18n()
  const level = FREQUENCY_ORDER.length - FREQUENCY_ORDER.indexOf(f) // veryCommon = 4 … rare = 1
  return (
    <span title={t.leaflet.frequencyHint} className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-900 ring-1 ring-inset ring-violet-300">
      <span aria-hidden="true" className="flex items-end gap-0.5">
        {[1, 2, 3, 4].map((b) => (
          <span key={b} className={`w-1 rounded-sm ${b <= level ? 'bg-violet-700' : 'bg-violet-300'}`} style={{ height: `${4 + b * 2}px` }} />
        ))}
      </span>
      {t.leaflet.frequency[f]}
    </span>
  )
}

function GlanceList({
  title, icon, tone, items, onJump, changeIds,
}: {
  title: string
  icon: React.ReactNode
  tone: 'warning' | 'side'
  items: { id: string; text: string }[]
  onJump: (id: string) => void
  changeIds?: Map<string, LeafletChange>
}) {
  if (items.length === 0) return null
  const colours = tone === 'warning' ? 'border-orange-300 bg-orange-50 text-orange-950' : 'border-violet-300 bg-violet-50 text-violet-950'
  return (
    <div className={`rounded-xl border p-4 ${colours}`}>
      <h3 className="mb-2 flex items-center gap-2 font-semibold">{icon} {title}</h3>
      <ul className="space-y-2">
        {items.map((it) => {
          const change = changeIds?.get(it.id)
          return (
            <li key={it.id}>
              <button type="button" onClick={() => onJump(`p-${it.id}`)} className="w-full rounded-lg p-2 text-left text-sm text-slate-800 hover:bg-white/70">
                {change && <ChangeBadge type={change.type} className="mb-1" />}
                <span className="block">{splitSentences(it.text)[0]}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
