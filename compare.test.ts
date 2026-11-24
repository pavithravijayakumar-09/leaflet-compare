import { describe, expect, it } from 'vitest'
import { findMedication, getMedications } from '../data/medications'
import type { Lang } from '../data/types'
import { strings } from '../i18n/strings'
import { compareLeaflets, compareMedication, countByType, groupBySection, wordDiff } from './compare'

const LANGS: Lang[] = ['de', 'en']

describe('compareLeaflets', () => {
  it.each(LANGS)('detects added, changed and removed paragraphs (%s)', (lang) => {
    const counts = countByType(compareMedication(findMedication('cardiovex', lang)!))
    expect(counts).toEqual({ added: 2, changed: 5, removed: 1 })
  })

  it('covers the required leaflet sections', () => {
    const sections = groupBySection(compareMedication(findMedication('cardiovex', 'en')!)).map((g) => g.sectionId)
    expect(sections).toEqual(expect.arrayContaining(['warnings', 'side-effects', 'how-to-use', 'storage', 'appearance']))
    // Unchanged section is not reported.
    expect(sections).not.toContain('about')
  })

  it('keeps previous and current text for a changed paragraph', () => {
    const en = compareMedication(findMedication('cardiovex', 'en')!).find((c) => c.id === 'look-capsule')!
    expect(en.type).toBe('changed')
    expect(en.previousText).toContain('red')
    expect(en.currentText).toContain('green')
    expect(en.explanation).toMatch(/green instead of red/)

    const de = compareMedication(findMedication('cardiovex', 'de')!).find((c) => c.id === 'look-capsule')!
    expect(de.previousText).toContain('rote')
    expect(de.currentText).toContain('grüne')
    expect(de.explanation).toMatch(/grün statt rot/)
  })

  it('reports no changes for identical versions', () => {
    const med = findMedication('cardiovex', 'de')!
    expect(compareLeaflets(med.current, med.current)).toEqual([])
  })

  it.each(LANGS)('every change of the demo data has a written explanation (%s)', (lang) => {
    for (const med of getMedications(lang)) {
      for (const change of compareMedication(med)) {
        expect(med.explanations[change.id], `${med.id}/${change.id}`).toBeTruthy()
      }
    }
  })

  it('explanations never tell the patient to stop or change their medicine', () => {
    const advice = {
      en: /\b(stop taking|you should|increase|reduce your dose|switch to)\b/i,
      de: /(absetzen|sollten Sie|erhöhen Sie|verringern Sie|wechseln Sie)/i,
    }
    for (const lang of LANGS) {
      for (const med of getMedications(lang)) {
        for (const text of Object.values(med.explanations)) expect(text).not.toMatch(advice[lang])
      }
    }
  })
})

describe('translations', () => {
  it('German and English leaflets have the same structure (same section and paragraph ids)', () => {
    const ids = (lang: Lang) =>
      getMedications(lang).map((m) => [m.current, m.previous].map((v) => v.sections.map((s) => [s.id, s.paragraphs.map((p) => p.id)])))
    expect(ids('de')).toEqual(ids('en'))
  })

  it('no German or English text is left empty', () => {
    for (const lang of LANGS) {
      for (const med of getMedications(lang)) {
        for (const v of [med.current, med.previous]) {
          for (const s of v.sections) {
            expect(s.title).not.toBe('')
            for (const p of s.paragraphs) expect(p.text, `${lang}/${p.id}`).not.toBe('')
          }
        }
      }
    }
  })

  it('German is really German and English is really English', () => {
    expect(strings.de.overview.compare).toBe('Versionen vergleichen')
    expect(strings.en.overview.compare).toBe('Compare versions')
    expect(findMedication('cardiovex', 'de')!.prescribedFor).toBe('Bluthochdruck')
    expect(findMedication('cardiovex', 'en')!.prescribedFor).toBe('High blood pressure')
  })
})

describe('wordDiff', () => {
  it('marks replaced words as deleted + inserted', () => {
    const parts = wordDiff('capsules are red, opaque', 'capsules are green, opaque')
    expect(parts).toEqual([
      { kind: 'same', text: 'capsules are ' },
      { kind: 'deleted', text: 'red,' },
      { kind: 'inserted', text: 'green,' },
      { kind: 'same', text: ' opaque' },
    ])
  })

  it('does not mark an unchanged last word as changed when text is appended', () => {
    const parts = wordDiff('marked "CV 50".', 'marked "CV 50". Only the colour changed.')
    expect(parts[0]).toEqual({ kind: 'same', text: 'marked "CV 50".' })
    expect(parts.slice(1).every((p) => p.kind === 'inserted')).toBe(true)
  })

  it('reconstructs both texts', () => {
    const oldText = 'Store below 30 °C.'
    const newText = 'Store below 25 °C. Keep in the original package.'
    const parts = wordDiff(oldText, newText)
    expect(parts.filter((p) => p.kind !== 'inserted').map((p) => p.text).join('')).toBe(oldText)
    expect(parts.filter((p) => p.kind !== 'deleted').map((p) => p.text).join('')).toBe(newText)
  })
})
