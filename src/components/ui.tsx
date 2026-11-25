import type { ReactNode } from 'react'
import type { ChangeType } from '../lib/compare'
import { useI18n } from '../i18n/LanguageContext'
import { DEMO_PHARMACY } from '../data/medications'

/* ---------------- Icons (inline SVG, decorative) ---------------- */

type IconProps = { className?: string }
const base = 'shrink-0'
const Svg = ({ className = 'size-5', children, viewBox = '0 0 24 24', strokeWidth = 1.8 }: IconProps & { children: ReactNode; viewBox?: string; strokeWidth?: number }) => (
  <svg aria-hidden="true" viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    {children}
  </svg>
)

export const PlusIcon = ({ className = 'size-4' }: IconProps) => <Svg className={className} viewBox="0 0 20 20" strokeWidth={2.5}><path d="M10 4v12M4 10h12" /></Svg>
export const MinusIcon = ({ className = 'size-4' }: IconProps) => <Svg className={className} viewBox="0 0 20 20" strokeWidth={2.5}><path d="M4 10h12" /></Svg>
export const PencilIcon = ({ className = 'size-4' }: IconProps) => <Svg className={className} viewBox="0 0 20 20" strokeWidth={2}><path d="M13.5 3.5l3 3L7 16H4v-3l9.5-9.5z" /></Svg>
export const ChevronRight = ({ className = 'size-5' }: IconProps) => <Svg className={className} viewBox="0 0 20 20" strokeWidth={2}><path d="M8 5l5 5-5 5" /></Svg>
export const ChevronLeft = ({ className = 'size-5' }: IconProps) => <Svg className={className} viewBox="0 0 20 20" strokeWidth={2}><path d="M12 5l-5 5 5 5" /></Svg>
export const CloseIcon = ({ className = 'size-5' }: IconProps) => <Svg className={className} viewBox="0 0 20 20" strokeWidth={2}><path d="M5 5l10 10M15 5L5 15" /></Svg>
export const CheckIcon = ({ className = 'size-5' }: IconProps) => <Svg className={className} strokeWidth={2.2}><path d="M5 12.5l4.5 4.5L19 7" /></Svg>
export const DocIcon = ({ className = 'size-5' }: IconProps) => (
  <Svg className={className}><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></Svg>
)
export const CompareIcon = ({ className = 'size-5' }: IconProps) => (
  <Svg className={className}><rect x="3" y="4" width="7" height="16" rx="1.5" /><rect x="14" y="4" width="7" height="16" rx="1.5" /><path d="M5.5 9h2M5.5 13h2M16.5 9h2M16.5 13h2" /></Svg>
)
export const CapsuleIcon = ({ className = 'size-7' }: IconProps) => (
  <Svg className={className}><rect x="2.5" y="8" width="19" height="8" rx="4" transform="rotate(-35 12 12)" /><path d="M9.6 8.6l4.6 6.6" /></Svg>
)
export const InfoIcon = ({ className = 'size-5' }: IconProps) => (
  <Svg className={className}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></Svg>
)
export const GlobeIcon = ({ className = 'size-5' }: IconProps) => (
  <Svg className={className}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" /></Svg>
)
export const BarcodeIcon = ({ className = 'size-7' }: IconProps) => (
  <Svg className={className}><path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" /><path d="M7 8v8M10 8v8M13 8v8M16 8v8" strokeWidth={2.2} /></Svg>
)
export const KeyboardIcon = ({ className = 'size-7' }: IconProps) => (
  <Svg className={className}><rect x="2.5" y="6" width="19" height="12" rx="2" /><path d="M6 10h.01M9 10h.01M12 10h.01M15 10h.01M18 10h.01M7 14h10" /></Svg>
)
export const CameraIcon = ({ className = 'size-7' }: IconProps) => (
  <Svg className={className}><path d="M4 8h3l2-3h6l2 3h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" /><circle cx="12" cy="13" r="3.5" /></Svg>
)
export const SearchIcon = ({ className = 'size-5' }: IconProps) => <Svg className={className}><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></Svg>
export const SpeakerIcon = ({ className = 'size-5' }: IconProps) => (
  <Svg className={className}><path d="M4 9.5v5h3.5L12 19V5L7.5 9.5H4z" /><path d="M15.5 9a4 4 0 010 6M18 6.5a7.5 7.5 0 010 11" /></Svg>
)
export const PlayIcon = ({ className = 'size-5' }: IconProps) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={`${base} ${className}`} fill="currentColor"><path d="M8 5.5v13a1 1 0 001.5.86l10.5-6.5a1 1 0 000-1.72L9.5 4.64A1 1 0 008 5.5z" /></svg>
)
export const PauseIcon = ({ className = 'size-5' }: IconProps) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={`${base} ${className}`} fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
)
export const StopIcon = ({ className = 'size-5' }: IconProps) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={`${base} ${className}`} fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1.5" /></svg>
)
export const PhoneIcon = ({ className = 'size-5' }: IconProps) => (
  <Svg className={className}><path d="M5 4h3l1.5 4-2 1.5a11 11 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" /></Svg>
)
export const PrinterIcon = ({ className = 'size-5' }: IconProps) => (
  <Svg className={className}><path d="M7 8V3h10v5" /><rect x="3" y="8" width="18" height="9" rx="2" /><path d="M7 14h10v7H7z" /></Svg>
)
export const StepsIcon = ({ className = 'size-5' }: IconProps) => (
  <Svg className={className}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 9h2M7 13h2M7 17h2M12 9h5M12 13h5M12 17h5" /></Svg>
)
export const QuestionIcon = ({ className = 'size-5' }: IconProps) => (
  <Svg className={className}><path d="M4 5h16v11H9l-5 4V5z" /><path d="M10 9a2 2 0 113 1.7c-.6.4-1 .8-1 1.3M12 14h.01" /></Svg>
)
export const WarningIcon = ({ className = 'size-5' }: IconProps) => (
  <Svg className={className}><path d="M12 3.5L2.5 20h19L12 3.5z" /><path d="M12 10v4.5M12 17.2h.01" strokeWidth={2.2} /></Svg>
)
export const PulseIcon = ({ className = 'size-5' }: IconProps) => (
  <Svg className={className}><path d="M3 12h4l2-5 4 10 2-5h6" /></Svg>
)
export const BookIcon =({ className = 'size-5' }: IconProps) => (
  <Svg className={className}><path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5z" /><path d="M4 19a2 2 0 012-2h13" /></Svg>
)

