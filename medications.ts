import type { Lang, LeafletVersion, Localized, Medication, RawLeafletVersion, RawMedication, RawParagraph, RawSection } from './types'

/*
 * DEMO DATA ONLY.
 * "Cardiovex" and "Respilan" are fictional medicines. The leaflet texts below are invented
 * for a university prototype and are NOT real medical information.
 * Every text exists in German (de) and English (en).
 */

// Small helpers so the data stays readable.
const p = (id: string, de: string, en: string): RawParagraph => ({ id, text: { de, en } })
const s = (id: string, de: string, en: string, paragraphs: RawParagraph[]): RawSection => ({ id, title: { de, en }, paragraphs })
const l = (de: string, en: string): Localized => ({ de, en })

/* ---------- Cardiovex: sections that are identical in both versions ---------- */

const cvAbout = s('about', '1. Was ist Cardiovex und wofür wird es angewendet?', '1. What Cardiovex is and what it is used for', [
  p('about-1',
    'Cardiovex enthält den Wirkstoff Velartan. Er gehört zu einer Gruppe von Arzneimitteln, die die Blutgefäße entspannen.',
    'Cardiovex contains the active substance velartan. It belongs to a group of medicines that relax the blood vessels.'),
  p('about-2',
    'Cardiovex wird zur Behandlung von Bluthochdruck bei Erwachsenen angewendet.',
    'Cardiovex is used to treat high blood pressure in adults.'),
])

const cvWarn1 = p('warn-1',
  'Bitte sprechen Sie mit Ihrem Arzt oder Apotheker, bevor Sie Cardiovex einnehmen, wenn Sie Nieren- oder Leberprobleme haben.',
  'Talk to your doctor or pharmacist before taking Cardiovex if you have kidney or liver problems.')
const cvWarnDriving = p('warn-driving',
  'Cardiovex kann Schwindel verursachen. Wenn dies bei Ihnen auftritt, führen Sie kein Fahrzeug und bedienen Sie keine Maschinen.',
  'Cardiovex may make you feel dizzy. If this happens, do not drive or use machines.')
const cvUseMissed = p('use-missed',
  'Wenn Sie eine Einnahme vergessen haben, nehmen Sie die nächste Dosis zur gewohnten Zeit ein. Nehmen Sie nicht die doppelte Menge ein, um eine vergessene Kapsel nachzuholen.',
  'If you forget to take a dose, take the next dose at the usual time. Do not take a double dose to make up for a forgotten capsule.')
const cvSeIntro = p('se-intro',
  'Wie alle Arzneimittel kann auch Cardiovex Nebenwirkungen haben, die aber nicht bei jedem auftreten müssen.',
  'Like all medicines, Cardiovex can cause side effects, although not everybody gets them.')
const cvStoreChildren = p('store-children',
  'Bewahren Sie dieses Arzneimittel für Kinder unzugänglich auf.',
  'Keep this medicine out of the sight and reach of children.')
const cvLookPack = p('look-pack',
  'Packungen mit 28 oder 98 Kapseln in Blisterstreifen.',
  'Packs of 28 or 98 capsules in blister strips.')

const T = {
  warnings: ['2. Warnhinweise und Vorsichtsmaßnahmen', '2. Warnings and precautions'],
  howTo: ['3. Wie ist Cardiovex einzunehmen?', '3. How to take Cardiovex'],
  sideEffects: ['4. Welche Nebenwirkungen sind möglich?', '4. Possible side effects'],
  storage: ['5. Wie ist Cardiovex aufzubewahren?', '5. How to store Cardiovex'],
  appearance: ['6. Wie Cardiovex aussieht und Inhalt der Packung', '6. What Cardiovex looks like and contents of the pack'],
} as const

