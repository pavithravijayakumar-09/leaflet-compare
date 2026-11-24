import { getMedications } from '../data/medications'
import { useI18n } from '../i18n/LanguageContext'
import { links } from '../lib/router'
import { CapsuleIcon, Card, ChevronRight } from '../components/ui'

export function Home() {
  const { t, lang, formatDate } = useI18n()
  const medications = getMedications(lang)

  return (
    <div className="space-y-6">
      <div>
        <h1 tabIndex={-1} className="text-3xl font-bold tracking-tight">{t.home.title}</h1>
        <p className="mt-1 text-slate-600">{t.home.intro}</p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {medications.map((med) => (
          <li key={med.id}>
            <a href={links.overview(med.id)} className="group block h-full rounded-2xl">
              <Card className="flex h-full items-start gap-4 p-5 transition group-hover:border-teal-400 group-hover:shadow-md">
                <div className="grid size-12 place-items-center rounded-xl bg-teal-50 text-teal-700">
                  <CapsuleIcon />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold">
                    {med.name} {med.strength}
                  </h2>
                  <p className="text-sm text-slate-600">{med.form}</p>
                  <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-900">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-teal-600" />
                    {t.home.newVersion} · {formatDate(med.current.publishedOn)}
                  </p>
                </div>
                <ChevronRight className="mt-1 size-5 text-slate-400 group-hover:text-teal-700" />
              </Card>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
