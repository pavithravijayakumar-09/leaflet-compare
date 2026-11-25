import type { Localized, RawMedication } from './types'
import { ean13CheckDigit } from '../lib/barcode'

/*
 * DEMO DATA ONLY – extra fictional medicines so the search has something to find.
 * Each one has a standard 6-chapter leaflet in German and English, one current version
 * (no previous version) and three step cards built from its "how to take" chapter.
 *
 * "Cardiolat" deliberately sounds like "Cardiovex" (failure scenario: names that are easy to mix up),
 * so the result list must show name, strength, manufacturer and pack picture to tell them apart.
 */

interface Spec {
  id: string
  name: string
  strength: string
  form: Localized
  active: Localized
  manufacturer: Localized
  usedFor: Localized
  packSize: Localized
  pzn: string
  gtinBase: string // 12 digits, the check digit is calculated
  color: string
  version: string
  publishedOn: string
  about: Localized
  warn: Localized
  dose: Localized
  food: Localized
  missed: Localized
  side: Localized
  storage: Localized
  look: Localized
}

const l = (de: string, en: string): Localized => ({ de, en })

function build(s: Spec): RawMedication {
  const n = s.name
  const para = (key: string, text: Localized) => ({ id: `${s.id}-${key}`, text })
  return {
    id: s.id,
    name: s.name,
    strength: s.strength,
    form: s.form,
    activeIngredient: s.active,
    manufacturer: s.manufacturer,
    prescribedFor: s.usedFor,
    packSize: s.packSize,
    pzn: s.pzn,
    gtin: s.gtinBase + ean13CheckDigit(s.gtinBase),
    blisterText: `${s.name.toUpperCase()} ${s.strength}`,
    packColor: s.color,
    previous: null,
    current: {
      version: s.version,
      publishedOn: s.publishedOn,
      sections: [
        { id: 'about', title: l(`1. Was ist ${n} und wofür wird es angewendet?`, `1. What ${n} is and what it is used for`), paragraphs: [para('about', s.about)] },
        { id: 'warnings', title: l('2. Warnhinweise und Vorsichtsmaßnahmen', '2. Warnings and precautions'), paragraphs: [para('warn', s.warn)] },
        {
          id: 'how-to-use',
          title: l(`3. Wie ist ${n} einzunehmen?`, `3. How to take ${n}`),
          paragraphs: [para('dose', s.dose), para('food', s.food), para('missed', s.missed)],
        },
        { id: 'side-effects', title: l('4. Welche Nebenwirkungen sind möglich?', '4. Possible side effects'), paragraphs: [para('side', s.side)] },
        { id: 'storage', title: l(`5. Wie ist ${n} aufzubewahren?`, `5. How to store ${n}`), paragraphs: [para('storage', s.storage)] },
        { id: 'appearance', title: l(`6. Wie ${n} aussieht und Inhalt der Packung`, `6. What ${n} looks like and contents of the pack`), paragraphs: [para('look', s.look)] },
      ],
    },
    explanations: {},
    steps: [
      { id: `${s.id}-s1`, icon: '💊', title: l('Wie viel und wie oft?', 'How much and how often?'), paragraphId: `${s.id}-dose` },
      { id: `${s.id}-s2`, icon: '🍽️', title: l('Einnahme und Mahlzeiten', 'Taking it and meals'), paragraphId: `${s.id}-food` },
      { id: `${s.id}-s3`, icon: '⏰', title: l('Einnahme vergessen?', 'Forgot a dose?'), paragraphId: `${s.id}-missed` },
    ],
  }
}

const noDouble = l(
  'Wenn Sie eine Einnahme vergessen haben, nehmen Sie nicht die doppelte Menge ein. Nehmen Sie die nächste Dosis zur gewohnten Zeit ein.',
  'If you forget a dose, do not take a double dose. Take the next dose at the usual time.',
)
const noSpecialStorage = l(
  'Für dieses Arzneimittel sind keine besonderen Lagerungsbedingungen erforderlich. Für Kinder unzugänglich aufbewahren.',
  'This medicine does not require any special storage conditions. Keep out of the reach of children.',
)

