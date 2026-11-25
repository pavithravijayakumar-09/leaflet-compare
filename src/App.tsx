import { useEffect, useMemo, useState } from 'react'
import { findMedication } from './data/medications'
import { useI18n } from './i18n/LanguageContext'
import { useRoute } from './lib/router'
import { CapsuleIcon, DemoBanner, LanguageToggle, NotFound, btn } from './components/ui'
import { DisplaySettings } from './components/DisplaySettings'
import { AudioBar } from './components/AudioBar'
import { Home } from './pages/Home'
import { Scan } from './pages/Scan'
import { Search } from './pages/Search'
import { Photo } from './pages/Photo'
import { Demo } from './pages/Demo'
import { About, Help } from './pages/Info'
import { Overview } from './pages/Overview'
import { Compare } from './pages/Compare'
import { LeafletViewer } from './pages/LeafletViewer'
import { Listen } from './pages/Listen'
import { Steps } from './pages/Steps'
import { Ask } from './pages/Ask'
import { Print } from './pages/Print'

export default function App() {
  const { t, lang } = useI18n()
  const route = useRoute()
  const [displayOpen, setDisplayOpen] = useState(false)
  const medId = 'medId' in route ? route.medId : null
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
  switch (route.name) {
    case 'home': page = <Home />; break
    case 'scan': page = <Scan />; break
    case 'search': page = <Search key={route.query} query={route.query} />; break
    case 'photo': page = <Photo />; break
    case 'demo': page = <Demo />; break
    case 'about': page = <About />; break
    case 'help': page = <Help />; break
    default:
      if (!med) page = <NotFound />
      else if (route.name === 'overview') page = <Overview med={med} via={route.via} />
      else if (route.name === 'compare') page = <Compare med={med} />
      else if (route.name === 'leaflet') page = <LeafletViewer med={med} which={route.which} paragraphId={route.paragraphId} />
      else if (route.name === 'listen') page = <Listen med={med} autoplay={route.autoplay} />
      else if (route.name === 'steps') page = <Steps key={med.id} med={med} />
      else if (route.name === 'ask') page = <Ask key={`${med.id}-${lang}`} med={med} initialQuestion={route.question} />
      else page = <Print med={med} />
  }

  return (
    <div className="min-h-dvh pb-28">
      <a href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }} className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
        {t.skipToContent}
      </a>
      <div className="no-print"><DemoBanner /></div>
      <header className="no-print border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3 px-4 py-3">
          <a href="#/" className="flex items-center gap-2 rounded-lg">
            <span className="grid size-10 place-items-center rounded-xl bg-teal-700 text-white">
              <CapsuleIcon className="size-6" />
            </span>
            <span>
              <span className="block font-bold leading-tight text-teal-900">LeafletCheck</span>
              <span className="block text-xs leading-tight text-slate-500">{t.brandSubtitle}</span>
            </span>
          </a>
          <div className="ml-auto flex items-center gap-2">
            <button type="button" onClick={() => setDisplayOpen(true)} className={btn.small} aria-haspopup="dialog">
              <span aria-hidden="true" className="font-serif font-bold">Aa</span>
              <span className="hidden sm:inline">{t.display.button}</span>
              <span className="sr-only sm:hidden">{t.display.button}</span>
            </button>
            <LanguageToggle />
          </div>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto max-w-4xl px-4 py-6 focus:outline-none sm:py-10">
        {page}
      </main>
      <footer className="no-print mx-auto max-w-4xl px-4 pb-10 text-xs text-slate-500">{t.footer}</footer>
      {route.name !== 'listen' && <AudioBar />}
      <DisplaySettings open={displayOpen} onClose={() => setDisplayOpen(false)} />
    </div>
  )
}
