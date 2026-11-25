import { useState, type FormEvent } from 'react'
import { getMedications } from '../data/medications'
import { useI18n } from '../i18n/LanguageContext'
import { searchByName } from '../lib/search'
import { links, navigate } from '../lib/router'
import { BackLink, BarcodeIcon, btn, Card, ChevronRight, PageTitle, PharmacyButton, SearchIcon } from '../components/ui'
import { ProductCard } from '../components/ProductCard'

/*
 * Step S1 – result list of a typed name.
 * Several matches (e.g. Cardiovex 50 mg and 100 mg) → the user must pick one (explicit confirmation).
 * No match → "not found", no wrong suggestions.
 */
export function Search({ query }: { query: string }) {
  const { t, lang } = useI18n()
  const [value, setValue] = useState(query)
  const results = searchByName(getMedications(lang), query)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (value.trim()) navigate(links.search(value.trim()))
  }

  return (
    <div className="space-y-6">
      <BackLink href={links.home()}>{t.product.back}</BackLink>
      <PageTitle>{t.search.title(query)}</PageTitle>

      <form onSubmit={onSubmit} role="search" className="flex gap-2">
        <label htmlFor="search-again" className="sr-only">{t.home.type.label}</label>
        <input
          id="search-again"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="min-w-0 flex-1 rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-lg focus:border-teal-600 focus:outline-none"
        />
        <button type="submit" className={btn.primary} aria-label={t.home.type.button}>
          <SearchIcon /> <span className="hidden sm:inline">{t.home.type.button}</span>
        </button>
      </form>

      <p role="status" className="font-medium text-slate-800">
        {results.length === 0 ? '' : results.length === 1 ? t.search.one : t.search.several(results.length)}
      </p>

      {results.length === 0 ? (
        <Card className="space-y-3 p-6">
          <h2 className="text-xl font-semibold">{t.search.none}</h2>
          <p className="text-slate-700">{t.search.noneText}</p>
          <div className="flex flex-wrap gap-3">
            <a href={links.scan()} className={btn.primary}><BarcodeIcon className="size-5" /> {t.home.scan.title}</a>
            <PharmacyButton />
          </div>
        </Card>
      ) : (
        <ul className="space-y-3">
          {results.map((med) => (
            <li key={med.id}>
              <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <ProductCard med={med} compact />
                </div>
                <a href={links.overview(med.id, 'typed')} className={`${btn.primary} shrink-0`}>
                  {t.search.select} <ChevronRight />
                </a>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