const rawMedications: RawMedication[] = [
  {
    id: 'cardiovex',
    name: 'Cardiovex',
    strength: '50 mg',
    form: l('Retard-Hartkapseln', 'Prolonged-release hard capsules'),
    activeIngredient: l('Velartan (fiktiv)', 'Velartan (fictional)'),
    manufacturer: l('Demo Pharma GmbH (fiktiv)', 'Demo Pharma GmbH (fictional)'),
    prescribedFor: l('Bluthochdruck', 'High blood pressure'),
    previous: {
      version: '3.1',
      publishedOn: '2025-03-04',
      sections: [
        cvAbout,
        s('warnings', ...T.warnings, [
          cvWarn1,
          p('warn-grapefruit',
            'Vermeiden Sie größere Mengen Grapefruitsaft, während Sie Cardiovex einnehmen.',
            'Avoid drinking large amounts of grapefruit juice while taking Cardiovex.'),
          cvWarnDriving,
        ]),
        s('how-to-use', ...T.howTo, [
          p('use-dose',
            'Die übliche Dosis ist eine Kapsel einmal täglich. Nehmen Sie die Kapsel morgens zu einer Mahlzeit ein.',
            'The usual dose is one capsule once a day. Take the capsule in the morning with food.'),
          cvUseMissed,
        ]),
        s('side-effects', ...T.sideEffects, [
          cvSeIntro,
          p('se-dizziness',
            'Gelegentlich (kann bis zu 1 von 100 Behandelten betreffen): Schwindel, Kopfschmerzen.',
            'Uncommon (may affect up to 1 in 100 people): dizziness, headache.'),
          p('se-taste',
            'Selten (kann bis zu 1 von 1.000 Behandelten betreffen): Geschmacksstörungen.',
            'Rare (may affect up to 1 in 1,000 people): changes in taste.'),
        ]),
        s('storage', ...T.storage, [
          p('store-temp', 'Nicht über 30 °C lagern.', 'Store below 30 °C.'),
          cvStoreChildren,
        ]),
        s('appearance', ...T.appearance, [
          p('look-capsule',
            'Cardiovex 50 mg sind rote, undurchsichtige Hartkapseln mit der Aufschrift „CV 50“.',
            'Cardiovex 50 mg capsules are red, opaque hard capsules marked "CV 50".'),
          cvLookPack,
        ]),
      ],
    },
    current: {
      version: '4.0',
      publishedOn: '2026-10-12',
      sections: [
        cvAbout,
        s('warnings', ...T.warnings, [
          cvWarn1,
          p('warn-angioedema',
            'Bitte sprechen Sie mit Ihrem Arzt oder Apotheker, bevor Sie Cardiovex einnehmen, wenn bei Ihnen schon einmal eine plötzliche Schwellung von Gesicht, Lippen oder Zunge (Angioödem) aufgetreten ist.',
            'Talk to your doctor or pharmacist before taking Cardiovex if you have ever had sudden swelling of the face, lips or tongue (angioedema).'),
          p('warn-grapefruit',
            'Trinken Sie keinen Grapefruitsaft, während Sie Cardiovex einnehmen.',
            'Do not drink grapefruit juice while taking Cardiovex.'),
          cvWarnDriving,
        ]),
        s('how-to-use', ...T.howTo, [
          p('use-dose',
            'Die übliche Dosis ist eine Kapsel einmal täglich. Nehmen Sie die Kapsel morgens ein, unabhängig von den Mahlzeiten. Schlucken Sie die Kapsel unzerkaut mit einem Glas Wasser.',
            'The usual dose is one capsule once a day. Take the capsule in the morning, with or without food. Swallow the capsule whole with a glass of water.'),
          cvUseMissed,
        ]),
        s('side-effects', ...T.sideEffects, [
          cvSeIntro,
          p('se-dizziness',
            'Häufig (kann bis zu 1 von 10 Behandelten betreffen): Schwindel. Gelegentlich (kann bis zu 1 von 100 Behandelten betreffen): Kopfschmerzen.',
            'Common (may affect up to 1 in 10 people): dizziness. Uncommon (may affect up to 1 in 100 people): headache.'),
          p('se-cough',
            'Gelegentlich (kann bis zu 1 von 100 Behandelten betreffen): trockener Husten.',
            'Uncommon (may affect up to 1 in 100 people): dry cough.'),
        ]),
        s('storage', ...T.storage, [
          p('store-temp',
            'Nicht über 25 °C lagern. In der Originalverpackung aufbewahren, um die Kapseln vor Feuchtigkeit zu schützen.',
            'Store below 25 °C. Keep the capsules in the original package to protect them from moisture.'),
          cvStoreChildren,
        ]),
        s('appearance', ...T.appearance, [
          p('look-capsule',
            'Cardiovex 50 mg sind grüne, undurchsichtige Hartkapseln mit der Aufschrift „CV 50“. Nur die Farbe der Kapselhülle hat sich geändert; Wirkstoff und Stärke sind gleich geblieben.',
            'Cardiovex 50 mg capsules are green, opaque hard capsules marked "CV 50". Only the colour of the capsule shell has changed; the active substance and the strength are the same.'),
          cvLookPack,
        ]),
      ],
    },
    explanations: {
      'warn-angioedema': l(
        'Ein neuer Satz wurde hinzugefügt. Die Beilage nennt jetzt plötzliche Schwellungen von Gesicht, Lippen oder Zunge (Angioödem) als etwas, das Sie Ihrem Arzt oder Apotheker mitteilen sollen.',
        'A new sentence was added. The leaflet now names sudden swelling of the face, lips or tongue (angioedema) as something to tell your doctor or pharmacist about.'),
      'warn-grapefruit': l(
        'Die Formulierung ist strenger geworden. Früher hieß es, größere Mengen Grapefruitsaft zu vermeiden; jetzt heißt es, während der Einnahme gar keinen Grapefruitsaft zu trinken.',
        'The wording became stricter. The old version said to avoid large amounts of grapefruit juice; the new version says not to drink grapefruit juice at all while taking this medicine.'),
      'use-dose': l(
        'Die Dosis selbst (eine Kapsel einmal täglich, morgens) ist gleich geblieben. Die Beilage sagt nicht mehr, dass die Kapsel zu einer Mahlzeit eingenommen wird, und ergänzt, dass sie unzerkaut mit Wasser geschluckt wird.',
        'The dose itself (one capsule once a day, in the morning) is the same. The leaflet no longer says it must be taken with food, and it now adds that the capsule should be swallowed whole with water.'),
      'se-dizziness': l(
        'Schwindel wird jetzt als „häufig“ (bis zu 1 von 10 Behandelten) statt „gelegentlich“ (bis zu 1 von 100) angegeben. Kopfschmerzen bleiben „gelegentlich“.',
        'Dizziness is now listed as "common" (up to 1 in 10 people) instead of "uncommon" (up to 1 in 100 people). Headache stays "uncommon".'),
      'se-cough': l(
        'Eine Nebenwirkung wurde zur Liste hinzugefügt: trockener Husten, angegeben als gelegentlich (bis zu 1 von 100 Behandelten).',
        'A side effect was added to the list: dry cough, described as uncommon (up to 1 in 100 people).'),
      'se-taste': l(
        'Die Zeile zu Geschmacksstörungen (selten) steht nicht mehr in der aktuellen Beilage.',
        'The line about changes in taste (rare) no longer appears in the current leaflet.'),
      'store-temp': l(
        'Die höchste Lagertemperatur wurde von 30 °C auf 25 °C geändert. Außerdem steht jetzt in der Beilage, dass die Kapseln zum Schutz vor Feuchtigkeit in der Originalverpackung bleiben.',
        'The maximum storage temperature changed from 30 °C to 25 °C. The leaflet also now says to keep the capsules in the original package to protect them from moisture.'),
      'look-capsule': l(
        'Das erklärt die Farbe, die Ihnen aufgefallen ist: Die Beilage beschreibt die Kapseln jetzt als grün statt rot. Laut Beilage haben sich Wirkstoff und Stärke nicht geändert.',
        'This explains the colour you noticed: the leaflet now describes the capsules as green instead of red. According to the leaflet, the active substance and strength did not change.'),
    },
  },
  {
    id: 'respilan',
    name: 'Respilan',
    strength: '10 mg',
    form: l('Filmtabletten', 'Film-coated tablets'),
    activeIngredient: l('Montarel (fiktiv)', 'Montarel (fictional)'),
    manufacturer: l('Example Health Ltd (fiktiv)', 'Example Health Ltd (fictional)'),
    prescribedFor: l('Asthma (Zusatzbehandlung)', 'Asthma (add-on treatment)'),
    previous: {
      version: '2.0',
      publishedOn: '2024-11-20',
      sections: [
        s('how-to-use', '1. Wie ist Respilan einzunehmen?', '1. How to take Respilan', [
          p('r-dose', 'Nehmen Sie jeden Abend eine Tablette ein.', 'Take one tablet each evening.'),
        ]),
        s('storage', '2. Wie ist Respilan aufzubewahren?', '2. How to store Respilan', [
          p('r-store',
            'In der Originalverpackung aufbewahren, um den Inhalt vor Licht zu schützen.',
            'Store in the original package in order to protect from light.'),
        ]),
      ],
    },
    current: {
      version: '2.1',
      publishedOn: '2026-06-02',
      sections: [
        s('how-to-use', '1. Wie ist Respilan einzunehmen?', '1. How to take Respilan', [
          p('r-dose', 'Nehmen Sie jeden Abend eine Tablette ein.', 'Take one tablet each evening.'),
        ]),
        s('storage', '2. Wie ist Respilan aufzubewahren?', '2. How to store Respilan', [
          p('r-store',
            'In der Originalverpackung aufbewahren, um den Inhalt vor Licht und Feuchtigkeit zu schützen.',
            'Store in the original package in order to protect from light and moisture.'),
        ]),
      ],
    },
    explanations: {
      'r-store': l(
        'Der Lagerungshinweis nennt jetzt neben Licht auch Feuchtigkeit.',
        'The storage instruction now mentions moisture as well as light.'),
    },
  },
]

/* ---------- Pick one language ---------- */

function localizeVersion(v: RawLeafletVersion, lang: Lang): LeafletVersion {
  return {
    version: v.version,
    publishedOn: v.publishedOn,
    sections: v.sections.map((sec) => ({
      id: sec.id,
      title: sec.title[lang],
      paragraphs: sec.paragraphs.map((para) => ({ id: para.id, text: para.text[lang] })),
    })),
  }
}

function localize(m: RawMedication, lang: Lang): Medication {
  return {
    id: m.id,
    name: m.name,
    strength: m.strength,
    form: m.form[lang],
    activeIngredient: m.activeIngredient[lang],
    manufacturer: m.manufacturer[lang],
    prescribedFor: m.prescribedFor[lang],
    current: localizeVersion(m.current, lang),
    previous: localizeVersion(m.previous, lang),
    explanations: Object.fromEntries(Object.entries(m.explanations).map(([id, text]) => [id, text[lang]])),
  }
}

export function getMedications(lang: Lang): Medication[] {
  return rawMedications.map((m) => localize(m, lang))
}

export function findMedication(id: string, lang: Lang): Medication | undefined {
  const raw = rawMedications.find((m) => m.id === id)
  return raw ? localize(raw, lang) : undefined
}
