/*
 * Small wrapper around localStorage. Everything stays on this device (no account, no server).
 * Every access is wrapped in try/catch because storage can be blocked (private mode).
 */

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

export function save<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage not available – the app still works, it just doesn't remember */
  }
}

export const KEYS = {
  lang: 'leafletcheck-lang',
  savedMeds: 'leafletcheck-saved-meds',
  readSections: 'leafletcheck-read-sections',
} as const

/* ---- "My medicines" saved on this device (UC1: leaflet saved for offline use) ---- */

export function getSavedMeds(): string[] {
  return load<string[]>(KEYS.savedMeds, [])
}

export function addSavedMed(id: string): void {
  const list = getSavedMeds().filter((x) => x !== id)
  save(KEYS.savedMeds, [id, ...list].slice(0, 10))
}

/* ---- Reading progress per medicine + leaflet version (UC1) ---- */

type ReadMap = Record<string, string[]>

export function getReadSections(key: string): string[] {
  return load<ReadMap>(KEYS.readSections, {})[key] ?? []
}

export function setSectionRead(key: string, sectionId: string, read: boolean): string[] {
  const all = load<ReadMap>(KEYS.readSections, {})
  const set = new Set(all[key] ?? [])
  if (read) set.add(sectionId)
  else set.delete(sectionId)
  all[key] = [...set]
  save(KEYS.readSections, all)
  return all[key]
}