export const extraMedications: RawMedication[] = [
  build({
    id: 'ibuflex',
    name: 'Ibuflex',
    strength: '400 mg',
    form: l('Filmtabletten', 'Film-coated tablets'),
    active: l('Ibuprexin (fiktiv)', 'Ibuprexin (fictional)'),
    manufacturer: l('Demo Pharma GmbH (fiktiv)', 'Demo Pharma GmbH (fictional)'),
    usedFor: l('Schmerzen und Fieber', 'Pain and fever'),
    packSize: l('20 Tabletten', '20 tablets'),
    pzn: '10000054',
    gtinBase: '401234500005',
    color: '#c2410c',
    version: '5.1',
    publishedOn: '2026-02-11',
    about: l(
      'Ibuflex enthält den Wirkstoff Ibuprexin. Es wird bei leichten bis mäßig starken Schmerzen und bei Fieber angewendet.',
      'Ibuflex contains the active substance ibuprexin. It is used for mild to moderate pain and for fever.'),
    warn: l(
      'Nehmen Sie Ibuflex nicht ein, wenn Sie ein Magengeschwür haben. Sprechen Sie mit Ihrem Arzt, wenn Sie Asthma haben.',
      'Do not take Ibuflex if you have a stomach ulcer. Talk to your doctor if you have asthma.'),
    dose: l(
      'Erwachsene nehmen 1 Tablette ein, höchstens 3 Tabletten pro Tag. Halten Sie zwischen zwei Einnahmen mindestens 6 Stunden Abstand.',
      'Adults take 1 tablet, no more than 3 tablets per day. Leave at least 6 hours between two doses.'),
    food: l(
      'Nehmen Sie die Tablette während oder nach einer Mahlzeit mit einem Glas Wasser ein.',
      'Take the tablet during or after a meal with a glass of water.'),
    missed: noDouble,
    side: l(
      'Häufig (kann bis zu 1 von 10 Behandelten betreffen): Magenbeschwerden, Übelkeit, Sodbrennen.',
      'Common (may affect up to 1 in 10 people): stomach upset, nausea, heartburn.'),
    storage: l('Nicht über 25 °C lagern. Für Kinder unzugänglich aufbewahren.', 'Store below 25 °C. Keep out of the reach of children.'),
    look: l('Ibuflex 400 mg sind weiße, längliche Filmtabletten mit der Prägung „I400“.', 'Ibuflex 400 mg are white, oblong film-coated tablets marked "I400".'),
  }),
  build({
    id: 'gastrolin',
    name: 'Gastrolin',
    strength: '20 mg',
    form: l('Magensaftresistente Tabletten', 'Gastro-resistant tablets'),
    active: l('Pantorazol (fiktiv)', 'Pantorazol (fictional)'),
    manufacturer: l('Nordapharm AG (fiktiv)', 'Nordapharm AG (fictional)'),
    usedFor: l('Sodbrennen', 'Heartburn'),
    packSize: l('14 Tabletten', '14 tablets'),
    pzn: '10000061',
    gtinBase: '401234500006',
    color: '#a16207',
    version: '3.0',
    publishedOn: '2025-11-03',
    about: l(
      'Gastrolin enthält den Wirkstoff Pantorazol. Es verringert die Bildung von Magensäure und wird bei Sodbrennen angewendet.',
      'Gastrolin contains the active substance pantorazol. It reduces stomach acid and is used for heartburn.'),
    warn: l(
      'Sprechen Sie mit Ihrem Arzt, wenn Sie ungewollt Gewicht verlieren oder Schluckbeschwerden haben.',
      'Talk to your doctor if you lose weight without trying or have difficulty swallowing.'),
    dose: l('Nehmen Sie einmal täglich eine Tablette ein.', 'Take one tablet once a day.'),
    food: l(
      'Nehmen Sie die Tablette 1 Stunde vor einer Mahlzeit ein. Schlucken Sie sie unzerkaut und zerbrechen Sie sie nicht.',
      'Take the tablet 1 hour before a meal. Swallow it whole and do not break it.'),
    missed: noDouble,
    side: l(
      'Häufig (kann bis zu 1 von 10 Behandelten betreffen): Kopfschmerzen, Durchfall, Blähungen.',
      'Common (may affect up to 1 in 10 people): headache, diarrhoea, wind.'),
    storage: noSpecialStorage,
    look: l('Gastrolin 20 mg sind gelbe, ovale Tabletten.', 'Gastrolin 20 mg are yellow, oval tablets.'),
  }),
  build({
    id: 'allerfree',
    name: 'Allerfree',
    strength: '10 mg',
    form: l('Filmtabletten', 'Film-coated tablets'),
    active: l('Cetiralin (fiktiv)', 'Cetiralin (fictional)'),
    manufacturer: l('Example Health Ltd (fiktiv)', 'Example Health Ltd (fictional)'),
    usedFor: l('Heuschnupfen', 'Hay fever'),
    packSize: l('50 Tabletten', '50 tablets'),
    pzn: '10000078',
    gtinBase: '401234500007',
    color: '#15803d',
    version: '2.4',
    publishedOn: '2026-04-22',
    about: l(
      'Allerfree enthält den Wirkstoff Cetiralin. Es lindert die Beschwerden bei Heuschnupfen, zum Beispiel Niesen und juckende Augen.',
      'Allerfree contains the active substance cetiralin. It relieves hay fever symptoms such as sneezing and itchy eyes.'),
    warn: l(
      'Allerfree kann müde machen. Wenn dies bei Ihnen auftritt, führen Sie kein Fahrzeug. Trinken Sie während der Einnahme keinen Alkohol.',
      'Allerfree can make you tired. If this happens, do not drive. Do not drink alcohol while taking it.'),
    dose: l('Erwachsene nehmen einmal täglich eine Tablette ein.', 'Adults take one tablet once a day.'),
    food: l('Sie können die Tablette unabhängig von den Mahlzeiten einnehmen.', 'You can take the tablet with or without food.'),
    missed: noDouble,
    side: l(
      'Häufig (kann bis zu 1 von 10 Behandelten betreffen): Müdigkeit, Mundtrockenheit.',
      'Common (may affect up to 1 in 10 people): tiredness, dry mouth.'),
    storage: l('Nicht über 30 °C lagern.', 'Store below 30 °C.'),
    look: l('Allerfree 10 mg sind weiße, runde Filmtabletten mit Bruchkerbe.', 'Allerfree 10 mg are white, round film-coated tablets with a score line.'),
  }),
  build({
    id: 'metforal',
    name: 'Metforal',
    strength: '500 mg',
    form: l('Filmtabletten', 'Film-coated tablets'),
    active: l('Metformex (fiktiv)', 'Metformex (fictional)'),
    manufacturer: l('Demo Pharma GmbH (fiktiv)', 'Demo Pharma GmbH (fictional)'),
    usedFor: l('Typ-2-Diabetes', 'Type 2 diabetes'),
    packSize: l('120 Tabletten', '120 tablets'),
    pzn: '10000085',
    gtinBase: '401234500008',
    color: '#4338ca',
    version: '6.2',
    publishedOn: '2026-07-30',
    about: l(
      'Metforal enthält den Wirkstoff Metformex. Es senkt den Blutzucker bei Typ-2-Diabetes.',
      'Metforal contains the active substance metformex. It lowers blood sugar in type 2 diabetes.'),
    warn: l(
      'Sprechen Sie mit Ihrem Arzt, bevor Sie Metforal einnehmen, wenn Sie Nierenprobleme haben. Trinken Sie möglichst wenig Alkohol.',
      'Talk to your doctor before taking Metforal if you have kidney problems. Drink as little alcohol as possible.'),
    dose: l('Die übliche Anfangsdosis ist zweimal täglich eine Tablette.', 'The usual starting dose is one tablet twice a day.'),
    food: l('Nehmen Sie die Tablette zu oder nach einer Mahlzeit ein.', 'Take the tablet with or after a meal.'),
    missed: noDouble,
    side: l(
      'Sehr häufig (kann mehr als 1 von 10 Behandelten betreffen): Übelkeit, Bauchschmerzen, Durchfall.',
      'Very common (may affect more than 1 in 10 people): nausea, stomach pain, diarrhoea.'),
    storage: noSpecialStorage,
    look: l('Metforal 500 mg sind weiße, runde Filmtabletten.', 'Metforal 500 mg are white, round film-coated tablets.'),
  }),
  build({
    id: 'cardiolat',
    name: 'Cardiolat',
    strength: '5 mg',
    form: l('Tabletten', 'Tablets'),
    active: l('Amlodor (fiktiv)', 'Amlodor (fictional)'),
    manufacturer: l('Nordapharm AG (fiktiv)', 'Nordapharm AG (fictional)'),
    usedFor: l('Bluthochdruck', 'High blood pressure'),
    packSize: l('100 Tabletten', '100 tablets'),
    pzn: '10000092',
    gtinBase: '401234500009',
    color: '#be123c',
    version: '1.7',
    publishedOn: '2025-12-09',
    about: l('Cardiolat enthält den Wirkstoff Amlodor. Es wird bei Bluthochdruck angewendet.', 'Cardiolat contains the active substance amlodor. It is used for high blood pressure.'),
    warn: l('Sprechen Sie mit Ihrem Arzt, bevor Sie Cardiolat einnehmen, wenn Sie Leberprobleme haben.', 'Talk to your doctor before taking Cardiolat if you have liver problems.'),
    dose: l('Die übliche Dosis ist einmal täglich eine Tablette.', 'The usual dose is one tablet once a day.'),
    food: l(
      'Sie können die Tablette unabhängig von den Mahlzeiten einnehmen. Trinken Sie während der Einnahme keinen Grapefruitsaft.',
      'You can take the tablet with or without food. Do not drink grapefruit juice while taking it.'),
    missed: noDouble,
    side: l(
      'Häufig (kann bis zu 1 von 10 Behandelten betreffen): geschwollene Knöchel, Kopfschmerzen.',
      'Common (may affect up to 1 in 10 people): swollen ankles, headache.'),
    storage: l('Nicht über 30 °C lagern.', 'Store below 30 °C.'),
    look: l('Cardiolat 5 mg sind weiße, achteckige Tabletten mit der Prägung „CL5“.', 'Cardiolat 5 mg are white, octagonal tablets marked "CL5".'),
  }),
  build({
    id: 'vitasol',
    name: 'VitaSol D3',
    strength: '25 µg',
    form: l('Tabletten', 'Tablets'),
    active: l('Colecalciferol (Vitamin D3)', 'Colecalciferol (vitamin D3)'),
    manufacturer: l('Example Health Ltd (fiktiv)', 'Example Health Ltd (fictional)'),
    usedFor: l('Vitamin-D-Mangel', 'Vitamin D deficiency'),
    packSize: l('90 Tabletten', '90 tablets'),
    pzn: '10000108',
    gtinBase: '401234500010',
    color: '#ca8a04',
    version: '1.1',
    publishedOn: '2026-01-15',
    about: l(
      'VitaSol D3 enthält Vitamin D3. Es wird zur Vorbeugung und Behandlung von Vitamin-D-Mangel angewendet.',
      'VitaSol D3 contains vitamin D3. It is used to prevent and treat vitamin D deficiency.'),
    warn: l('Nehmen Sie VitaSol D3 nicht ein, wenn Sie zu viel Calcium im Blut haben.', 'Do not take VitaSol D3 if you have too much calcium in your blood.'),
    dose: l('Nehmen Sie täglich eine Tablette ein.', 'Take one tablet a day.'),
    food: l('Nehmen Sie die Tablette am besten zu einer Mahlzeit ein.', 'It is best to take the tablet with a meal.'),
    missed: noDouble,
    side: l(
      'Wenn die Dosis zu hoch ist, können Übelkeit, starker Durst und häufiges Wasserlassen auftreten.',
      'If the dose is too high, nausea, strong thirst and passing water often can occur.'),
    storage: l('Nicht über 25 °C lagern. Vor Licht schützen.', 'Store below 25 °C. Protect from light.'),
    look: l('VitaSol D3 sind kleine, weiße, runde Tabletten.', 'VitaSol D3 are small, white, round tablets.'),
  }),
]
