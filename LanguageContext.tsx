import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Lang } from '../data/types'
import { strings, type Strings } from './strings'

const STORAGE_KEY = 'leafletcheck-lang'
const DEFAULT_LANG: Lang = 'de' // German first; the user can switch to English.

interface I18n {
  lang: Lang
  t: Strings
  toggleLanguage: () => void
  formatDate: (iso: string) => string
}

const LanguageContext = createContext<I18n | null>(null)

function readStoredLang(): Lang {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === 'en' || stored === 'de' ? stored : DEFAULT_LANG
  } catch {
    return DEFAULT_LANG
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readStoredLang)

  // Keep <html lang> and the tab title in sync (important for screen readers and hyphenation).
  useEffect(() => {
    document.documentElement.lang = lang
    document.title = strings[lang].documentTitle
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* storage not available – language just isn't remembered */
    }
  }, [lang])

  const toggleLanguage = useCallback(() => setLang((l) => (l === 'de' ? 'en' : 'de')), [])

  const value = useMemo<I18n>(
    () => ({
      lang,
      t: strings[lang],
      toggleLanguage,
      formatDate: (iso: string) =>
        new Date(`${iso}T12:00:00`).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
    }),
    [lang, toggleLanguage],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18n {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useI18n must be used inside <LanguageProvider>')
  return ctx
}
