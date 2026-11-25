import { useEffect, useState } from 'react'

/*
 * Tiny hash router (no extra library). Routes:
 *   #/                                  start: scan / type name / photo of blister
 *   #/scan                              camera barcode + QR scanner
 *   #/search?q=…                        results of a typed name
 *   #/photo                             photo of a blister strip (text recognition)
 *   #/demo                              demo guide + demo packs with barcodes to try the scanner
 *   #/about, #/help                     content & privacy rules, ask a pharmacy
 *   #/med/:id?via=…                     product check + medicine overview
 *   #/med/:id/leaflet/:which?p=…        leaflet (current | previous), chapters, read aloud
 *   #/med/:id/listen                    read-aloud mode with big buttons
 *   #/med/:id/steps                     "how to use" step cards
 *   #/med/:id/ask                       question about the leaflet (answers with citations)
 *   #/med/:id/compare                   compare current with previous leaflet (UC3)
 *   #/med/:id/print                     print preview with QR code (UC2)
 */

/** How the medicine was found. Decides whether the user still has to confirm it. */
export type FoundVia = 'scan' | 'typed' | 'photo' | 'saved'

export type Route =
  | { name: 'home' }
  | { name: 'scan' }
  | { name: 'search'; query: string }
  | { name: 'photo' }
  | { name: 'demo' }
  | { name: 'about' }
  | { name: 'help' }
  | { name: 'overview'; medId: string; via?: FoundVia }
  | { name: 'compare'; medId: string }
  | { name: 'leaflet'; medId: string; which: 'current' | 'previous'; paragraphId?: string }
  | { name: 'listen'; medId: string; autoplay: boolean }
  | { name: 'steps'; medId: string }
  | { name: 'ask'; medId: string; question?: string }
  | { name: 'print'; medId: string }

export function parseHash(hash: string): Route {
  const [path, query = ''] = hash.replace(/^#/, '').split('?')
  const parts = path.split('/').filter(Boolean)
  const params = new URLSearchParams(query)

  if (parts[0] === 'scan') return { name: 'scan' }
  if (parts[0] === 'search') return { name: 'search', query: params.get('q') ?? '' }
  if (parts[0] === 'photo') return { name: 'photo' }
  if (parts[0] === 'demo') return { name: 'demo' }
  if (parts[0] === 'about') return { name: 'about' }
  if (parts[0] === 'help') return { name: 'help' }

  if (parts[0] === 'med' && parts[1]) {
    const medId = parts[1]
    switch (parts[2]) {
      case 'compare':
        return { name: 'compare', medId }
      case 'leaflet':
        return { name: 'leaflet', medId, which: parts[3] === 'previous' ? 'previous' : 'current', paragraphId: params.get('p') ?? undefined }
      case 'listen':
        return { name: 'listen', medId, autoplay: params.get('autoplay') === '1' }
      case 'steps':
        return { name: 'steps', medId }
      case 'ask':
        return { name: 'ask', medId, question: params.get('q') ?? undefined }
      case 'print':
        return { name: 'print', medId }
      default: {
        const via = params.get('via')
        return { name: 'overview', medId, via: via === 'scan' || via === 'typed' || via === 'photo' ? via : undefined }
      }
    }
  }
  return { name: 'home' }
}

export function useRoute(): Route {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return parseHash(hash)
}

export const links = {
  home: () => '#/',
  scan: () => '#/scan',
  search: (q: string) => `#/search?q=${encodeURIComponent(q)}`,
  photo: () => '#/photo',
  demo: () => '#/demo',
  about: () => '#/about',
  help: () => '#/help',
  overview: (medId: string, via?: FoundVia) => `#/med/${medId}${via && via !== 'saved' ? `?via=${via}` : ''}`,
  compare: (medId: string) => `#/med/${medId}/compare`,
  leaflet: (medId: string, which: 'current' | 'previous' = 'current', paragraphId?: string) =>
    `#/med/${medId}/leaflet/${which}${paragraphId ? `?p=${paragraphId}` : ''}`,
  listen: (medId: string, autoplay = false) => `#/med/${medId}/listen${autoplay ? '?autoplay=1' : ''}`,
  steps: (medId: string) => `#/med/${medId}/steps`,
  ask: (medId: string, question?: string) => `#/med/${medId}/ask${question ? `?q=${encodeURIComponent(question)}` : ''}`,
  print: (medId: string) => `#/med/${medId}/print`,
}

/** Full URL of the read-aloud page, used in the QR code on the printout (UC2). */
export function absoluteListenUrl(medId: string): string {
  return `${window.location.origin}${window.location.pathname}${links.listen(medId, true)}`
}

export function navigate(hash: string): void {
  window.location.hash = hash
}
