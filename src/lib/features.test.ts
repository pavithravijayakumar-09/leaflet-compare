import { describe, expect, it } from 'vitest'
import { BarcodeFormat, BinaryBitmap, DecodeHintType, HybridBinarizer, MultiFormatReader, RGBLuminanceSource } from '@zxing/library'
import { findMedication, getMedications } from '../data/medications'
import { ean13Modules, isValidEan13 } from './barcode'
import { findByCode, matchBlisterText, searchByName } from './search'
import { answerQuestion } from './qa'
import { splitSentences } from './sentences'
import { parseHash } from './router'

const meds = getMedications('de')

/** Draw a barcode into a grey-scale pixel buffer and decode it with ZXing – the same library the scanner uses. */
function decodeDrawnBarcode(code: string): string {
  const modules = ean13Modules(code)
  const scale = 3
  const quiet = 12
  const width = (modules.length + quiet * 2) * scale
  const height = 60
  const pixels = new Uint8ClampedArray(width * height).fill(255)
  for (let y = 0; y < height; y++) {
    for (let m = 0; m < modules.length; m++) {
      if (modules[m] !== '1') continue
      for (let s = 0; s < scale; s++) pixels[y * width + (quiet + m) * scale + s] = 0
    }
  }
  const reader = new MultiFormatReader()
  reader.setHints(new Map([[DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13]]]))
  return reader.decode(new BinaryBitmap(new HybridBinarizer(new RGBLuminanceSource(pixels, width, height)))).getText()
}

describe('S1 – identify the medicine', () => {
  it('every demo barcode is a valid EAN-13 and can be decoded by the scanner library', () => {
    for (const med of meds) {
      expect(isValidEan13(med.gtin), med.id).toBe(true)
      expect(decodeDrawnBarcode(med.gtin)).toBe(med.gtin)
    }
  })

  it('a scanned code gives exactly one product (exact match) or none', () => {
    expect(findByCode(meds, '4012345000016')?.id).toBe('cardiovex')
    expect(findByCode(meds, '10000047')?.id).toBe('thyrovita') // PZN
    expect(findByCode(meds, '4000000000000')).toBeUndefined()
  })

  it('a typed name with several matches returns all of them, so the user must choose', () => {
    expect(searchByName(meds, 'cardiovex').map((m) => m.id)).toEqual(['cardiovex', 'cardiovex-100'])
    expect(searchByName(meds, 'Cardiovex 100').map((m) => m.id)).toEqual(['cardiovex-100'])
  })

  it('tolerates small typos but does not return unrelated products', () => {
    expect(searchByName(meds, 'cardivex').map((m) => m.id)).toContain('cardiovex')
    expect(searchByName(meds, 'thyrovit').map((m) => m.id)).toEqual(['thyrovita'])
    expect(searchByName(meds, 'xyzabc')).toEqual([])
  })

  it('finds the extra demo medicines by name or active substance', () => {
    expect(searchByName(meds, 'ibuflex').map((m) => m.id)).toEqual(['ibuflex'])
    expect(searchByName(meds, 'vitasol').map((m) => m.id)).toEqual(['vitasol'])
    expect(searchByName(meds, 'gastro').map((m) => m.id)).toEqual(['gastrolin'])
  })

  it('UC2: text recognised on a blister photo is matched to the product name', () => {
    expect(matchBlisterText(meds, 'THYROVITA 50 µg\nLot 123').map((m) => m.id)).toEqual(['thyrovita'])
    // OCR mistakes ("0" instead of "O") are tolerated
    expect(matchBlisterText(meds, 'THYR0VITA 50').map((m) => m.id)).toEqual(['thyrovita'])
    // Same name, different strength: both shown, the matching strength first
    expect(matchBlisterText(meds, 'CARDIOVEX 100 mg').map((m) => m.id)).toEqual(['cardiovex-100', 'cardiovex'])
    expect(matchBlisterText(meds, 'random text')).toEqual([])
  })

  it('the QR code link on the printout opens the read-aloud page', () => {
    expect(parseHash('#/med/thyrovita/listen?autoplay=1')).toEqual({ name: 'listen', medId: 'thyrovita', autoplay: true })
  })
})

