import type { Medication } from '../data/types'

/*
 * Finding a medicine (step S1 of all three use cases).
 * Rules from the step sheet:
 *  - a barcode contains an exact code → exact match only (no guessing)
 *  - a typed name may match several products → the user must choose (explicit confirmation)
 *  - nothing found → show "not found", never a "similar" wrong product
 */

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove accents (ä → a)
    .replace(/µ/g, 'u')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Exact match on the barcode number (EAN/GTIN) or the PZN. */
export function findByCode(meds: Medication[], code: string): Medication | undefined {
  const digits = code.replace(/\D/g, '')
  if (!digits) return undefined
  return meds.find((m) => m.gtin === digits || m.pzn === digits || m.pzn === digits.replace(/^0+/, ''))
}

/** Typo-tolerant name search: "cardivex" still finds "Cardiovex". */
export function searchByName(meds: Medication[], query: string): Medication[] {
  const q = normalize(query)
  if (!q) return []
  // A code typed into the search box also works.
  const byCode = findByCode(meds, q)
  if (byCode && /^\d{8,13}$/.test(q.replace(/ /g, ''))) return [byCode]

  const words = q.split(' ')
  return meds.filter((m) => {
    const haystack = normalize(`${m.name} ${m.strength} ${m.activeIngredient}`)
    const tokens = haystack.split(' ')
    return words.every((w) => tokens.some((t) => t.startsWith(w) || (w.length >= 5 && levenshtein(w, t) <= 2)))
  })
}

/**
 * Match the text recognised on a photo of a blister strip (OCR) against the product names.
 * Returns candidates; the user must still tap the one that matches the blister.
 */
export function matchBlisterText(meds: Medication[], ocrText: string): Medication[] {
  const tokens = normalize(ocrText).split(' ').filter(Boolean)
  const scored = meds
    .map((m) => {
      const name = normalize(m.name)
      const nameHit = tokens.some((t) => t === name || (t.length >= 5 && levenshtein(t, name) <= 2))
      const strengthNumber = m.strength.replace(/\D/g, '')
      const strengthHit = tokens.includes(strengthNumber)
      return { m, score: (nameHit ? 2 : 0) + (nameHit && strengthHit ? 1 : 0) }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
  return scored.map((x) => x.m)
}

/** Edit distance between two words (number of single-letter changes). */
export function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...new Array<number>(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
  }
  return dp[a.length][b.length]
}
