import type { Medication } from '../data/types'
import { useI18n } from '../i18n/LanguageContext'
import { absoluteListenUrl, links } from '../lib/router'
import { BackLink, btn, Card, PrinterIcon } from '../components/ui'
import { QrPicture } from '../components/Pictures'

/*
 * UC2 S4 – print the leaflet for dad.
 * Explicit confirmation: the user sees this preview before printing.
 * The printout contains the version, the date and a QR code that opens the read-aloud page (UC2 S5).
 */
export function Print({ med }: { med: Medication }) {
  const { t, formatDate } = useI18n()
  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="space-y-6">
      <div className="no-print space-y-4">
        <BackLink href={links.overview(med.id)}>{t.leaflet.back}</BackLink>
        <h1 tabIndex={-1} className="text-2xl font-bold sm:text-3xl">{t.print.title}</h1>
        <p className="text-slate-600">{t.print.intro}</p>
        <button type="button" onClick={() => window.print()} className={`${btn.primary} py-4 text-lg`}>
          <PrinterIcon className="size-6" /> {t.print.printNow}
        </button>
      </div>

      {/* The printable page */}
      <Card className="print-page space-y-5 p-6 sm:p-10">
        <header className="flex flex-col gap-4 border-b border-slate-300 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{t.print.leafletHeading}</p>
            <p className="text-2xl font-bold">{med.name} {med.strength}</p>
            <p>{med.form} · {med.manufacturer} · PZN {med.pzn}</p>
            <p className="mt-2 font-semibold">{t.print.versionLine(med.current.version, formatDate(med.current.publishedOn))}</p>
            <p className="text-sm text-slate-600">{t.print.printedOn(formatDate(today))}</p>
          </div>
          <figure className="w-36 shrink-0 text-center">
            <QrPicture value={absoluteListenUrl(med.id)} className="w-36" label={t.print.qrCaption} />
            <figcaption className="mt-1 text-xs text-slate-600">{t.print.qrCaption}</figcaption>
          </figure>
        </header>

        {med.current.sections.map((sec) => (
          <section key={sec.id} className="break-inside-avoid space-y-1">
            <h2 className="text-lg font-bold">{sec.title}</h2>
            {sec.paragraphs.map((p) => <p key={p.id} className="leading-relaxed">{p.text}</p>)}
          </section>
        ))}
        <p className="border-t border-slate-300 pt-3 text-xs text-slate-500">{t.footer}</p>
      </Card>
    </div>
  )
}
