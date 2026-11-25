import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './i18n/LanguageContext'
import { SettingsProvider } from './settings/SettingsContext'
import { SpeechProvider } from './speech/SpeechContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <SettingsProvider>
        <SpeechProvider>
          <App />
        </SpeechProvider>
      </SettingsProvider>
    </LanguageProvider>
  </StrictMode>,
)

// Offline use (UC1 "leaflet saved for offline use"): cache the app after the first visit.
// Only in the production build, so it never gets in the way while developing.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      /* offline cache is optional */
    })
  })
}