describe('Questions about the leaflet – answers only with citations', () => {
  it('UC3: "Why is my capsule green?" cites the appearance section and marks it as changed', () => {
    const a = answerQuestion(findMedication('cardiovex', 'de')!, 'Warum ist meine Kapsel grün?')
    expect(a.found).toBe(true)
    expect(a.best?.paragraphId).toBe('look-capsule')
    expect(a.best?.change?.type).toBe('changed')
  })

  it('UC1: "Can I take it with food?" cites the right passage (DE and EN)', () => {
    expect(answerQuestion(findMedication('respilan', 'de')!, 'Kann ich das mit Essen anwenden?').best?.paragraphId).toBe('r-food')
    expect(answerQuestion(findMedication('cardiovex', 'en')!, 'Can I take it with food?').best?.paragraphId).toBe('use-dose')
    expect(answerQuestion(findMedication('thyrovita', 'en')!, 'Can I take it with breakfast?').best?.paragraphId).toBe('t-empty')
  })

  it('a forgotten dose question cites the "missed dose" paragraph', () => {
    expect(answerQuestion(findMedication('cardiovex', 'en')!, 'What should I do if I forget a dose?').best?.paragraphId).toBe('use-missed')
  })

  it('answers are quotes: the answer sentence is always part of the leaflet text', () => {
    const med = findMedication('respilan', 'en')!
    const a = answerQuestion(med, 'How should I store it?')
    expect(a.found).toBe(true)
    expect(a.best!.paragraph).toContain(a.best!.sentence)
  })

  it('says "not in the leaflet" instead of inventing an answer', () => {
    expect(answerQuestion(findMedication('cardiovex', 'en')!, 'Can I drink alcohol?').found).toBe(false)
    expect(answerQuestion(findMedication('thyrovita', 'de')!, 'Darf ich schwanger sein?').found).toBe(false)
    // …but answers it when that leaflet does mention it
    expect(answerQuestion(findMedication('allerfree', 'en')!, 'Can I drink alcohol?').best?.paragraphId).toBe('allerfree-warn')
  })
})

describe('Read aloud', () => {
  it('splits leaflet text into sentences that can be highlighted one by one', () => {
    expect(splitSentences('Store below 25 °C. Keep the capsules in the original package.')).toEqual([
      'Store below 25 °C.',
      'Keep the capsules in the original package.',
    ])
    expect(splitSentences('Häufig (kann bis zu 1 von 10 Behandelten betreffen): Schwindel. Gelegentlich: Kopfschmerzen.')).toHaveLength(2)
  })
})

describe('Leaflet highlights', () => {
  it('reads the side-effect frequency words the leaflet uses (and never confuses "uncommon" with "common")', async () => {
    const { frequenciesIn } = await import('./leafletInsights')
    expect(frequenciesIn('Häufig (kann bis zu 1 von 10 Behandelten betreffen): Schwindel. Gelegentlich: Kopfschmerzen.')).toEqual(['common', 'uncommon'])
    expect(frequenciesIn('Uncommon (may affect up to 1 in 100 people): dry cough.')).toEqual(['uncommon'])
    expect(frequenciesIn('Very common (may affect more than 1 in 10 people): nausea.')).toEqual(['veryCommon'])
    expect(frequenciesIn('Sehr häufig: Übelkeit.')).toEqual(['veryCommon'])
    expect(frequenciesIn('Rare (may affect up to 1 in 1,000 people): changes in taste.')).toEqual(['rare'])
    expect(frequenciesIn('If the dose is too high, palpitations can occur.')).toEqual([])
  })
})
