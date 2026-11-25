/*
 * Split leaflet text into sentences for read-aloud.
 * Reading sentence by sentence lets us highlight the sentence being spoken and
 * lets the user tap any sentence to hear it again.
 */
export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ0-9„"(])/u)
    .map((s) => s.trim())
    .filter(Boolean)
}

/** Stable id of one sentence of a paragraph, e.g. "use-dose::1". */
export const sentenceId = (paragraphId: string, index: number) => `${paragraphId}::${index}`
