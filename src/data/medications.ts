import type {
  Lang,
  LeafletVersion,
  Localized,
  Medication,
  RawLeafletVersion,
  RawMedication,
  RawParagraph,
  RawSection,
  RawStep,
} from './types'
import { extraMedications } from './extraMedications'

/*
 * DEMO DATA ONLY.
 * "Cardiovex", "Respilan" and "Thyrovita" are fictional medicines. All leaflet texts, codes and
 * manufacturers are invented for a university prototype and are NOT real medical information.
 * Every text exists in German (de) and English (en).
 *
 * Which medicine belongs to which use case:
 *   UC1 – Respilan inhaler: a NEW medicine the patient reads on the way home (step cards, read aloud, questions)
 *   UC2 – Thyrovita tablets: dad's medicine, found by the name on the blister (photo), printed, read aloud
 *   UC3 – Cardiovex 50 mg: the capsule changed colour → compare current and previous leaflet
 *   Cardiovex 100 mg has the SAME NAME as Cardiovex 50 mg, so the search has to ask which one is meant.
 */

// Small helpers so the data stays readable.
const p = (id: string, de: string, en: string): RawParagraph => ({ id, text: { de, en } })
const s = (id: string, de: string, en: string, paragraphs: RawParagraph[]): RawSection => ({ id, title: { de, en }, paragraphs })
const l = (de: string, en: string): Localized => ({ de, en })
const step = (id: string, icon: string, de: string, en: string, paragraphId: string): RawStep => ({ id, icon, title: { de, en }, paragraphId })

/* =====================================================================
 * Cardiovex 50 mg (UC3)
 * ===================================================================== */

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

const cardiovexPrevious: RawLeafletVersion = {
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
}

const cardiovexCurrent: RawLeafletVersion = {
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
}

const cardiovexSteps: RawStep[] = [
  step('cv-s1', '💊', 'Eine Kapsel einmal täglich, morgens', 'One capsule once a day, in the morning', 'use-dose'),
  step('cv-s2', '⏰', 'Einnahme vergessen?', 'Forgot a dose?', 'use-missed'),
  step('cv-s3', '🍊', 'Kein Grapefruitsaft', 'No grapefruit juice', 'warn-grapefruit'),
]

/** Cardiovex 100 mg: same text as 50 mg (current version), only the strength differs. */
function withStrength(v: RawLeafletVersion, version: string): RawLeafletVersion {
  const swap = (t: string) => t.replace(/50 mg/g, '100 mg').replace(/CV 50/g, 'CV 100')
  return {
    version,
    publishedOn: v.publishedOn,
    sections: v.sections.map((sec) => ({
      ...sec,
      paragraphs: sec.paragraphs.map((para) => ({ id: para.id, text: { de: swap(para.text.de), en: swap(para.text.en) } })),
    })),
  }
}

/* =====================================================================
 * Respilan inhaler (UC1 – new medicine, "how to use" step cards)
 * ===================================================================== */

