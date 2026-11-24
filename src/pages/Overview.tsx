import type { LeafletVersion, Medication } from '../data/types'
import { useI18n } from '../i18n/LanguageContext'
import { links } from '../lib/router'
import { BackLink, CapsuleIcon, Card, CompareIcon, DocIcon, SafetyNote } from '../components/ui'

export function Overview({ med }: { med: Medication }) {
  const { t } = useI18n()
  return (
    <div className="space-y-6">
      <BackLink href={links.home()}>{t.overview.back}</BackLink>

      {/* Medication overview card */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-4 bg-gradient-to-r from-teal-700 to-teal-600 p-5 text-white sm:p-6">
          <div className="grid size-14 place-items-center rounded-2xl bg-white/15">
            <CapsuleIcon className="size-8" />
          </div>
          <div>
            <h1 tabIndex={-1} className="text-2xl font-bold sm:text-3xl">
              {med.name} {med.strength}
            </h1>
            <p className="text-teal-50">{med.form}</p>
          </div>
        </div>
        <dl className="grid gap-x-6 gap-y-4 p-5 sm:grid-cols-3 sm:p-6">
          <Fact label={t.overview.activeSubstance} value={med.activeIngredient} />
          <Fact label={t.overview.prescribedFor} value={med.prescribedFor} />
          <Fact label={t.overview.manufacturer} value={med.manufacturer} />
        </dl>
      </Card>

      {/* Leaflet versions */}
      <section aria-labelledby="versions-heading" className="space-y-3">
        <h2 id="versions-heading" className="text-xl font-semibold">{t.overview.versionsHeading}</h2>
        <Card>
          <ul className="divide-y divide-slate-200">
            <VersionRow med={med} version={med.current} which="current" />
            <VersionRow med={med} version={med.previous} which="previous" />
          </ul>
        </Card>

        <a
          href={links.compare(med.id)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-teal-800 sm:w-auto sm:inline-flex"
        >
          <CompareIcon />
          {t.overview.compare}
        </a>
        <p className="text-sm text-slate-600">{t.overview.compareHint(med.previous.version, med.current.version)}</p>
      </section>

      <SafetyNote />
    </div>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  )
}

function VersionRow({ med, version, which }: { med: Medication; version: LeafletVersion; which: 'current' | 'previous' }) {
  const { t, formatDate } = useI18n()
  const isCurrent = which === 'current'
  const label = isCurrent ? t.overview.current : t.overview.previous
  return (
    <li className="flex flex-wrap items-center gap-3 p-4 sm:p-5">
      <DocIcon className={`size-6 ${isCurrent ? 'text-teal-700' : 'text-slate-400'}`} />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 font-semibold">
          {label}
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              isCurrent ? 'bg-teal-100 text-teal-900' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {t.overview.version(version.version)}
          </span>
        </p>
        <p className="text-sm text-slate-600">
          {t.overview.published} <time dateTime={version.publishedOn}>{formatDate(version.publishedOn)}</time>
        </p>
      </div>
      <a
        href={links.leaflet(med.id, which)}
        aria-label={t.overview.readAria(label)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 hover:border-teal-600 hover:text-teal-800"
      >
        {t.overview.read}
      </a>
    </li>
  )
}
