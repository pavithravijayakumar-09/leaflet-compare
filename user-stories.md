# User stories – UC3: Medication Leaflet Version Comparison

**Scenario.** A patient with a chronic condition receives her usual medication. While unpacking a capsule she notices that it is now green instead of red. She wants to check the current digital leaflet against the previous version to see what has changed.

**Main user story**

> **US-0:** As a patient with a chronic condition, I want to compare the current and previous versions of my medication leaflet and see the changed sections highlighted, so that I can quickly understand what information has changed.

US-0 is split into the smaller stories below. Each one has acceptance criteria in the form *Given [state], when [action], then [observable result]*. The demo medicine is **Cardiovex 50 mg**, which is fictional.

---

### US-1: Open a medication and see its leaflet versions

As a patient with a chronic condition, I want to open my medication and see its current and previous leaflet versions with their dates, so that I know a newer leaflet exists and how old each version is.

**Acceptance criteria**

- **AC-1.1:** Given I am on "My medications", when I select "Cardiovex 50 mg", then I see an overview card with the name, strength, form, active substance, the condition it is prescribed for, and the manufacturer.
- **AC-1.2:** Given I am on the Cardiovex overview, when the page loads, then I see "Current leaflet, Version 4.0, published 12 October 2026" and "Previous leaflet, Version 3.1, published 4 March 2025".
- **AC-1.3:** Given I am on the Cardiovex overview, when I look for the next step, then I see a clearly labelled "Compare versions" button.

### US-2: Compare both versions

As a patient with a chronic condition, I want to compare the two leaflet versions in one step, so that I don't have to read both leaflets in full myself.

**Acceptance criteria**

- **AC-2.1:** Given I am on the Cardiovex overview, when I press "Compare versions", then a comparison screen opens. It shows which two versions are compared (v3.1 → v4.0) and the date of each.
- **AC-2.2:** Given the comparison screen is open, when it loads, then I see a summary of all changes ("8 changes found in 5 sections") and a count for each type: Changed 5, Added 2, Removed 1.
- **AC-2.3:** Given the comparison screen is open, when I look at the list, then only sections with changes are shown. In the demo these are Warnings and precautions, How to take, Side effects, Storage, and Appearance. The unchanged section "What Cardiovex is used for" is not shown.

### US-3: See changed sections highlighted and labelled

As a patient with a chronic condition, I want every change to be clearly labelled as Added, Changed or Removed, so that I can understand the kind of change at a glance, even if I can't tell colours apart.

**Acceptance criteria**

- **AC-3.1:** Given the comparison screen is open, when I look at a change, then it carries a text label ("Added", "Changed" or "Removed") with its own icon (+, pencil, −) and its own border style (solid, double, dashed). The meaning never depends on colour alone.
- **AC-3.2:** Given the comparison screen is open, when I select the "Removed" filter, then only removed text is listed, and a screen reader announces the new summary.
- **AC-3.3:** Given the comparison screen is open, when I open "How to read the labels", then I see an explanation of each label and of how the word-level highlighting works.

### US-4: Open a change and understand it

As a patient with a chronic condition, I want to click a change and see the old text, the new text and a simple explanation, so that I understand exactly what is different without medical jargon.

**Acceptance criteria**

- **AC-4.1:** Given the comparison screen is open, when I click the "Changed" item in "6. What Cardiovex looks like", then a detail dialog opens. It shows the previous text ("…red, opaque hard capsules…") and the current text ("…green, opaque hard capsules…"), each with its version number and date.
- **AC-4.2:** Given the detail dialog of a changed paragraph is open, when I look at "Word-by-word changes", then new words are underlined and highlighted, and removed words are struck through. Screen readers announce them as "added" and "removed".
- **AC-4.3:** Given the detail dialog is open, when I read "What changed, in simple words", then I see a plain-language description of the change. For example: "the leaflet now describes the capsules as green instead of red".
- **AC-4.4:** Given the detail dialog of an "Added" change is open, when I look at "Previous text", then it says the text did not exist in the previous leaflet. The same applies the other way round for "Removed".
- **AC-4.5:** Given the detail dialog is open, when I press Escape, click outside the dialog, or press the close (×) button, then the dialog closes and I am back on the comparison list.