const respilanCurrent: RawLeafletVersion = {
  version: '1.2',
  publishedOn: '2026-09-01',
  sections: [
    s('about', '1. Was ist Respilan und wofür wird es angewendet?', '1. What Respilan is and what it is used for', [
      p('r-about-1',
        'Respilan enthält den Wirkstoff Salbunol. Er erweitert die Atemwege und erleichtert so das Atmen.',
        'Respilan contains the active substance salbunol. It widens the airways and so makes breathing easier.'),
      p('r-about-2',
        'Respilan wird bei Asthma angewendet, um plötzliche Atemnot zu lindern.',
        'Respilan is used for asthma to relieve sudden shortness of breath.'),
    ]),
    s('warnings', '2. Warnhinweise und Vorsichtsmaßnahmen', '2. Warnings and precautions', [
      p('r-warn-more',
        'Sprechen Sie mit Ihrem Arzt, wenn Sie Respilan häufiger als sonst brauchen oder wenn es weniger gut wirkt.',
        'Talk to your doctor if you need Respilan more often than usual or if it works less well.'),
      p('r-warn-heart',
        'Bitte sprechen Sie mit Ihrem Arzt oder Apotheker, bevor Sie Respilan anwenden, wenn Sie eine Herzerkrankung haben.',
        'Talk to your doctor or pharmacist before using Respilan if you have a heart condition.'),
    ]),
    s('how-to-use', '3. Wie ist Respilan anzuwenden?', '3. How to use Respilan', [
      p('r-dose',
        'Die übliche Dosis ist 1 bis 2 Sprühstöße bei Bedarf. Wenden Sie nicht mehr als 8 Sprühstöße pro Tag an.',
        'The usual dose is 1 to 2 puffs when needed. Do not use more than 8 puffs per day.'),
      p('r-food',
        'Sie können Respilan unabhängig von den Mahlzeiten anwenden.',
        'You can use Respilan with or without food.'),
      p('r-step-cap',
        'Nehmen Sie die Schutzkappe ab und schütteln Sie den Inhalator kräftig.',
        'Remove the cap and shake the inhaler well.'),
      p('r-step-exhale',
        'Atmen Sie langsam und so tief wie möglich aus – nicht in das Mundstück.',
        'Breathe out slowly and as far as is comfortable – not into the mouthpiece.'),
      p('r-step-inhale',
        'Nehmen Sie das Mundstück zwischen die Lippen. Atmen Sie langsam ein und drücken Sie dabei einmal fest auf den Behälter.',
        'Put the mouthpiece between your lips. Breathe in slowly and press down firmly on the canister once at the same time.'),
      p('r-step-hold',
        'Halten Sie den Atem etwa 10 Sekunden lang an und atmen Sie dann langsam aus.',
        'Hold your breath for about 10 seconds, then breathe out slowly.'),
      p('r-step-second',
        'Für einen zweiten Sprühstoß warten Sie etwa eine Minute und wiederholen Sie die Schritte.',
        'For a second puff, wait about one minute and repeat the steps.'),
      p('r-step-close',
        'Setzen Sie die Schutzkappe wieder auf.',
        'Put the cap back on.'),
    ]),
    s('side-effects', '4. Welche Nebenwirkungen sind möglich?', '4. Possible side effects', [
      p('r-se-common',
        'Häufig (kann bis zu 1 von 10 Behandelten betreffen): Zittern, Kopfschmerzen.',
        'Common (may affect up to 1 in 10 people): shaking (tremor), headache.'),
      p('r-se-uncommon',
        'Gelegentlich (kann bis zu 1 von 100 Behandelten betreffen): Herzklopfen.',
        'Uncommon (may affect up to 1 in 100 people): palpitations.'),
    ]),
    s('storage', '5. Wie ist Respilan aufzubewahren?', '5. How to store Respilan', [
      p('r-store-temp',
        'Nicht über 30 °C lagern. Vor Frost und direkter Sonne schützen.',
        'Store below 30 °C. Protect from frost and direct sunlight.'),
      p('r-store-pressure',
        'Der Behälter steht unter Druck. Nicht durchstechen oder verbrennen, auch wenn er leer ist.',
        'The canister is pressurised. Do not puncture or burn it, even when empty.'),
    ]),
    s('appearance', '6. Wie Respilan aussieht und Inhalt der Packung', '6. What Respilan looks like and contents of the pack', [
      p('r-look',
        'Respilan ist ein blauer Inhalator mit grauer Schutzkappe. Ein Behälter enthält 200 Sprühstöße.',
        'Respilan is a blue inhaler with a grey cap. One canister contains 200 puffs.'),
    ]),
  ],
}

const respilanSteps: RawStep[] = [
  step('r-s1', '🧴', 'Kappe ab und schütteln', 'Cap off and shake', 'r-step-cap'),
  step('r-s2', '😮‍💨', 'Ausatmen', 'Breathe out', 'r-step-exhale'),
  step('r-s3', '💨', 'Einatmen und drücken', 'Breathe in and press', 'r-step-inhale'),
  step('r-s4', '⏱️', 'Atem anhalten', 'Hold your breath', 'r-step-hold'),
  step('r-s5', '🔁', 'Zweiter Sprühstoß', 'Second puff', 'r-step-second'),
  step('r-s6', '✅', 'Kappe wieder aufsetzen', 'Cap back on', 'r-step-close'),
]

/* =====================================================================
 * Thyrovita tablets (UC2 – dad's medicine, found via the blister)
 * ===================================================================== */

