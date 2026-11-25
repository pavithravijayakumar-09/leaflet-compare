import type { Medication } from '../data/types'
import { useI18n } from '../i18n/LanguageContext'
import { PackagePhoto } from './Pictures'

/**
 * Product details used to verify the exact medicine (step S1):
 * name, strength, manufacturer, PZN and a picture of the pack.
 * Missing values are shown as "not available" – never guessed.
 */
export function ProductCard({ med, compact = false }: { med: Medication; compact?: boolean }) {
  const { t } = useI18n()
  const na = t.product.notAvailable
  const facts: [string, string][] = compact
    ? [
        [t.product.manufacturer, med.manufacturer || na],
        [t.product.pzn, med.pzn || na],
      ]
    : [
        [t.product.form, med.form || na],
        [t.product.activeSubstance, med.activeIngredient || na],
        [t.product.manufacturer, med.manufacturer || na],
        [t.product.prescribedFor, med.prescribedFor || na],
        [t.product.packSize, med.packSize || na],
        [t.product.pzn, med.pzn || na],
      ]

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <figure className="shrink-0 self-center sm:self-start">
        <PackagePhoto med={med} className={compact ? 'w-32' : 'w-44'} />
        <figcaption className="mt-1 text-center text-xs text-slate-500">{t.product.packPhoto}</figcaption>
      </figure>
      <div className="min-w-0 flex-1">
        <p className="text-xl font-bold">
          {med.name} <span className="whitespace-nowrap">{med.strength}</span>
        </p>
        {compact && <p className="text-sm text-slate-600">{med.form}</p>}
        <dl className={`mt-3 grid gap-x-6 gap-y-2 ${compact ? 'grid-cols-1' : 'sm:grid-cols-2'}`}>
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
              <dd className={`font-medium ${value === na ? 'italic text-slate-500' : ''}`}>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