/* ---------------- Change type styles ----------------
 * Never colour-only: every type has an icon, a text label (from the translations), and a distinct border style.
 * Colours are blue / amber / rose (distinguishable for common colour-vision deficiencies).
 */
export const changeStyle: Record<ChangeType, { Icon: (p: IconProps) => ReactNode; badge: string; card: string }> = {
  added: { Icon: PlusIcon, badge: 'bg-blue-50 text-blue-800 ring-blue-300', card: 'border-l-4 border-solid border-l-blue-600' },
  changed: { Icon: PencilIcon, badge: 'bg-amber-50 text-amber-900 ring-amber-300', card: 'border-l-4 border-double border-l-amber-500' },
  removed: { Icon: MinusIcon, badge: 'bg-rose-50 text-rose-800 ring-rose-300', card: 'border-l-4 border-dashed border-l-rose-600' },
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

/* ---------------- Buttons ---------------- */

export const btn = {
  primary: 'inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:opacity-50',
  secondary: 'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:border-teal-600 hover:text-teal-800',
  small: 'inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 transition hover:border-teal-600 hover:text-teal-800',
}

/* ---------------- Layout helpers ---------------- */

export function LanguageToggle() {
  const { t, toggleLanguage } = useI18n()
  return (
    <button type="button" onClick={toggleLanguage} aria-label={t.language.ariaLabel} lang={t.language.buttonLang} className={btn.small}>
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
    <aside aria-label={t.safety.ariaLabel} className={`flex gap-3 rounded-xl border border-slate-200 bg-white text-slate-700 ${compact ? 'p-3 text-sm' : 'p-4'}`}>
      <InfoIcon className="mt-0.5 size-5 text-teal-700" />
      <p>
        {t.safety.before}
        <strong>{t.safety.strong}</strong>
        {t.safety.after}
      </p>
    </aside>
  )
}

/** "Contact your pharmacist" – a fictional demo pharmacy number (tel: link). */
export function PharmacyButton({ className = btn.secondary }: { className?: string }) {
  const { t } = useI18n()
  return (
    <a href={DEMO_PHARMACY.tel} className={className} title={t.pharmacy.demoNumber(DEMO_PHARMACY.name, DEMO_PHARMACY.phone)}>
      <PhoneIcon />
      {t.pharmacy.call}
    </a>
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

export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 tabIndex={-1} className="text-2xl font-bold tracking-tight sm:text-3xl">{children}</h1>
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
