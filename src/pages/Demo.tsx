import { useRef } from 'react'
import { getMedications } from '../data/medications'
import type { Medication } from '../data/types'
import { useI18n } from '../i18n/LanguageContext'
import { absoluteListenUrl, links } from '../lib/router'
import { BackLink, btn, Card, PageTitle } from '../components/ui'
import { BlisterPicture, downloadSvgAsPng, Ean13Barcode, PackagePhoto, QrPicture } from '../components/Pictures'

/*
 * Demo guide: how to try each use case, plus a barcode, a blister picture and a QR code
 * for every fictional medicine. Show them on a second screen, print them, or save them as
 * pictures and choose them in the scanner / blister photo page.
 */
export function Demo() {
  const { t, lang } = useI18n()
  const meds = getMedications(lang)

  return (
    <div className="space-y-6">
      <BackLink href={links.home()}>{t.product.back}</BackLink>
      <div className="space-y-2">
        <PageTitle>{t.demo.title}</PageTitle>
        <p className="text-slate-700">{t.demo.intro}</p>
      </div>

      <Card className="p-5">
        <h2 className="mb-2 text-lg font-semibold">{t.demo.useCases}</h2>
        <ul className="list-disc space-y-1 pl-5 text-slate-800">
          <li>{t.demo.uc1}</li>
          <li>{t.demo.uc2}</li>
          <li>{t.demo.uc3}</li>
        </ul>
      </Card>

      <ul className="space-y-4">
        {meds.map((med) => <DemoPack key={med.id} med={med} />)}
      </ul>
    </div>
  )
}

function DemoPack({ med }: { med: Medication }) {
  const { t } = useI18n()
  const barcodeRef = useRef<HTMLDivElement>(null)
  const blisterRef = useRef<HTMLDivElement>(null)
  const file = (kind: string) => `${med.name.replace(/\W+/g, '-')}-${med.strength.replace(/\W+/g, '')}-${kind}.png`.toLowerCase()

  return (
    <li>
      <Card className="space-y-4 p-5">
        <div className="flex items-center gap-4">
          <PackagePhoto med={med} className="w-24" />
          <div>
            <h2 className="text-lg font-semibold">{med.name} {med.strength}</h2>
            <p className="text-sm text-slate-600">{med.form} · {med.manufacturer} · PZN {med.pzn}</p>
            {med.id === 'cardiovex-100' && <p className="text-sm font-medium text-amber-800">{t.demo.sameName}</p>}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <figure className="space-y-2">
            <figcaption className="text-sm font-semibold">{t.demo.barcode}</figcaption>
            <div ref={barcodeRef} className="rounded-lg border border-slate-200 bg-white p-2"><Ean13Barcode code={med.gtin} className="w-full" /></div>
            <button type="button" className={btn.small} onClick={() => downloadSvgAsPng(barcodeRef.current?.querySelector('svg') ?? null, file('barcode'))}>{t.demo.download}</button>
          </figure>
          <figure className="space-y-2">
            <figcaption className="text-sm font-semibold">{t.demo.blister}</figcaption>
            <div ref={blisterRef} className="rounded-lg border border-slate-200 bg-white p-2"><BlisterPicture text={med.blisterText} className="w-full" /></div>
            <button type="button" className={btn.small} onClick={() => downloadSvgAsPng(blisterRef.current?.querySelector('svg') ?? null, file('blister'), 3)}>{t.demo.download}</button>
          </figure>
          <figure className="space-y-2">
            <figcaption className="text-sm font-semibold">{t.demo.qr}</figcaption>
            <div className="rounded-lg border border-slate-200 bg-white p-2"><QrPicture value={absoluteListenUrl(med.id)} className="mx-auto w-32" label={t.demo.qr} /></div>
          </figure>
        </div>
      </Card>
    </li>
  )
}
