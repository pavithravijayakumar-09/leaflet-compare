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

/** One "how to use" step card. Its text is always taken from a leaflet paragraph (no invented instructions). */
export interface RawStep {
  id: string
  icon: string
  title: Localized
  /** Paragraph of the current leaflet that this step quotes. */
  paragraphId: string
}

export interface RawMedication {
  id: string
  name: string
  strength: string
  form: Localized
  activeIngredient: Localized
  manufacturer: Localized
  prescribedFor: Localized
  packSize: Localized
  /** Pharmazentralnummer (German product code) – fictional. */
  pzn: string
  /** EAN-13 code printed as barcode on the box – fictional. */
  gtin: string
  /** Text printed on the blister strip (used to match a photo of the blister). */
  blisterText: string
  /** Main colour of the (drawn) package picture. */
  packColor: string
  current: RawLeafletVersion
  /** Previous leaflet version, or null if there is none. */
  previous: RawLeafletVersion | null
  explanations: Record<string, Localized>
  steps: RawStep[]
}

/* ---------- Data in ONE language (what the screens and the logic use) ---------- */

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

export interface Step {
  id: string
  icon: string
  title: string
  /** The quoted leaflet text for this step. */
  text: string
  paragraphId: string
  sectionTitle: string
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
  packSize: string
  pzn: string
  gtin: string
  blisterText: string
  packColor: string
  current: LeafletVersion
  previous: LeafletVersion | null
  /**
   * Plain-language explanations per paragraph id, written by a (fictional) leaflet editor.
   * They only describe WHAT the text says now — they never give advice.
   */
  explanations: Record<string, string>
  steps: Step[]
}
