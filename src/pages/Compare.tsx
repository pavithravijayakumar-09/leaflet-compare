import { useMemo, useState } from 'react'
import type { Medication } from '../data/types'
import { compareMedication, countByType, groupBySection, type ChangeType, type LeafletChange } from '../lib/compare'
import { useI18n } from '../i18n/LanguageContext'
import { links } from '../lib/router'
import { BackLink, Card, ChangeBadge, ChevronRight, changeStyle, DocIcon, SafetyNote } from '../components/ui'
import { ChangeDialog } from '../components/ChangeDialog'

type Filter = 'all' | ChangeType

export function Compare({ med }: { med: Medication }) {
  const { t } = useI18n()
  const changes = useMemo(() => compareMedication(med), [med])
  const counts = countByType(changes)
  const [filter, setFilter] = useState<Filter>('all')
  // Store only the id, so an open dialog switches language together with the page.
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = changes.find((c) => c.id === selectedId) ?? null

  const visible = filter === 'all' ? changes : changes.filter((c) => c.type === filter)
  const groups = groupBySection(visible)

  return (
    <div className="space-y-6">
      <BackLink href={links.overview(med.id)}>{t.compare.back(med.name)}</BackLink>

      <header className="space-y-3">
        <h1 tabIndex={-1} className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t.compare.title(med.name)}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <VersionChip label={t.compare.previous} version={med.previous.version} date={med.previous.publishedOn} />
          <span aria-hidden="true" className="text-slate-400">→</span>
          <span className="sr-only">{t.compare.comparedWith}</span>
          <VersionChip label={t.compare.current} version={med.current.version} date={med.current.publishedOn} current />
        </div>
      </header>

      {/* Summary doubles as a filter */}
      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="sr-only">{t.compare.summaryHeading}</h2>
        <p className="mb-3 text-slate-700" aria-live="polite">
          <strong>{t.compare.changesFound(changes.length)}</strong>
          {t.compare.inSections(groupBySection(changes).length)}
          {filter !== 'all' && t.compare.showingOnly(t.changeTypes[filter].label)}
        </p>
        <div role="group" aria-label={t.compare.filterGroup} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} count={changes.length} label={t.compare.all} />
          {(['changed', 'added', 'removed'] as ChangeType[]).map((type) => (
            <FilterButton key={type} active={filter === type} onClick={() => setFilter(type)} count={counts[type]} type={type} label={t.changeTypes[type].label} />
          ))}
        </div>
      </section>

      {/* Legend */}
      <details className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
        <summary className="cursor-pointer font-medium text-slate-800">{t.compare.legendSummary}</summary>
        <ul className="mt-3 space-y-2">
          {(['added', 'changed', 'removed'] as ChangeType[]).map((type) => (
            <li key={type} className="flex flex-wrap items-center gap-2">
              <ChangeBadge type={type} /> <span className="text-slate-700">{t.changeTypes[type].description}</span>
            </li>
          ))}
          <li className="text-slate-600">
            {t.compare.legendBefore}
            <ins className="bg-blue-100 px-0.5 font-semibold text-blue-900 underline decoration-2">{t.compare.legendNewWords}</ins>
            {t.compare.legendMiddle}
            <del className="bg-rose-100 px-0.5 text-rose-900">{t.compare.legendRemovedWords}</del>
            {t.compare.legendAfter}
          </li>
        </ul>
      </details>

      {/* Changed sections */}
      <div className="space-y-5">
        {groups.map((group) => (
          <section key={group.sectionId} aria-labelledby={`sec-${group.sectionId}`}>
            <h2 id={`sec-${group.sectionId}`} className="mb-2 flex flex-wrap items-center gap-2 text-lg font-semibold">
              {group.sectionTitle}
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
                {t.compare.changeCount(group.changes.length)}
              </span>
            </h2>
            <ul className="space-y-2">
              {group.changes.map((change) => (
                <li key={change.id}>
                  <ChangeItem change={change} onOpen={() => setSelectedId(change.id)} />
                </li>
              ))}
            </ul>
          </section>
        ))}
        {groups.length === 0 && <Card className="p-6 text-center text-slate-600">{t.compare.noneOfType}</Card>}
      </div>

      <div className="flex flex-wrap gap-3">
        <a href={links.leaflet(med.id, 'current')} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-medium hover:border-teal-600 hover:text-teal-800">
          <DocIcon /> {t.compare.readFullCurrent}
        </a>
        <a href={links.leaflet(med.id, 'previous')} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-medium hover:border-teal-600 hover:text-teal-800">
          <DocIcon /> {t.compare.readFullPrevious}
        </a>
      </div>

      <SafetyNote />

      <ChangeDialog med={med} change={selected} onClose={() => setSelectedId(null)} />
    </div>
  )
}

function VersionChip({ label, version, date, current = false }: { label: string; version: string; date: string; current?: boolean }) {
  const { formatDate } = useI18n()
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 ${current ? 'bg-teal-100 text-teal-950' : 'bg-slate-200 text-slate-800'}`}>
      <span className="font-semibold">{label}</span> v{version} · <time dateTime={date}>{formatDate(date)}</time>
    </span>
  )
}

function FilterButton({ active, onClick, count, label, type }: { active: boolean; onClick: () => void; count: number; label: string; type?: ChangeType }) {
  const Icon = type ? changeStyle[type].Icon : null
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex items-center justify-between gap-2 rounded-xl border-2 px-4 py-3 text-left transition ${
        active ? 'border-teal-700 bg-teal-50' : 'border-slate-200 bg-white hover:border-slate-400'
      }`}
    >
      <span className="flex items-center gap-2 font-medium">
        {Icon && <Icon className="size-4" />}
        {label}
      </span>
      <span className="text-2xl font-bold tabular-nums">{count}</span>
    </button>
  )
}

function ChangeItem({ change, onOpen }: { change: LeafletChange; onOpen: () => void }) {
  const { t } = useI18n()
  const preview = change.type === 'removed' ? change.previousText : change.currentText
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className={`group flex w-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:bg-slate-50 hover:shadow-md ${changeStyle[change.type].card}`}
    >
      <div className="min-w-0 flex-1 space-y-2">
        <ChangeBadge type={change.type} />
        <p className={`line-clamp-2 text-slate-800 ${change.type === 'removed' ? 'text-slate-500 line-through' : ''}`}>{preview}</p>
        <p className="text-sm text-slate-600">{change.explanation ?? t.dialog.noExplanation}</p>
      </div>
      <span className="mt-1 flex items-center gap-1 text-sm font-medium text-teal-800">
        <span className="hidden sm:inline">{t.compare.details}</span>
        <ChevronRight className="size-5 transition group-hover:translate-x-0.5" />
      </span>
    </button>
  )
}
