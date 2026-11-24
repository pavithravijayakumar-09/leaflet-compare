import { useEffect, useMemo } from 'react'
import type { Medication } from '../data/types'
import { compareMedication, type ChangeType } from '../lib/compare'
import { useI18n } from '../i18n/LanguageContext'
import { links } from '../lib/router'
import { BackLink, Card, ChangeBadge, changeStyle } from '../components/ui'

/** Shows the original leaflet text of one version, so the patient can verify a change. */
export function LeafletViewer({ med, which, paragraphId }: { med: Medication; which: 'current' | 'previous'; paragraphId?: string }) {
  const { t, formatDate } = useI18n()
  const leaflet = med[which]
  const changes = useMemo(() => compareMedication(med), [med])

  // Which paragraphs to mark in this version (added/changed in current, changed/removed in previous).
  const marks = useMemo(() => {
    const m = new Map<string, ChangeType>()
    for (const c of changes) {
      if (which === 'current' && c.type !== 'removed') m.set(c.id, c.type)
      if (which === 'previous' && c.type !== 'added') m.set(c.id, c.type)
    }
    return m
  }, [changes, which])

  // Jump to the paragraph we came from.
  useEffect(() => {
    if (!paragraphId) return
    const el = document.getElementById(`p-${paragraphId}`)
    if (el) {
      el.scrollIntoView({ block: 'center' })
      el.focus({ preventScroll: true })
    }
  }, [paragraphId, which])

  return (
    <div className="space-y-6">
      <BackLink href={links.compare(med.id)}>{t.leaflet.back}</BackLink>

      <header className="space-y-3">
        <h1 tabIndex={-1} className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t.leaflet.title(med.name, med.strength)}
        </h1>
        <nav aria-label={t.leaflet.versionNav} className="inline-flex rounded-xl bg-slate-200 p-1">
          {(['current', 'previous'] as const).map((w) => (
            <a
              key={w}
              href={links.leaflet(med.id, w, paragraphId)}
              aria-current={w === which ? 'page' : undefined}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${w === which ? 'bg-white text-teal-900 shadow' : 'text-slate-700 hover:text-slate-950'}`}
            >
              {w === 'current' ? t.leaflet.current : t.leaflet.previous} (v{med[w].version})
            </a>
          ))}
        </nav>
        <p className="text-sm text-slate-600">{t.leaflet.intro(leaflet.version, formatDate(leaflet.publishedOn))}</p>
      </header>

      <Card className="divide-y divide-slate-100">
        {leaflet.sections.map((section) => (
          <section key={section.id} aria-labelledby={`h-${section.id}`} className="space-y-3 p-5 sm:p-6">
            <h2 id={`h-${section.id}`} className="text-lg font-semibold">{section.title}</h2>
            {section.paragraphs.map((p) => {
              const type = marks.get(p.id)
              const isTarget = p.id === paragraphId
              return (
                <div
                  key={`${which}-${p.id}`}
                  id={`p-${p.id}`}
                  tabIndex={isTarget ? -1 : undefined}
                  className={`rounded-lg ${type ? `bg-slate-50 py-2 pl-4 pr-3 ${changeStyle[type].card}` : ''} ${isTarget ? 'flash outline-3 outline-offset-2 outline-teal-600' : ''}`}
                >
                  {type && <ChangeBadge type={type} className="mb-1" />}
                  <p className="leading-relaxed text-slate-800">{p.text}</p>
                </div>
              )
            })}
          </section>
        ))}
      </Card>
    </div>
  )
}
