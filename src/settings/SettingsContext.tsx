import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { load, save } from '../lib/storage'

/*
 * Display and voice settings ("Text & contrast"), saved on this device only.
 * They change how text LOOKS – never the leaflet wording.
 *  - text size + line spacing + contrast: for older or visually impaired users
 *    (UC2 "big visible buttons", metric "text readability", "accessibility")
 *  - voice rate: "voice pace can be saved" (UC2)
 */

export type TextSize = 'standard' | 'large' | 'larger' | 'largest'
export type Contrast = 'standard' | 'high' | 'dark'
export type LineSpacing = 'normal' | 'wide'

export const TEXT_SIZES: TextSize[] = ['standard', 'large', 'larger', 'largest']
export const CONTRASTS: Contrast[] = ['standard', 'high', 'dark']
export const LINE_SPACINGS: LineSpacing[] = ['normal', 'wide']
export const VOICE_RATES = [0.75, 1, 1.25] as const

const ROOT_FONT: Record<TextSize, string> = { standard: '100%', large: '115%', larger: '130%', largest: '150%' }

interface Display {
  textSize: TextSize
  contrast: Contrast
  lineSpacing: LineSpacing
}

const DEFAULT_DISPLAY: Display = { textSize: 'standard', contrast: 'standard', lineSpacing: 'normal' }

interface Settings extends Display {
  setDisplay: (d: Partial<Display>) => void
  resetDisplay: () => void
  rate: number
  setRate: (r: number) => void
}

const SettingsContext = createContext<Settings | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [display, setDisplayState] = useState<Display>(() => {
    const stored = load<Partial<Display>>('leafletcheck-display', {})
    return {
      textSize: TEXT_SIZES.includes(stored.textSize as TextSize) ? (stored.textSize as TextSize) : 'standard',
      contrast: CONTRASTS.includes(stored.contrast as Contrast) ? (stored.contrast as Contrast) : 'standard',
      lineSpacing: LINE_SPACINGS.includes(stored.lineSpacing as LineSpacing) ? (stored.lineSpacing as LineSpacing) : 'normal',
    }
  })
  const [rate, setRate] = useState<number>(() => load<number>('leafletcheck-voice-rate', 1))

  // Apply the display settings to the whole page (see index.css).
  useEffect(() => {
    const root = document.documentElement
    root.style.fontSize = ROOT_FONT[display.textSize]
    root.dataset.contrast = display.contrast
    root.dataset.spacing = display.lineSpacing
    save('leafletcheck-display', display)
  }, [display])

  useEffect(() => save('leafletcheck-voice-rate', rate), [rate])

  const value = useMemo<Settings>(
    () => ({
      ...display,
      setDisplay: (d) => setDisplayState((prev) => ({ ...prev, ...d })),
      resetDisplay: () => setDisplayState(DEFAULT_DISPLAY),
      rate,
      setRate,
    }),
    [display, rate],
  )
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings(): Settings {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>')
  return ctx
}
