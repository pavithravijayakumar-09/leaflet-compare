import { useEffect, useState } from 'react'

/*
 * Tiny hash router (no extra library). Routes:
 *   #/                                   -> medication list
 *   #/med/:id                            -> medication overview
 *   #/med/:id/compare                    -> comparison screen
 *   #/med/:id/leaflet/:which?p=:paraId   -> original leaflet text (which = current | previous)
 */
export type Route =
  | { name: 'home' }
  | { name: 'overview'; medId: string }
  | { name: 'compare'; medId: string }
  | { name: 'leaflet'; medId: string; which: 'current' | 'previous'; paragraphId?: string }

export function parseHash(hash: string): Route {
  const [path, query = ''] = hash.replace(/^#/, '').split('?')
  const parts = path.split('/').filter(Boolean)
  const params = new URLSearchParams(query)

  if (parts[0] === 'med' && parts[1]) {
    const medId = parts[1]
    if (parts[2] === 'compare') return { name: 'compare', medId }
    if (parts[2] === 'leaflet') {
      const which = parts[3] === 'previous' ? 'previous' : 'current'
      return { name: 'leaflet', medId, which, paragraphId: params.get('p') ?? undefined }
    }
    return { name: 'overview', medId }
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
  overview: (medId: string) => `#/med/${medId}`,
  compare: (medId: string) => `#/med/${medId}/compare`,
  leaflet: (medId: string, which: 'current' | 'previous', paragraphId?: string) =>
    `#/med/${medId}/leaflet/${which}${paragraphId ? `?p=${paragraphId}` : ''}`,
}
