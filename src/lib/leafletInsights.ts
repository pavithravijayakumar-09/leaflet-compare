/*
 * Helpers to highlight important parts of a leaflet.
 * They only LABEL text that is already in the leaflet – they never add information.
 */

export type Frequency = 'veryCommon' | 'common' | 'uncommon' | 'rare'

/** Order from most to least frequent (used for the little bar icon: 4 bars … 1 bar). */
export const FREQUENCY_ORDER: Frequency[] = ['veryCommon', 'common', 'uncommon', 'rare']

/** Chapters that get a special highlight on the leaflet page. */
export const isWarningSection = (sectionId: string) => sectionId === 'warnings'
export const isSideEffectSection = (sectionId: string) => sectionId === 'side-effects'

/**
 * Which frequency words does a side-effect paragraph use? ("Häufig", "Common", …)
 * "Sehr häufig"/"Very common" is checked first so it is not also counted as "häufig"/"common",
 * and "Uncommon" is not mistaken for "common".
 */
export function frequenciesIn(text: string): Frequency[] {
  let rest = text.toLowerCase()
  const found = new Set<Frequency>()
  const take = (re: RegExp, f: Frequency) => {
    if (re.test(rest)) {
      found.add(f)
      rest = rest.replace(re, ' ')
    }
  }
  take(/sehr häufig|very common/g, 'veryCommon')
  take(/gelegentlich|\buncommon\b/g, 'uncommon')
  take(/häufig|\bcommon\b/g, 'common')
  take(/selten|\brare\b/g, 'rare')
  return FREQUENCY_ORDER.filter((f) => found.has(f))
}
