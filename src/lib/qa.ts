import type { Medication } from '../data/types'
import { compareMedication, type LeafletChange } from './compare'
import { normalize } from './search'
import { splitSentences } from './sentences'

/*
 * Question → leaflet passage ("bot" from the step sheets, without generative AI).
 *
 * Hard rule from the failure scenarios: answer ONLY with text from the leaflet and always cite it.
 * If no passage matches well enough, the answer is "not in the leaflet" + ask the pharmacy.
 * The app never writes its own medical sentence (e.g. it never guesses WHY a capsule changed colour).
 */

export interface Citation {
  paragraphId: string
  sectionId: string
  sectionTitle: string
  /** The best-matching sentence (short answer). */
  sentence: string
  /** The whole paragraph (shown when the user opens the source). */
  paragraph: string
  score: number
  /** If this passage changed in the newest leaflet version (UC3). */
  change?: LeafletChange
}

export interface Answer {
  found: boolean
  best?: Citation
  more: Citation[]
}

/** Words with the same meaning (German + English) are mapped to one concept. */
const CONCEPTS: Record<string, string[]> = {
  food: ['essen', 'mahlzeit', 'mahlzeiten', 'fruhstuck', 'nuchtern', 'nuchternen', 'magen', 'food', 'meal', 'meals', 'eat', 'eating', 'breakfast', 'stomach', 'empty'],
  colour: ['farbe', 'farben', 'grun', 'grune', 'grunen', 'rot', 'rote', 'roten', 'aussehen', 'aussieht', 'kapselhulle', 'weisse', 'blauer', 'color', 'colour', 'green', 'red', 'look', 'looks', 'white', 'blue', 'changed'],
  missed: ['vergessen', 'vergessene', 'doppelte', 'nachholen', 'forgot', 'forget', 'forgotten', 'missed', 'miss', 'double'],
  storage: ['lagern', 'lagerung', 'aufbewahren', 'aufbewahrung', 'temperatur', 'kuhlschrank', 'store', 'storage', 'stored', 'keep', 'fridge', 'temperature'],
  sideEffects: ['nebenwirkung', 'nebenwirkungen', 'husten', 'schwindel', 'kopfschmerzen', 'zittern', 'herzklopfen', 'unruhe', 'schwitzen', 'side', 'effect', 'effects', 'cough', 'dizzy', 'dizziness', 'headache', 'tremor', 'shaking', 'palpitations', 'sweating'],
  driving: ['fahren', 'autofahren', 'auto', 'fahrzeug', 'maschinen', 'drive', 'driving', 'car', 'machines'],
  dose: ['dosis', 'dosierung', 'wieviel', 'viele', 'spruhstosse', 'spruhstoss', 'dose', 'dosage', 'much', 'many', 'puff', 'puffs'],
  grapefruit: ['grapefruit', 'grapefruitsaft', 'saft', 'juice'],
  ironCalcium: ['eisen', 'calcium', 'calciumpraparate', 'eisenpraparate', 'iron'],
  water: ['wasser', 'schlucken', 'water', 'swallow'],
  morning: ['morgens', 'morgen', 'fruh', 'uhrzeit', 'wann', 'morning', 'when', 'time'],
  purpose: ['wofur', 'wozu', 'angewendet', 'behandlung', 'used', 'purpose', 'treat'],
  inhaler: ['inhalator', 'inhalieren', 'spray', 'mundstuck', 'schutzkappe', 'kappe', 'schutteln', 'inhaler', 'inhale', 'mouthpiece', 'cap', 'shake'],
  heart: ['herz', 'herzerkrankung', 'heart'],
  children: ['kinder', 'kind', 'children', 'child'],
}

const STOPWORDS = new Set([
  // German
  'ich', 'mein', 'meine', 'meinen', 'meiner', 'kann', 'darf', 'soll', 'muss', 'das', 'die', 'der', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'und', 'oder', 'mit', 'ohne', 'ist', 'sind', 'war', 'warum', 'was', 'wie', 'wo', 'zu', 'zum', 'zur', 'in', 'im', 'auf', 'an', 'es', 'sie', 'er', 'wir', 'nicht', 'kein', 'keine', 'auch', 'bei', 'nach', 'vor', 'von', 'fur', 'jetzt', 'mehr', 'tun', 'nehmen', 'einnehmen', 'anwenden', 'medikament', 'arzneimittel', 'tablette', 'tabletten', 'kapsel', 'kapseln', 'mg', 'ug',
  // English
  'i', 'my', 'me', 'can', 'may', 'should', 'must', 'the', 'a', 'an', 'and', 'or', 'with', 'without', 'is', 'are', 'was', 'why', 'what', 'how', 'where', 'to', 'in', 'on', 'at', 'it', 'its', 'this', 'that', 'do', 'does', 'did', 'not', 'no', 'of', 'for', 'now', 'take', 'taking', 'use', 'using', 'medicine', 'medication', 'tablet', 'tablets', 'capsule', 'capsules', 'pill', 'pills', 'if', 'be', 'so',
])

const conceptOf = (word: string): string | undefined =>
  Object.keys(CONCEPTS).find((c) => CONCEPTS[c].some((w) => w === word || (w.length >= 5 && word.length >= 5 && (word.startsWith(w) || w.startsWith(word)))))

function keywords(text: string, extraStop: string[] = []): string[] {
  return normalize(text)
    .split(' ')
    .filter((w) => w.length > 1 && !STOPWORDS.has(w) && !extraStop.includes(w))
}

/** Score = matching concepts (worth 2) + matching words (worth 1, prefix match for German word endings). */
function score(questionWords: string[], text: string): number {
  const words = keywords(text)
  const concepts = new Set(words.map(conceptOf).filter(Boolean))
  let total = 0
  for (const q of questionWords) {
    const c = conceptOf(q)
    if (c && concepts.has(c)) total += 2
    else if (words.some((w) => w === q || (q.length >= 5 && (w.startsWith(q) || q.startsWith(w)) && w.length >= 5))) total += 1
  }
  return total
}

export const MIN_SCORE = 2

export function answerQuestion(med: Medication, question: string): Answer {
  // The medicine's own name says nothing about the topic, so it is ignored.
  const qWords = keywords(question, [normalize(med.name)])
  if (qWords.length === 0) return { found: false, more: [] }

  const changes = compareMedication(med)
  const citations: Citation[] = []
  for (const section of med.current.sections) {
    for (const para of section.paragraphs) {
      const sc = score(qWords, `${para.text}`) + (score(qWords, section.title) > 0 ? 0.5 : 0)
      if (sc < MIN_SCORE) continue
      const sentences = splitSentences(para.text)
      const sentence = sentences.reduce((best, s) => (score(qWords, s) > score(qWords, best) ? s : best), sentences[0])
      citations.push({
        paragraphId: para.id,
        sectionId: section.id,
        sectionTitle: section.title,
        sentence,
        paragraph: para.text,
        score: sc,
        change: changes.find((c) => c.id === para.id),
      })
    }
  }
  citations.sort((a, b) => b.score - a.score)
  if (citations.length === 0) return { found: false, more: [] }
  return { found: true, best: citations[0], more: citations.slice(1, 3) }
}
