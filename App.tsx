import { useEffect, useMemo } from 'react'
import { findMedication } from './data/medications'
import { useI18n } from './i18n/LanguageContext'
import { useRoute } from './lib/router'
import { CapsuleIcon, DemoBanner, LanguageToggle, NotFound } from './components/ui'
import { Home } from './pages/Home'
import { Overview } from './pages/Overview'
import { Compare } from './pages/Compare'
import { LeafletViewer } from './pages/LeafletViewer'

export default function App() {
  const { t, lang } = useI18n()
  const route = useRoute()
  const medId = route.name === 'home' ? null : route.medId
  // Load the medication in the selected language (German by default).
  const med = useMemo(() => (medId ? findMedication(medId, lang) : undefined), [medId, lang])
  const routeKey = JSON.stringify(route)

  // On page change: scroll to top and move focus to the page heading (screen-reader friendly).
  // (When jumping to a paragraph in the leaflet, the LeafletViewer handles scrolling itself.)
  const jumpsToParagraph = route.name === 'leaflet' && !!route.paragraphId
  useEffect(() => {
    if (jumpsToParagraph) return
    window.scrollTo({ top: 0 })
    document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true })
  }, [routeKey, jumpsToParagraph])

  let page
  if (route.name === 'home') page = <Home />
  else if (!med) page = <NotFound />
  else if (route.name === 'overview') page = <Overview med={med} />
  else if (route.name === 'compare') page = <Compare med={med} />
  else page = <LeafletViewer med={med} which={route.which} paragraphId={route.paragraphId} />

  return (
    <div className="min-h-dvh">
      <a href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }} className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
        {t.skipToContent}
      </a>
      <DemoBanner />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <a href="#/" className="flex items-center gap-2 rounded-lg font-bold text-teal-800">
            <span className="grid size-8 place-items-center rounded-lg bg-teal-700 text-white">
              <CapsuleIcon className="size-5" />
            </span>
            LeafletCheck
          </a>
          <span className="ml-auto hidden text-sm text-slate-500 md:inline">{t.tagline}</span>
          <div className="ml-auto md:ml-0">
            <LanguageToggle />
          </div>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto max-w-4xl px-4 py-6 sm:py-10 focus:outline-none">
        {page}
      </main>
      <footer className="mx-auto max-w-4xl px-4 pb-10 text-xs text-slate-500">{t.footer}</footer>
    </div>
  )
}
