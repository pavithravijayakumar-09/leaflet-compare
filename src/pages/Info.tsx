import { DEMO_PHARMACY } from '../data/medications'
import { useI18n } from '../i18n/LanguageContext'
import { links } from '../lib/router'
import { BackLink, btn, Card, CheckIcon, PageTitle, PharmacyButton } from '../components/ui'

/** "Content & privacy" – the rules the app follows. */
export function About() {
  const { t } = useI18n()
  return (
    <div className="space-y-6">
      <BackLink href={links.home()}>{t.product.back}</BackLink>
      <PageTitle>{t.about.title}</PageTitle>
      <Card className="p-5">
        <ul className="space-y-3">
          {t.about.points.map((point) => (
            <li key={point} className="flex gap-3"><CheckIcon className="mt-0.5 size-5 text-teal-700" /> <span>{point}</span></li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

/** "Ask a pharmacy" – the human fallback for anything the leaflet does not answer. */
export function Help() {
  const { t } = useI18n()
  return (
    <div className="space-y-6">
      <BackLink href={links.home()}>{t.product.back}</BackLink>
      <PageTitle>{t.help.title}</PageTitle>
      <Card className="space-y-4 p-5">
        <p className="text-lg">{t.help.text}</p>
        <p className="font-semibold">{t.pharmacy.demoNumber(DEMO_PHARMACY.name, DEMO_PHARMACY.phone)}</p>
        <PharmacyButton className={`${btn.primary} py-4 text-lg`} />
      </Card>
    </div>
  )
}
