import type { ReactNode } from 'react'
import type { ChangeType } from '../lib/compare'
import { useI18n } from '../i18n/LanguageContext'

/* ---------------- Icons (inline SVG, decorative) ---------------- */

type IconProps = { className?: string }
const base = 'shrink-0'

export const PlusIcon = ({ className = 'size-4' }: IconProps) => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.5} className={`${base} ${className}`}>
    <path strokeLinecap="round" d="M10 4v12M4 10h12" />
  </svg>
)
export const MinusIcon = ({ className = 'size-4' }: IconProps) => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.5} className={`${base} ${className}`}>
    <path strokeLinecap="round" d="M4 10h12" />
  </svg>
)
export const PencilIcon = ({ className = 'size-4' }: IconProps) => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} className={`${base} ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 3.5l3 3L7 16H4v-3l9.5-9.5z" />
  </svg>
)
export const ChevronRight = ({ className = 'size-5' }: IconProps) => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} className={`${base} ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 5l5 5-5 5" />
  </svg>
)
export const ChevronLeft = ({ className = 'size-5' }: IconProps) => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} className={`${base} ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5l-5 5 5 5" />
  </svg>
)
export const DocIcon = ({ className = 'size-5' }: IconProps) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={`${base} ${className}`}>
    <path strokeLinejoin="round" d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" />
    <path strokeLinejoin="round" d="M14 3v5h5M9 13h6M9 17h6" />
  </svg>
)
export const CompareIcon = ({ className = 'size-5' }: IconProps) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={`${base} ${className}`}>
    <rect x="3" y="4" width="7" height="16" rx="1.5" />
    <rect x="14" y="4" width="7" height="16" rx="1.5" />
    <path strokeLinecap="round" d="M5.5 9h2M5.5 13h2M16.5 9h2M16.5 13h2" />
  </svg>
)
export const CapsuleIcon = ({ className = 'size-7' }: IconProps) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={`${base} ${className}`}>
    <rect x="2.5" y="8" width="19" height="8" rx="4" transform="rotate(-35 12 12)" />
    <path d="M9.6 8.6l4.6 6.6" />
  </svg>
)
export const InfoIcon = ({ className = 'size-5' }: IconProps) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={`${base} ${className}`}>
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" d="M12 11v5M12 8h.01" />
  </svg>
)
export const CloseIcon = ({ className = 'size-5' }: IconProps) => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} className={`${base} ${className}`}>
    <path strokeLinecap="round" d="M5 5l10 10M15 5L5 15" />
  </svg>
)
export const GlobeIcon = ({ className = 'size-5' }: IconProps) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={`${base} ${className}`}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
  </svg>
)

/* ---------------- Change type styles ----------------
 * Never colour-only: every type has an icon, a text label (from the translations), and a distinct border style.
 * Colours are blue / amber / rose (distinguishable for common colour-vision deficiencies).
 */
export const changeStyle: Record<ChangeType, { Icon: (p: IconProps) => ReactNode; badge: string; card: string }> = {
  added: {
    Icon: PlusIcon,
    badge: 'bg-blue-50 text-blue-800 ring-blue-300',
    card: 'border-l-4 border-solid border-l-blue-600',
  },
  changed: {
    Icon: PencilIcon,
    badge: 'bg-amber-50 text-amber-900 ring-amber-300',
    card: 'border-l-4 border-double border-l-amber-500',
  },
  removed: {
    Icon: MinusIcon,
    badge: 'bg-rose-50 text-rose-800 ring-rose-300',
    card: 'border-l-4 border-dashed border-l-rose-600',
  },
}

export function ChangeBadge({ type, className = '' }: { type: ChangeType; className?: string }) {
  const { t } = useI18n()
  const s = changeStyle[type]
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset ${s.badge} ${className}`}>
      <s.Icon className="size-3.5" />
      {t.changeTypes[type].label}
    </span>
  )
}

/* ---------------- Layout helpers ---------------- */

export function LanguageToggle() {
  const { t, toggleLanguage } = useI18n()
  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={t.language.ariaLabel}
      lang={t.language.buttonLang}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-teal-600 hover:text-teal-800"
    >
      <GlobeIcon className="size-4" />
      {t.language.buttonLabel}
    </button>
  )
}

export function DemoBanner() {
  const { t } = useI18n()
  return (
    <div role="note" className="bg-slate-900 px-4 py-2 text-center text-sm text-white">
      <strong className="font-semibold">{t.demoBanner.strong}</strong> {t.demoBanner.text}
    </div>
  )
}

export function SafetyNote({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n()
  return (
    <aside
      aria-label={t.safety.ariaLabel}
      className={`flex gap-3 rounded-xl border border-slate-200 bg-white text-slate-700 ${compact ? 'p-3 text-sm' : 'p-4'}`}
    >
      <InfoIcon className="mt-0.5 size-5 text-teal-700" />
      <p>
        {t.safety.before}
        <strong>{t.safety.strong}</strong>
        {t.safety.after}
      </p>
    </aside>
  )
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="inline-flex items-center gap-1 rounded-md py-1 text-sm font-medium text-teal-800 hover:text-teal-950 hover:underline">
      <ChevronLeft className="size-4" />
      {children}
    </a>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>
}

export function NotFound() {
  const { t } = useI18n()
  return (
    <div className="py-16 text-center">
      <h1 tabIndex={-1} className="text-2xl font-bold">{t.notFound.title}</h1>
      <p className="mt-2 text-slate-600">
        <a className="text-teal-800 underline" href="#/">{t.notFound.back}</a>
      </p>
    </div>
  )
}
