# LeafletCheck: Medication Leaflet Version Comparison (UC3 prototype)

A working prototype for **UC3**. A patient notices that their capsule changed colour (red → green). They open the medication, compare the current leaflet with the previous one, see every change labelled **Added**, **Changed** or **Removed**, open a change to read the old text, the new text and a plain explanation, and check it against the original leaflet text.

> ⚠️ **Demo data only.** "Cardiovex" and "Respilan" are fictional medicines. None of the texts are real medical information or medical advice.

## Run it locally

You need **Node.js 20 or newer** (`node -v`).

```bash
npm install
npm run dev
```

Then open the URL printed in the terminal (usually <http://localhost:5173>).

Other commands:

```bash
npm test          # unit tests for the comparison logic (Vitest)
npm run build     # type-check and production build into dist/
npm run preview   # serve the production build
```

## Language: German first, English on request

The app starts in **German**. The **English** button in the header (globe icon) switches everything to English: the interface, the demo leaflet texts, the explanations and the date format. The same button, now labelled **Deutsch**, switches back. The choice is remembered in the browser.

- Interface texts: `src/i18n/strings.ts` (German object + English object; TypeScript checks that both have every key)
- Language state, `<html lang>` and date formatting: `src/i18n/LanguageContext.tsx`
- Leaflet data is stored in both languages (`{ de, en }`) in `src/data/medications.ts`, and `findMedication(id, lang)` returns one language

The comparison logic doesn't need to know the language: it matches paragraphs by id, so it gives the same result in German and English (this is checked by a unit test).

## Demo walkthrough (about 5 minutes)

0. The app opens in German. Press **English** in the header to show the translation (you can record in either language).
1. **My medications** → choose **Cardiovex 50 mg**.
2. **Overview:** medication card, then *Current leaflet v4.0 (12 October 2026)* and *Previous leaflet v3.1 (4 March 2025)*.
3. Press **Compare versions** → summary: 8 changes (5 changed, 2 added, 1 removed), grouped by section.
4. Try the **filters** (Changed / Added / Removed) and open **How to read the labels**.
5. Click the change in **6. What Cardiovex looks like** → old text (red) vs. new text (green), word-by-word highlighting, and the explanation.
6. Press **View in current leaflet** → the original leaflet opens at that paragraph. Switch to **Previous (v3.1)** to verify.
7. Show a **Removed** change (side effects: "changes in taste") and an **Added** one (warnings: angioedema).
8. Resize the window to phone width to show the responsive layout. Point out the demo banner and the safety note.

## Project structure

```
docs/
  user-stories.md        User stories + Given/When/Then acceptance criteria
  bmad-decisions.md      Brief BMAD decisions and assumptions
src/
  data/types.ts          Data model (Medication, LeafletVersion, Section, Paragraph)
  data/medications.ts    Fictional demo leaflets (previous + current) and explanations
  lib/compare.ts         Comparison logic: added/changed/removed + word diff
  lib/compare.test.ts    Unit tests
  lib/router.ts          Tiny hash router
  components/ui.tsx      Badges, icons, banner, safety note, language button
  i18n/strings.ts        All interface texts in German + English
  i18n/LanguageContext.tsx  Current language, toggle, date format
  components/ChangeDialog.tsx  Change detail (old vs new, explanation, verify links)
  pages/Home.tsx         My medications
  pages/Overview.tsx     Medication overview + leaflet versions + Compare button
  pages/Compare.tsx      Comparison screen with filters
  pages/LeafletViewer.tsx Original leaflet text (current / previous)
```

## How the comparison works

Every leaflet paragraph has a stable `id` in both versions. `compareLeaflets()` walks through the sections:

- the id exists only in the **current** version → **Added**
- the id exists only in the **previous** version → **Removed**
- the id exists in both but the text differs → **Changed**

For changed text, a small word-level LCS diff shows exactly which words were inserted or deleted.

The plain-language explanations are **pre-written data** (in a real product, written and reviewed by a pharmacist). They are not generated, so the app can't invent medical recommendations. A unit test also checks that no explanation contains advice wording such as "stop taking" or "you should".

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · Vitest. No backend, no database, no API keys.