### US-5: Verify a change in the original leaflet

As a patient with a chronic condition, I want to open the original leaflet text at the place of the change, so that I can check that the comparison is correct and trust it.

**Acceptance criteria**

- **AC-5.1:** Given the detail dialog of a change is open, when I press "View in current leaflet", then the full original text of version 4.0 opens, scrolls to that paragraph, and marks it with a focus ring.
- **AC-5.2:** Given I am viewing the original leaflet, when I switch between "Current (v4.0)" and "Previous (v3.1)", then the full text of the chosen version is shown with its publication date.
- **AC-5.3:** Given I am viewing the original leaflet, when I read through it, then changed paragraphs carry the same Added, Changed or Removed label as on the comparison screen, and unchanged text has no label.

### US-6: Safe, readable and accessible prototype

As a patient with a chronic condition, I want the app to be readable on my phone and honest about what it can do, so that I don't mistake it for medical advice.

**Acceptance criteria**

- **AC-6.1:** Given I open any page, when it loads, then a banner says the medicines and texts are fictional demo data and not medical advice.
- **AC-6.2:** Given I am on the overview, the comparison or a change detail, when I read the safety note, then it says the app only shows what changed in the text, and that I should not stop or change my medicine because of it but ask my pharmacist or doctor.
- **AC-6.3:** Given I read any explanation, when I check its wording, then it only describes what the leaflet text says. It never recommends a dose, a stop, a switch or any other treatment decision. This is checked by an automated test.
- **AC-6.4:** Given I use a phone-sized screen (375 px wide), when I go through the whole flow, then all content fits without horizontal scrolling and all buttons are easy to tap.
- **AC-6.5:** Given I use only the keyboard, when I tab through the app, then every interactive element can be reached, shows a visible focus outline, and the detail dialog keeps focus inside it until it is closed.

### US-7: Read the app in German or English

As a patient with a chronic condition, I want the app to be in German by default and to switch it to English with one button, so that I can read the leaflet changes in the language I understand best.

**Acceptance criteria**

- **AC-7.1:** Given I open the app for the first time, when the page loads, then all labels, the demo leaflet texts and the explanations are in German, for example "Meine Arzneimittel" and "Versionen vergleichen".
- **AC-7.2:** Given the app is in German, when I press the "English" button in the header, then every text on the current page switches to English straight away, including the leaflet texts, the explanations and the dates ("12. Oktober 2026" becomes "12 October 2026"), and I stay on the same page.
- **AC-7.3:** Given the app is in English, when I press the "Deutsch" button, then everything switches back to German.
- **AC-7.4:** Given I chose English, when I reload the page, then the app is still in English.
- **AC-7.5:** Given I use a screen reader, when the language changes, then the page's `lang` attribute changes too (`de` or `en`), so the text is read with the right pronunciation.

> Note: in the demo the app starts in German, so the labels in US-1 to US-6 appear as "Neu", "Geändert", "Entfernt", "Versionen vergleichen" and so on. The English names are used above for readability.

---

## Traceability

| Exam acceptance criterion | Covered by |
| --- | --- |
| 1. Open a medication, see current and previous versions | US-1 |
| 2. Compare both versions | US-2 |
| 3. Changed sections highlighted and labelled | US-3 |
| 4. Click a change: previous text, current text, explanation | US-4 |
| 5. Access original text to verify | US-5 |
| 6. Readable, responsive, accessible | US-3, US-6 |
| 7. No invented medical recommendations | US-6 (AC-6.2, AC-6.3) |
| Extra: German / English translation | US-7 |
