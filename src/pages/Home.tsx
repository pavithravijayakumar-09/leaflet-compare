import { useState, type FormEvent } from 'react'
import { getMedications } from '../data/medications'
import { useI18n } from '../i18n/LanguageContext'
import { getSavedMeds } from '../lib/storage'
import { links, navigate } from '../lib/router'
import { BarcodeIcon, btn, CameraIcon, Card, ChevronRight, KeyboardIcon, SearchIcon } from '../components/ui'
import { PackagePhoto } from '../components/Pictures'

/*
 * Start page – step S1 of all three use cases: identify the medicine.
 * Three equivalent ways in (modality "switching"): scan barcode/QR, type the name, photo of the blister.
 */
export function Home() {
  const { t, lang, formatDate } = useI18n()
  const [query, setQuery] = useState('')
  const [error, setError] = useState(false)
  const all = getMedications(lang)
  const saved = getSavedMeds()
    .map((id) => all.find((m) => m.id === id))
    .filter((m) => m !== undefined)

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim()) {
      setError(true)
      return
    }
    navigate(links.search(query.trim()))
  }

  return (
    <div className="space-y-8">
      {/* Intro + help links */}
      <div className="space-y-3">
        <p className="text-slate-700">
          {t.intro.text}
          <a href={links.help()} className="font-medium text-teal-800 underline underline-offset-2">{t.intro.link}</a>.
        </p>
        <nav aria-label={t.nav.label} className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
          <a href={links.help()} className="text-teal-800 hover:underline">{t.nav.pharmacy}</a>
          <a href={links.about()} className="text-teal-800 hover:underline">{t.nav.about}</a>
          <a href={links.demo()} className="text-teal-800 hover:underline">{t.nav.demo}</a>
        </nav>
      </div>

      <section aria-labelledby="find-heading" className="space-y-4">
        <div>
          <h1 id="find-heading" tabIndex={-1} className="text-3xl font-bold tracking-tight">{t.home.title}</h1>
          <p className="mt-1 text-slate-600">{t.home.lead}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* 1. Scan */}
          <Card className="flex flex-col p-5">
            <OptionHead icon={<BarcodeIcon />} number={1} title={t.home.scan.title} text={t.home.scan.text} />
            <a href={links.scan()} className={`${btn.primary} mt-auto w-full py-4 text-lg`}>
              <BarcodeIcon className="size-6" /> {t.home.scan.button}
            </a>
          </Card>

          {/* 2. Type the name */}
          <Card className="flex flex-col p-5">
            <OptionHead icon={<KeyboardIcon />} number={2} title={t.home.type.title} text={t.home.type.text} />
            <form onSubmit={onSearch} className="mt-auto space-y-2" role="search">
              <label htmlFor="home-search" className="sr-only">{t.home.type.label}</label>
              <input
                id="home-search"
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setError(false)
                }}
                placeholder={t.home.type.placeholder}
                autoComplete="off"
                aria-invalid={error}
                aria-describedby={error ? 'home-search-error' : undefined}
                className="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-lg focus:border-teal-600 focus:outline-none"
              />
              {error && <p id="home-search-error" className="text-sm font-medium text-rose-700">{t.search.empty}</p>}
              <button type="submit" className={`${btn.primary} w-full py-4 text-lg`}>
                <SearchIcon className="size-6" /> {t.home.type.button}
              </button>
            </form>
          </Card>

          {/* 3. Photo of the blister */}
          <Card className="flex flex-col p-5">
            <OptionHead icon={<CameraIcon />} number={3} title={t.home.photo.title} text={t.home.photo.text} />
            <a href={links.photo()} className={`${btn.primary} mt-auto w-full py-4 text-lg`}>
              <CameraIcon className="size-6" /> {t.home.photo.button}
            </a>
          </Card>
        </div>
      </section>

      {/* My medicines (saved on this device, offline) */}
      <section aria-labelledby="saved-heading" className="space-y-3">
        <div>
          <h2 id="saved-heading" className="text-xl font-semibold">{t.home.saved.title}</h2>
          <p className="text-sm text-slate-600">{t.home.saved.text}</p>
        </div>
        {saved.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 p-4 text-slate-600">{t.home.saved.empty}</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {saved.map((med) => (
              <li key={med.id}>
                <a href={links.overview(med.id)} className="group block rounded-2xl">
                  <Card className="flex items-center gap-4 p-4 transition group-hover:border-teal-400 group-hover:shadow-md">
                    <PackagePhoto med={med} className="w-20" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{med.name} {med.strength}</p>
                      <p className="text-sm text-slate-600">{med.form}</p>
                      {med.previous && (
                        <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-900">
                          <span aria-hidden="true" className="size-1.5 rounded-full bg-teal-600" />
                          {t.home.newVersion} · {formatDate(med.current.publishedOn)}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="size-5 text-slate-400 group-hover:text-teal-700" />
                  </Card>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function OptionHead({ icon, number, title, text }: { icon: React.ReactNode; number: number; title: string; text: string }) {
  return (
    <div className="mb-4 flex gap-3">
      <div className="relative grid size-12 shrink-0 place-items-center rounded-xl bg-teal-50 text-teal-700">
        {icon}
        <span aria-hidden="true" className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-teal-700 text-xs font-bold text-white">{number}</span>
      </div>
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-slate-600">{text}</p>
      </div>
    </div>
  )
}
