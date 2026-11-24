# BMAD decisions and assumptions (lightweight)

## 1. Analyst: problem and users

- **User:** a patient with a chronic condition who takes the same medicine for a long time. They aren't a medical expert and may have poor eyesight or colour-vision deficiency. They may be anxious when something looks different, like a capsule that changed colour.
- **Need:** "What is different in my leaflet, and does it explain what I noticed?" The patient needs to find this quickly, in plain words, and be able to check it against the original text.
- **Assumptions**
  - The pharmacy or manufacturer provides the leaflet in a structured digital form (sections → paragraphs), with stable ids for each paragraph.
  - A short plain-language explanation of each change is written and reviewed by a qualified editor (for example a pharmacist) and stored with the leaflet. The app does **not** generate medical text.
  - Only the current version and the version directly before it are compared.

## 2. Product Manager: MVP scope

- **In scope:** medication list → overview → compare → change details → original leaflet, with filtering by change type.
- **Out of scope (on purpose):** login, a database or backend, OCR or scanning of paper leaflets, chatbot or AI explanations, reminders, and the other use cases (UC1, UC2).
- **Acceptance criteria:** see [`user-stories.md`](./user-stories.md).

## 3. UX Designer: key design decisions

- **One clear path:** a large primary "Compare versions" button, then a list of changes grouped by leaflet section, then a detail dialog.
- **Never colour alone:** each change type has a text label, an icon (+ / pencil / −) and a border style (solid / double / dashed). Colours are blue, amber and rose instead of red and green.
- **Old vs. new side by side** (stacked on mobile), plus an optional word-by-word view using semantic `<ins>`/`<del>` with screen-reader text.
- **Trust:** every change links to the exact paragraph in the original leaflet. Version numbers and dates are always visible.
- **Safety:** a demo banner on every page, and a safety note that the app doesn't give medical advice.
- **Accessibility:** semantic HTML, a native `<dialog>` (focus trap, Escape to close), visible focus outlines, focus moved to the page heading on navigation, a skip link, `aria-pressed` filters, an `aria-live` summary, and support for reduced motion.

## 4. Architect: architecture

- **Single-page app:** React 19 + TypeScript + Vite + Tailwind CSS 4. There is no backend. All data is in `src/data/medications.ts`.
- **Comparison logic** (`src/lib/compare.ts`) is a pure function and can be tested on its own:
  - paragraphs are matched by id: *added* = only in current, *removed* = only in previous, *changed* = in both with different text;
  - a small LCS word diff highlights changed words.
- **Routing:** a tiny hash router (`src/lib/router.ts`). URLs can be shared and the browser back button works, without an extra library.
- **Language:** German by default, English on request. Interface texts are in one typed file per language; leaflet data is stored as `{ de, en }`. This is a small React context with no i18n library, so it stays easy to explain.
- **Why this approach:** it is simple to explain, runs offline, and needs no API keys. A real product would load leaflets from an API, but the comparison and the UI would stay the same.

## 5. Developer: build and test

- Unit tests (Vitest) in `src/lib/compare.test.ts`. They check the change counts, the required sections, old and new text, that every change has an explanation, that no explanation contains advice phrases, and the word diff.
- The main workflow was tested by hand in the browser at desktop and mobile width.