const thyrovitaCurrent: RawLeafletVersion = {
  version: '2.3',
  publishedOn: '2026-05-18',
  sections: [
    s('about', '1. Was ist Thyrovita und wofür wird es angewendet?', '1. What Thyrovita is and what it is used for', [
      p('t-about-1',
        'Thyrovita enthält den Wirkstoff Levothyrin, ein Schilddrüsenhormon.',
        'Thyrovita contains the active substance levothyrin, a thyroid hormone.'),
      p('t-about-2',
        'Thyrovita wird angewendet, wenn die Schilddrüse zu wenig Hormon bildet.',
        'Thyrovita is used when the thyroid gland makes too little hormone.'),
    ]),
    s('warnings', '2. Warnhinweise und Vorsichtsmaßnahmen', '2. Warnings and precautions', [
      p('t-warn-heart',
        'Bitte sprechen Sie mit Ihrem Arzt, bevor Sie Thyrovita einnehmen, wenn Sie eine Herzerkrankung haben.',
        'Talk to your doctor before taking Thyrovita if you have a heart condition.'),
      p('t-warn-iron',
        'Wenn Sie Eisen- oder Calciumpräparate einnehmen, halten Sie mindestens 2 Stunden Abstand zur Einnahme von Thyrovita.',
        'If you take iron or calcium supplements, take them at least 2 hours apart from Thyrovita.'),
    ]),
    s('how-to-use', '3. Wie ist Thyrovita einzunehmen?', '3. How to take Thyrovita', [
      p('t-dose',
        'Nehmen Sie jeden Morgen eine Tablette ein, sofern Ihr Arzt nichts anderes verordnet hat.',
        'Take one tablet every morning, unless your doctor has prescribed otherwise.'),
      p('t-empty',
        'Nehmen Sie die Tablette auf nüchternen Magen ein, mindestens 30 Minuten vor dem Frühstück.',
        'Take the tablet on an empty stomach, at least 30 minutes before breakfast.'),
      p('t-water',
        'Schlucken Sie die Tablette mit einem halben Glas Wasser.',
        'Swallow the tablet with half a glass of water.'),
      p('t-missed',
        'Wenn Sie eine Einnahme vergessen haben, nehmen Sie nicht die doppelte Menge ein. Nehmen Sie am nächsten Morgen die übliche Dosis.',
        'If you forget a dose, do not take a double dose. Take your usual dose the next morning.'),
    ]),
    s('side-effects', '4. Welche Nebenwirkungen sind möglich?', '4. Possible side effects', [
      p('t-se',
        'Wenn die Dosis zu hoch ist, können Herzklopfen, Unruhe, Schlafstörungen oder Schwitzen auftreten.',
        'If the dose is too high, palpitations, restlessness, trouble sleeping or sweating can occur.'),
    ]),
    s('storage', '5. Wie ist Thyrovita aufzubewahren?', '5. How to store Thyrovita', [
      p('t-store',
        'Nicht über 25 °C lagern. In der Originalverpackung aufbewahren, um den Inhalt vor Licht zu schützen.',
        'Store below 25 °C. Keep in the original package to protect from light.'),
    ]),
    s('appearance', '6. Wie Thyrovita aussieht und Inhalt der Packung', '6. What Thyrovita looks like and contents of the pack', [
      p('t-look',
        'Thyrovita 50 Mikrogramm sind weiße, runde Tabletten mit Bruchkerbe und der Prägung „T50“.',
        'Thyrovita 50 micrograms are white, round tablets with a score line, marked "T50".'),
      p('t-pack',
        'Packungen mit 50 oder 100 Tabletten in Blisterstreifen. Auf jedem Blister steht „THYROVITA 50 µg“.',
        'Packs of 50 or 100 tablets in blister strips. Each blister is printed with "THYROVITA 50 µg".'),
    ]),
  ],
}

const thyrovitaSteps: RawStep[] = [
  step('t-s1', '🌅', 'Jeden Morgen eine Tablette', 'One tablet every morning', 't-dose'),
  step('t-s2', '⏱️', 'Nüchtern, 30 Minuten vor dem Frühstück', 'Empty stomach, 30 minutes before breakfast', 't-empty'),
  step('t-s3', '🥛', 'Mit Wasser schlucken', 'Swallow with water', 't-water'),
  step('t-s4', '↔️', 'Abstand zu Eisen und Calcium', 'Keep apart from iron and calcium', 't-warn-iron'),
  step('t-s5', '⏰', 'Einnahme vergessen?', 'Forgot a dose?', 't-missed'),
]

/* =====================================================================
 * All medicines
 * ===================================================================== */

