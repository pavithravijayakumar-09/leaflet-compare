import { useEffect, type ReactNode } from 'react'
import type { Medication } from '../data/types'
import { useI18n } from '../i18n/LanguageContext'
import { compareMedication } from '../lib/compare'
import { addSavedMed } from '../lib/storage'
import { links, type FoundVia } from '../lib/router'
import {
  BackLink, BookIcon, btn, Card, CheckIcon, CompareIcon, InfoIcon, PharmacyButton, PrinterIcon, QuestionIcon, SafetyNote, SpeakerIcon, StepsIcon,
} from '../components/ui'
import { ProductCard } from '../components/ProductCard'

/*
 * Product page.
 *  - Found by typing or blister photo → "Is this your medicine?" (explicit confirmation)
 *  - Found by barcode → exact match, shown directly (implicit confirmation)
 * Then: leaflet version + last revised date (UC2/UC3 "is it up to date?"),
 * changes first if there is a newer version (UC3), and big buttons for every task.
 */
export function Overview({ med, via }: { med: Medication; via?: FoundVia }) {
  const { t, formatDate } = useI18n()
  const needsConfirmation = via === 'typed' || via === 'photo'

  // Opening a medicine saves it on this device ("My medicines", offline copy – UC1).
  useEffect(() => {
    if (!needsConfirmation) addSavedMed(med.id)
  }, [med.id, needsConfirmation])

  if (needsConfirmation) {
    return (
      <div className="space-y-6">
        <BackLink href={links.home()}>{t.product.back}</BackLink>
        <Card className="space-y-5 p-5 sm:p-6">
          <div>
            <h1 tabIndex={-1} className="text-2xl font-bold">{t.product.confirmTitle}</h1>
            <p className="mt-1 text-slate-600">{t.product.confirmText}</p>
          </div>
          <ProductCard med={med} />
          <div className="flex flex-wrap gap-3">
            <a href={links.overview(med.id)} className={`${btn.primary} py-4 text-lg`}>
              <CheckIcon /> {t.product.confirmYes}
            </a>
            <a href={links.home()} className={`${btn.secondary} py-4 text-lg`}>{t.product.confirmNo}</a>
          </div>
        </Card>
      </div>
    )
  }

  const changes = compareMedication(med)

  return (
    <div className="space-y-6">
      <BackLink href={links.home()}>{t.product.back}</BackLink>

      {via === 'scan' && (
        <p role="status" className="flex items-center gap-2 rounded-xl bg-teal-50 p-3 font-medium text-teal-900">
          <CheckIcon className="size-5 text-teal-700" /> {t.product.scannedExact(med.pzn)}
        </p>
      )}

      <Card className="p-5 sm:p-6">
        <h1 tabIndex={-1} className="sr-only">{med.name} {med.strength}</h1>
        <ProductCard med={med} />
      </Card>

      {/* Leaflet version and validity */}
      <Card className="space-y-2 p-5">
        <h2 className="text-lg font-semibold">{t.product.leafletHeading}</h2>
        <p className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-sm font-semibold text-teal-900">{t.product.version(med.current.version)}</span>
          <span className="text-slate-700">
            {t.product.lastUpdated}: <time dateTime={med.current.publishedOn} className="font-semibold">{formatDate(med.current.publishedOn)}</time>
          </span>
        </p>
        <p className="flex items-center gap-2 text-sm text-teal-900"><CheckIcon className="size-4" /> {t.product.isCurrent}</p>
        <p className="flex items-center gap-2 text-sm text-slate-600"><InfoIcon className="size-4" /> {t.product.savedOffline}</p>
      </Card>

      {/* UC3: newer version → show changes first */}
      {med.previous && changes.length > 0 && (
        <section aria-labelledby="new-version" className="space-y-3 rounded-2xl border-2 border-amber-400 bg-amber-50 p-5">
          <h2 id="new-version" className="flex items-center gap-2 text-lg font-bold text-amber-950">
            <InfoIcon className="size-6" /> {t.product.newVersionTitle}
          </h2>
          <p className="text-amber-950">{t.product.newVersionText(changes.length, formatDate(med.previous.publishedOn))}</p>
          <a href={links.compare(med.id)} className={`${btn.primary} py-4 text-lg`}>
            <CompareIcon /> {t.product.showChanges}
          </a>
        </section>
      )}

      <section aria-labelledby="actions-heading" className="space-y-3">
        <h2 id="actions-heading" className="text-xl font-semibold">{t.product.actionsHeading}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Action href={links.leaflet(med.id)} icon={<BookIcon className="size-7" />} {...t.product.actions.read} />
          <Action href={links.listen(med.id)} icon={<SpeakerIcon className="size-7" />} {...t.product.actions.listen} />
          {med.steps.length > 0 && <Action href={links.steps(med.id)} icon={<StepsIcon className="size-7" />} {...t.product.actions.steps} />}
          <Action href={links.ask(med.id)} icon={<QuestionIcon className="size-7" />} {...t.product.actions.ask} />
          {med.previous && <Action href={links.compare(med.id)} icon={<CompareIcon className="size-7" />} {...t.product.actions.compare} />}
          <Action href={links.print(med.id)} icon={<PrinterIcon className="size-7" />} {...t.product.actions.print} />
        </div>
        <PharmacyButton className={`${btn.secondary} w-full py-4 text-lg sm:w-auto`} />
      </section>

      <SafetyNote />
    </div>
  )
}

function Action({ href, icon, title, text }: { href: string; icon: ReactNode; title: string; text: string }) {
  return (
    <a href={href} className="group flex min-h-20 items-center gap-4 rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-600 hover:shadow-md">
      <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-teal-700 text-white">{icon}</span>
      <span>
        <span className="block text-lg font-semibold text-slate-900 group-hover:text-teal-900">{title}</span>
        <span className="block text-sm text-slate-600">{text}</span>
      </span>
    </a>
  )
}
