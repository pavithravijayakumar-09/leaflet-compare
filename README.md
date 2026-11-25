# LeafletCheck – digital medicine leaflets (UC1, UC2, UC3 prototype)

A working prototype for the three use cases of the exam board:

- **UC1 – New medicine:** scan the box, read or listen to all chapters, learn how to use it with step cards, and ask questions that are answered with quotes from the leaflet.
- **UC2 – Daughter helps her dad:** recognise the medicine from a photo of the blister, check the leaflet is up to date, print it with a QR code, and give him a read-aloud mode with big buttons.
- **UC3 – Capsule has a new colour:** compare the current leaflet with the previous one, see every change labelled Added / Changed / Removed, and ask "Why is my capsule green?".

The app is **German by default**. The **English** button in the header translates everything (interface, leaflet texts, explanations, dates, read-aloud voice).

> ⚠️ **Demo data only.** All medicines, leaflet texts, codes and manufacturers are fictional. Nothing here is real medical information or medical advice.

## Try it online

**Live prototype:** <https://pavithravijayakumar-09.github.io/leaflet-compare/>

To publish a new version, run `npm run deploy`. It runs the tests, builds the app and pushes the `dist/` folder to the `gh-pages` branch, which GitHub Pages serves (see `scripts/deploy-pages.sh`). Open the link on a phone to try the camera scanner and the blister photo. The site uses HTTPS, which browsers require before they allow the camera.

## Run it locally

You need **Node.js 20 or newer**.

```bash
npm install
npm run dev
```

Open the URL printed in the terminal (usually <http://localhost:5173>). Chrome or Edge is recommended: they have the best support for camera scanning and German read-aloud voices.

```bash
npm test          # unit tests (comparison, search, barcodes, Q&A, translations)
npm run build     # type-check and production build into dist/ (includes the offline cache)
npm run preview   # serve the production build
```

## Features

| Feature | How it works | Use case |
| --- | --- | --- |
| **Scan barcode / QR** | Camera scanning with ZXing, in the browser and offline. A barcode is an exact match; a QR code from the printout opens read-aloud. "Choose a photo of the barcode" works without a camera. | S1, UC1, UC2 |
| **Type the name** | Typo-tolerant search. Several matches (Cardiovex 50 / 100 mg) → you must choose. No match → "not found". | S1 |
| **Photo of the blister** | Text recognition with tesseract.js in the browser. Recognised text is matched to product names, and you tap the right one. The first use downloads language data once. | UC2 |
| **Product check** | Name, strength, manufacturer, PZN, pack picture. "Is this your medicine?" after a typed or photo search. | S1 |
| **Version and date** | Leaflet version, last revised date, current/outdated status. | UC2, UC3 |
| **Chapters + progress** | Chapter list, jump to chapter, ticks saved on the device. | UC1 |
| **Colour-coded leaflet** | Changes coloured and labelled in the text (Added / Changed / Removed, word-level diff, removed text shown struck through), with an on/off switch and a legend. Warnings in an orange frame with ⚠, side effects in a violet frame with frequency badges, and an "Important at a glance" box. | UC1, UC3 |
| **Read aloud** | Browser speech (Web Speech API). Sentence-by-sentence highlighting, tap a sentence to jump, pause/resume, speed saved. | UC1, UC2 |
| **Read-aloud mode** | Big buttons: previous / play-pause / next, slow / normal / fast. | UC2 |
| **Step cards** | Numbered "how to use" cards quoting the leaflet, an "Understood" button, and an audio guide that follows the cards. | UC1 |
| **Ask the leaflet** | Keyword matching (German + English, synonyms) → the best leaflet sentence as a quote with a source link. No match → "not in the leaflet" + call pharmacy. No generative AI. | UC1, UC3 |
| **Compare versions** | Paragraph-level diff (Added / Changed / Removed), word-level highlighting, plain explanations, links to both originals. | UC3 |
| **Print** | Print preview with version, dates and QR code; print stylesheet hides the app chrome. | UC2 |
| **Text & contrast** | 4 text sizes, high contrast, high-contrast dark, wide line spacing. Saved on the device. | All |
| **Offline** | Medicines you open are saved under "My medicines". The production build caches the app with a small service worker. | UC1 |
| **Call pharmacy** | One-tap `tel:` button to a fictional demo pharmacy. | All |

## Demo walkthrough (about 5 minutes)

Open **Demo-Anleitung** (Demo guide) on the start page. It has a barcode, a blister picture and a QR code for every demo medicine. Show them on a second screen, print them, or use "Als Bild speichern" (Save as picture) and pick the file in the scanner or the blister photo page.

1. **Start page (German):** point out the three ways in. Optionally open **Aa Text & Kontrast** and choose a bigger text size.
2. **UC1:** "Barcode scannen" → scan the Respilan barcode → exact match. "Packungsbeilage lesen" → chapter list → "Alles vorlesen" (watch the highlighting, tap a sentence) → back → "Anwendung Schritt für Schritt" → "Verstanden – weiter" → "Frage zur Beilage": "Kann ich das mit Essen anwenden?"
3. **UC2:** "Foto vom Blister" → choose the Thyrovita blister picture → tap Thyrovita → "Ja, das ist es" → show version and date → "Drucken" (preview with QR) → "Vorlesen lassen" → big buttons and speed.
4. **UC3:** type "cardiovex" → two results, choose **50 mg** → confirm → "Neue Version … Änderungen ansehen" → open the capsule change (red → green) → "Frage zur Beilage": "Warum ist meine Kapsel grün?" → quoted answer + "Apotheke anrufen". Also show "Darf ich Alkohol trinken?" → "not in the leaflet".
5. Press **English** to show the translation.

## Project structure

```
docs/
  user-stories.md          User stories for UC1, UC2, UC3 with Given/When/Then acceptance criteria
  bmad-decisions.md        Brief BMAD decisions and assumptions
public/sw.js               Offline cache (production build)
src/
  data/                    Fictional medicines (German + English), types
  lib/compare.ts           Version comparison + word diff (UC3)
  lib/search.ts            Code lookup, name search, blister text matching (S1)
  lib/qa.ts                Question → quoted leaflet passage, never invented (UC1/UC3)
  lib/barcode.ts           EAN-13 check digit + bar pattern for the demo barcodes
  lib/sentences.ts         Sentence splitting for read-aloud highlighting
  lib/router.ts            Tiny hash router
  lib/storage.ts           Saved medicines and reading progress (this device only)
  i18n/                    German and English texts, language switch
  settings/                Text size, contrast, line spacing, voice speed
  speech/                  Read-aloud engine (Web Speech API)
  components/              UI parts: product card, pictures (pack, barcode, blister, QR), audio bar, dialogs
  pages/                   Home, Scan, Search, Photo, Overview, LeafletViewer, Listen, Steps, Ask, Compare, Print, Demo, Info
```

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · ZXing (barcode/QR) · tesseract.js (text recognition) · qrcode · Web Speech API · Vitest. There is no backend, no account and no API keys.