const rawMedications: RawMedication[] = [
  {
    id: 'cardiovex',
    name: 'Cardiovex',
    strength: '50 mg',
    form: l('Retard-Hartkapseln', 'Prolonged-release hard capsules'),
    activeIngredient: l('Velartan (fiktiv)', 'Velartan (fictional)'),
    manufacturer: l('Demo Pharma GmbH (fiktiv)', 'Demo Pharma GmbH (fictional)'),
    prescribedFor: l('Bluthochdruck', 'High blood pressure'),
    packSize: l('98 Kapseln', '98 capsules'),
    pzn: '10000016',
    gtin: '4012345000016',
    blisterText: 'CARDIOVEX 50 mg',
    packColor: '#0f766e',
    previous: cardiovexPrevious,
    current: cardiovexCurrent,
    steps: cardiovexSteps,
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
    id: 'cardiovex-100',
    name: 'Cardiovex',
    strength: '100 mg',
    form: l('Retard-Hartkapseln', 'Prolonged-release hard capsules'),
    activeIngredient: l('Velartan (fiktiv)', 'Velartan (fictional)'),
    manufacturer: l('Demo Pharma GmbH (fiktiv)', 'Demo Pharma GmbH (fictional)'),
    prescribedFor: l('Bluthochdruck', 'High blood pressure'),
    packSize: l('98 Kapseln', '98 capsules'),
    pzn: '10000023',
    gtin: '4012345000023',
    blisterText: 'CARDIOVEX 100 mg',
    packColor: '#7c2d12',
    previous: null,
    current: withStrength(cardiovexCurrent, '2.0'),
    steps: cardiovexSteps,
    explanations: {},
  },
  {
    id: 'respilan',
    name: 'Respilan',
    strength: '100 µg',
    form: l('Druckgasinhalation (Inhalator)', 'Pressurised inhalation (inhaler)'),
    activeIngredient: l('Salbunol (fiktiv)', 'Salbunol (fictional)'),
    manufacturer: l('Example Health Ltd (fiktiv)', 'Example Health Ltd (fictional)'),
    prescribedFor: l('Asthma', 'Asthma'),
    packSize: l('1 Inhalator, 200 Sprühstöße', '1 inhaler, 200 puffs'),
    pzn: '10000030',
    gtin: '4012345000030',
    blisterText: 'RESPILAN 100 µg',
    packColor: '#1d4ed8',
    previous: null,
    current: respilanCurrent,
    steps: respilanSteps,
    explanations: {},
  },
  {
    id: 'thyrovita',
    name: 'Thyrovita',
    strength: '50 µg',
    form: l('Tabletten', 'Tablets'),
    activeIngredient: l('Levothyrin (fiktiv)', 'Levothyrin (fictional)'),
    manufacturer: l('Nordapharm AG (fiktiv)', 'Nordapharm AG (fictional)'),
    prescribedFor: l('Schilddrüsenunterfunktion', 'Underactive thyroid'),
    packSize: l('100 Tabletten', '100 tablets'),
    pzn: '10000047',
    gtin: '4012345000047',
    blisterText: 'THYROVITA 50 µg',
    packColor: '#9d174d',
    previous: null,
    current: thyrovitaCurrent,
    steps: thyrovitaSteps,
    explanations: {},
  },
  ...extraMedications,
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
  const current = localizeVersion(m.current, lang)
  return {
    id: m.id,
    name: m.name,
    strength: m.strength,
    form: m.form[lang],
    activeIngredient: m.activeIngredient[lang],
    manufacturer: m.manufacturer[lang],
    prescribedFor: m.prescribedFor[lang],
    packSize: m.packSize[lang],
    pzn: m.pzn,
    gtin: m.gtin,
    blisterText: m.blisterText,
    packColor: m.packColor,
    current,
    previous: m.previous ? localizeVersion(m.previous, lang) : null,
    explanations: Object.fromEntries(Object.entries(m.explanations).map(([id, text]) => [id, text[lang]])),
    steps: m.steps.map((st) => {
      const section = current.sections.find((sec) => sec.paragraphs.some((para) => para.id === st.paragraphId))
      const para = section?.paragraphs.find((x) => x.id === st.paragraphId)
      return {
        id: st.id,
        icon: st.icon,
        title: st.title[lang],
        text: para?.text ?? '',
        paragraphId: st.paragraphId,
        sectionTitle: section?.title ?? '',
      }
    }),
  }
}

export function getMedications(lang: Lang): Medication[] {
  return rawMedications.map((m) => localize(m, lang))
}

export function findMedication(id: string, lang: Lang): Medication | undefined {
  const raw = rawMedications.find((m) => m.id === id)
  return raw ? localize(raw, lang) : undefined
}

/** Fictional pharmacy used for the "call pharmacy" button. */
export const DEMO_PHARMACY = {
  name: 'Demo-Apotheke am Markt',
  phone: '+49 30 1234567',
  tel: 'tel:+49301234567',
}
