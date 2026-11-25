import { useEffect, useRef } from 'react'
import { useI18n } from '../i18n/LanguageContext'
import { CONTRASTS, LINE_SPACINGS, TEXT_SIZES, useSettings } from '../settings/SettingsContext'
import { btn, CloseIcon } from './ui'

/** "Text & contrast" panel: changes only how text looks, never the leaflet wording. */
export function DisplaySettings({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n()
  const s = useSettings()
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  const sizeClass = { standard: 'text-sm', large: 'text-base', larger: 'text-lg', largest: 'text-xl' } as const

  return (
    <dialog
      ref={ref}
      aria-labelledby="display-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto w-[min(100%-1.5rem,32rem)] max-h-[92vh] rounded-2xl bg-white p-0 shadow-2xl"
    >
      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id="display-title" className="text-xl font-bold">
            <span aria-hidden="true" className="mr-1 font-serif">Aa</span> {t.display.title}
          </h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label={t.display.done}>
            <CloseIcon />
          </button>
        </div>
        <p className="text-sm text-slate-600">{t.display.note}</p>

        <fieldset>
          <legend className="mb-2 font-semibold">{t.display.textSize}</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TEXT_SIZES.map((size) => (
              <Choice key={size} checked={s.textSize === size} name="text-size" onChange={() => s.setDisplay({ textSize: size })}>
                <span aria-hidden="true" className={`font-serif font-bold ${sizeClass[size]}`}>A</span> {t.display.sizes[size]}
              </Choice>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 font-semibold">{t.display.contrast}</legend>
          <div className="grid grid-cols-3 gap-2">
            {CONTRASTS.map((c) => (
              <Choice key={c} checked={s.contrast === c} name="contrast" onChange={() => s.setDisplay({ contrast: c })}>
                {t.display.contrasts[c]}
              </Choice>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 font-semibold">{t.display.lineSpacing}</legend>
          <div className="grid grid-cols-2 gap-2">
            {LINE_SPACINGS.map((sp) => (
              <Choice key={sp} checked={s.lineSpacing === sp} name="spacing" onChange={() => s.setDisplay({ lineSpacing: sp })}>
                {t.display.spacings[sp]}
              </Choice>
            ))}
          </div>
        </fieldset>

        <figure className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <figcaption className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.display.previewLabel}</figcaption>
          <p className="mt-1">{t.display.preview}</p>
        </figure>

        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" onClick={s.resetDisplay} className={btn.secondary}>{t.display.reset}</button>
          <button type="button" onClick={onClose} className={btn.primary}>{t.display.done}</button>
        </div>
      </div>
    </dialog>
  )
}

function Choice({ checked, name, onChange, children }: { checked: boolean; name: string; onChange: () => void; children: React.ReactNode }) {
  return (
    <label
      className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2.5 text-center text-sm font-medium transition has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-teal-600 ${
        checked ? 'border-teal-700 bg-teal-50 text-teal-950' : 'border-slate-200 bg-white hover:border-slate-400'
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      {children}
    </label>
  )
}
