# BMAD decisions and assumptions (lightweight)

## 1. Analyst: users and problems

- **UC1 – patient with a new medicine:** unfamiliar with it, wants to feel confident before the first use, often on the move with poor signal.
- **UC2 – daughter helping her older dad:** the paper leaflet is lost and there is no box, only the blister. Dad is not used to searching for information and needs large text and audio.
- **UC3 – patient with a chronic disease:** knows her medicine well and is surprised by a colour change. She wants the difference between the old and new leaflet, not the whole text again.
- **Assumptions**
  - The manufacturer provides the leaflet in a structured form (chapters → paragraphs with stable ids) together with its version history.
  - Plain-language explanations of changes are written and reviewed by a pharmacist. The app does not generate medical text.
  - A barcode on the box is an exact product code. A blister often shows only the name and strength.

## 2. Product Manager: MVP (from the story maps)

- **In:** scan barcode / type name / blister photo; exact product check; version and date; chapters with progress; read aloud with highlighting; step cards with an audio guide; questions answered with citations; print with QR; read-aloud mode; version comparison; call pharmacy; German and English.
- **Later (below the MVP line):** chat with a pharmacist, more than one older version, dosage reminders, saving as PDF, voice search, other languages.
- **Hard rule (failure scenarios):** answer only from the leaflet and cite the passage. If there is no source, say so and offer the pharmacy.

## 3. UX Designer: key decisions

- **Three equal ways in** on the start page (modality switching). If one fails, the others are one tap away.
- **Confirmation matched to risk:** a barcode scan is an exact match (implicit confirmation). A typed name or blister photo means "Is this your medicine?" (explicit). Several matches mean the user must choose.
- **Never colour alone:** text labels, icons and border styles mark changes.
- **Read ↔ listen:** the same text, with the spoken sentence highlighted. Tapping a sentence jumps there, and the speed is saved.
- **Big buttons and Text & contrast** settings for older users. These change only the look, never the wording.
- **Trust:** every answer, step card and change links to its exact paragraph. Version and date are always visible.

## 4. Architect: architecture

- **Mobile-first web app** (React + TypeScript + Vite + Tailwind). It needs no installation (UC2) and also works on a pharmacy desktop.
- **Everything runs in the browser:** ZXing for barcodes and QR codes, tesseract.js for blister text, the Web Speech API for read-aloud, and qrcode for the print QR. There is no server, no account and no keys.
- **Structured representation = the handover point:** a product code or the recognised text is matched **exactly** against the product database (`src/lib/search.ts`). From there on only fixed rules apply. Comparison and Q&A work on the stored leaflet text (`compare.ts`, `qa.ts`).
- **Privacy:** camera frames and photos stay on the device, and questions are not stored. Only settings, "My medicines" and reading progress are kept in local storage.
- **Offline:** data is bundled with the app, and a service worker caches the app in the production build.

## 5. Developer: build and test

- 27 unit tests (Vitest):
  - version comparison;
  - every demo barcode decodes with the same scanner library;
  - code lookup, name search with typos and blister text matching;
  - Q&A citations and "not in the leaflet" answers;
  - sentence splitting;
  - German and English data have the same structure;
  - no explanation contains advice wording.
- Tested by hand in the browser:
  - all three use cases;
  - barcode via image upload and blister text recognition;
  - read-aloud highlighting, jump, stop and auto-ticked chapters;
  - Text & contrast settings, and German ↔ English.
