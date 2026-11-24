// Data model for the prototype. Everything here is local mock data.

export type Lang = 'de' | 'en'

/** A text that exists in German and English. */
export type Localized = Record<Lang, string>

/* ---------- Stored (bilingual) data ---------- */

export interface RawParagraph {
  id: string
  text: Localized
}

export interface RawSection {
  id: string
  title: Localized
  paragraphs: RawParagraph[]
}

export interface RawLeafletVersion {
  version: string
  publishedOn: string
  sections: RawSection[]
}

export interface RawMedication {
  id: string
  name: string
  strength: string
  form: Localized
  activeIngredient: Localized
  manufacturer: Localized
  prescribedFor: Localized
  current: RawLeafletVersion
  previous: RawLeafletVersion
  explanations: Record<string, Localized>
}

/* ---------- Data in ONE language (what the screens and the comparison use) ---------- */

/** One paragraph of a leaflet section. `id` stays stable across versions so we can match it. */
export interface Paragraph {
  id: string
  text: string
}

export interface LeafletSection {
  id: string
  title: string
  paragraphs: Paragraph[]
}

export interface LeafletVersion {
  version: string
  /** ISO date (YYYY-MM-DD) when this leaflet version was published. */
  publishedOn: string
  sections: LeafletSection[]
}

export interface Medication {
  id: string
  name: string
  strength: string
  form: string
  activeIngredient: string
  manufacturer: string
  /** Fictional patient context shown on the overview card. */
  prescribedFor: string
  current: LeafletVersion
  previous: LeafletVersion
  /**
   * Plain-language explanations per paragraph id, written by a (fictional) leaflet editor.
   * They only describe WHAT the text says now — they never give advice.
   */
  explanations: Record<string, string>
}
