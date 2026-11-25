# User stories – UC1, UC2, UC3 (digital medicine leaflet)

The stories come from the story maps and step sheets of the exam board. Each story is written as *As a [user], I want [goal], so that [value]*. Each acceptance criterion is written as *Given [state], when [action], then [observable result]*.

The app is in **German by default** and can be switched to **English** (the only translation). Labels below are given in German with the English version in brackets.

All medicines are fictional demo data:

| Medicine | Used in | Why |
| --- | --- | --- |
| **Respilan 100 µg** (inhaler) | UC1 | A new medicine with "how to use" steps |
| **Thyrovita 50 µg** (tablets) | UC2 | Dad's medicine, found by the name printed on the blister |
| **Cardiovex 50 mg** | UC3 | The capsule changed colour; there is a current and a previous leaflet |
| **Cardiovex 100 mg** | S1 | Same name as Cardiovex 50 mg, so the search must ask which one |
| Ibuflex, Gastrolin, Allerfree, Metforal, Cardiolat, VitaSol D3 | Search tests | Extra demo medicines. "Cardiolat" sounds like "Cardiovex" on purpose |

---

## Shared step S1 – identify the medicine (UC1, UC2, UC3)

### US-S1.1: Find my medicine by barcode, name or blister photo

As a patient, I want to search for my medication by scanning the barcode, typing the name or taking a photo of the blister, so that I can access the digital leaflet without having to read the physical leaflet.

- **AC-S1.1.1:** Given I am on the start page, when the page loads, then I see three equal options: "Barcode scannen" (Scan barcode), "Namen eingeben" (Type the name) and "Foto vom Blister" (Photo of the blister).
- **AC-S1.1.2:** Given I am on the scanner page, when I scan the barcode of the Respilan pack (or choose a photo of it), then the Respilan page opens directly with the message "Per Barcode erkannt – exakte Übereinstimmung (PZN 10000030)" (Recognised by barcode – exact match).
- **AC-S1.1.3:** Given I scan a code that is not in the database, when it is read, then I see "Der Code … gehört zu keinem Arzneimittel in der Datenbank" (not found), and no other product is suggested.
- **AC-S1.1.4:** Given the camera cannot be started, when I press "Kamera starten" (Start camera), then I see an error and can switch to a barcode photo, the name search or the blister photo.
- **AC-S1.1.5:** Given I type "cardivex" (with a typo), when I search, then Cardiovex is still found. Given I type a name that does not exist, then I see "Nicht gefunden" (Not found) and the options to scan or call the pharmacy.

### US-S1.2: Confirm the exact medicine

As a patient, I want to see the name, strength, manufacturer and a picture of the pack in the results, so that I can be sure I open the right leaflet.

- **AC-S1.2.1:** Given I typed "cardiovex", when the results load, then I see two products (50 mg and 100 mg), each with name, strength, manufacturer, PZN and a pack picture, and the message asks me to choose by strength and manufacturer.
- **AC-S1.2.2:** Given I select a product from a typed search or a blister photo, when its page opens, then I am first asked "Ist das Ihr Arzneimittel?" (Is this your medicine?) with "Ja, das ist es" (Yes, this is it) and "Nein, anderes suchen" (No, search again).
- **AC-S1.2.3:** Given a value is missing for a product, when its details are shown, then the value reads "nicht verfügbar" (not available) instead of a guess.

---

## UC1 – New medicine: read it on the way home

*Patient gets a new medicine in the pharmacy. On his way home he checks the digital leaflet and reads through all chapters, especially how to use it.*

### US-1.1: Open the leaflet by scanning the box

As a patient with a new medicine, I want to open its leaflet by scanning the box, so that I can read it on the way home.

- **AC-1.1.1:** Given I scanned the Respilan barcode, when the product page opens, then I see the product, manufacturer, pack picture, leaflet version 1.2 and "Zuletzt überarbeitet: 1. September 2026" (Last revised).
- **AC-1.1.2:** Given I opened Respilan once, when I go back to the start page, then it is listed under "Meine Arzneimittel" (My medicines) as saved on this device. In the production build the app is also cached for offline use.

### US-1.2: See all chapters at a glance

As a patient, I want to see all chapters at a glance, so that I know what to read first.

- **AC-1.2.1:** Given I open "Packungsbeilage lesen" (Read the leaflet), when the page loads, then I see a list of all 6 chapters with a progress line "0 von 6 Kapiteln gelesen" (0 of 6 chapters read).
- **AC-1.2.2:** Given the chapter list is shown, when I tap a chapter, then the page jumps to that chapter.
- **AC-1.2.3:** Given I tap "Als gelesen markieren" (Mark as read) on a chapter, when I come back later on the same device, then that chapter still has a tick and the progress count includes it.

### US-1.3: Switch between reading and listening

As a patient, I want to switch between reading and listening without losing track of the section, so that I can get through all of them.

- **AC-1.3.1:** Given I am on the leaflet, when I press "Alles vorlesen" (Read everything aloud) or "Kapitel vorlesen" (Read chapter aloud), then the text is read aloud in the app language and the sentence being read is highlighted.
- **AC-1.3.2:** Given the leaflet is being read aloud, when I tap any sentence, then reading continues from that sentence.
- **AC-1.3.3:** Given the leaflet is being read aloud, when I press pause and later resume in the audio bar, then reading continues at the same sentence.
- **AC-1.3.4:** Given a chapter has been read aloud to the end, when its last sentence finishes, then the chapter is ticked as read automatically.

### US-1.4: Learn how to use it with visual cues

As a patient, I want to learn how to use the medication by visual cues, so that I can follow it the first time without having to read it.

- **AC-1.4.1:** Given I open "Anwendung Schritt für Schritt" (How to use, step by step) for Respilan, when the page loads, then I see card 1 of 6 with a picture, a short title and the leaflet sentence quoted word for word.
- **AC-1.4.2:** Given a step card is shown, when I press "Verstanden – weiter" (Understood – next), then the next card is shown and the step dot of the previous card shows a tick. "Zurück" (Back) goes to the previous card.
- **AC-1.4.3:** Given I press "Audio-Anleitung" (Audio guide), when the steps are read aloud, then the card shown follows the step being read.
- **AC-1.4.4:** Given a step card is shown, when I tap "Quelle in der Beilage" (Source in the leaflet), then the leaflet opens at that paragraph.

### US-1.5: Quick answers with proof from the leaflet

As a patient, I want quick answers that show their source in the leaflet, so that I can trust them.

- **AC-1.5.1:** Given I am on "Frage zur Beilage" (Ask about the leaflet) for Respilan, when I ask "Kann ich das mit Essen anwenden?" (Can I use it with food?), then the answer is the quoted sentence "Sie können Respilan unabhängig von den Mahlzeiten anwenden." with its section and a "Quelle in der Beilage anzeigen" (Show source) link.
- **AC-1.5.2:** Given I ask something the leaflet does not mention (e.g. "Darf ich Alkohol trinken?" for Cardiovex), when the answer appears, then it says "Dazu steht nichts in der Packungsbeilage" (The leaflet does not say anything about this) and offers "Apotheke anrufen" (Call pharmacy). No answer is invented.
- **AC-1.5.3:** Given I asked a question, when I leave the page, then the question is not stored.

### US-1.6: Warnings and side effects stand out

As a patient with a new medicine, I want the warnings and side effects to stand out in the leaflet, so that I do not overlook the information that matters most for my safety.

- **AC-1.6.1:** Given I open the leaflet, when the page loads, then a box "Wichtig auf einen Blick" (Important at a glance) lists the warnings and side effects quoted from the leaflet. Tapping one jumps to that passage.
- **AC-1.6.2:** Given I scroll to chapter 2, when it is shown, then it has an orange frame with the heading "Wichtig: Warnhinweise" (Important: warnings), and every warning starts with a ⚠ sign.
- **AC-1.6.3:** Given I scroll to chapter 4, when it is shown, then it has a violet frame with the heading "Nebenwirkungen" (Side effects), and each side effect shows the frequency the leaflet states ("Häufig", "Gelegentlich" …) as a text badge with 1–4 bars.
- **AC-1.6.4:** Given these highlights, when I compare them with the leaflet, then only existing leaflet text is highlighted. Nothing is added or reworded.

---

## UC2 – Daughter helps her dad who lost the paper leaflet

*Daughter visits dad, who misplaced the paper leaflet for his current medicine. She helps to find the right and up-to-date digital leaflet based on the product name on the blister, prints it for him, and gives him the hint for a read-out service.*

### US-2.1: Open the service without installing anything

As a daughter, I want to open the leaflet service without any installation, so that I can help right away.

- **AC-2.1.1:** Given I open the web address in a phone browser, when the page loads, then I can use all features without installing an app or creating an account.

### US-2.2: Identify the medicine from the blister

As a daughter, I want to identify medications from the blister, so that I can get the leaflet.

- **AC-2.2.1:** Given I choose "Foto vom Blister" (Photo of the blister) and take a photo of the Thyrovita blister, when the text is recognised, then I see the recognised text (e.g. "THYROVITA 50 µg") and Thyrovita 50 µg as a matching medicine.
- **AC-2.2.2:** Given the photo shows no known product name, when recognition finishes, then I see "Kein passendes Arzneimittel erkannt" (No matching medicine recognised) and can take a new photo or type the name.
- **AC-2.2.3:** Given matching medicines are shown, when I want to continue, then I have to tap the one that matches the blister. The app never opens one automatically.

### US-2.3: Confirm the exact medicine

As a daughter, I want to confirm the exact medication, so that I know it is the right leaflet.

- **AC-2.3.1:** Given I tapped Thyrovita, when the page opens, then I am asked "Ist das Ihr Arzneimittel?" (Is this your medicine?) with the pack picture, name, strength, manufacturer and PZN.

### US-2.4: Check that the leaflet is up to date

As a daughter, I want to see the version of the leaflet, so that I do not give my dad an outdated one.

- **AC-2.4.1:** Given I confirmed Thyrovita, when the product page opens, then I see "Version 2.3", "Zuletzt überarbeitet: 18. Mai 2026" (Last revised) and "Aktuelle Version" (Current version).
- **AC-2.4.2:** Given a medicine also has an older leaflet (Cardiovex), when I open the older version, then a dashed warning says it is no longer current.

### US-2.5: Print the leaflet

As a daughter, I want to print the leaflet, so that he has a copy to read without a phone.

- **AC-2.5.1:** Given I press "Drucken" (Print), when the preview opens, then it shows the full leaflet with version, last revised date, print date and a QR code. I have to press "Jetzt drucken" (Print now) myself.
- **AC-2.5.2:** Given the leaflet is printed, when the page comes out of the printer, then the app's header, banner and buttons are not on it.

### US-2.6: Read-aloud option for dad

As a daughter, I want my dad to have a read-aloud option, so that he can use it without me.

- **AC-2.6.1:** Given the printed QR code is scanned with the LeafletCheck scanner, when it is recognised, then the read-aloud page of that medicine opens.
- **AC-2.6.2:** Given I choose a speed ("Langsam", "Normal", "Schnell" – Slow, Normal, Fast), when I come back later on the same device, then the same speed is selected.

### US-2.7: Older patient listens on his own

As an older patient, I want the leaflet to be read aloud, so that I can check the leaflet on my own.

- **AC-2.7.1:** Given I am on the read-aloud page, when I press the big "Vorlesen starten" (Start reading) button, then the leaflet is read aloud and the sentence being read is highlighted in the text below.
- **AC-2.7.2:** Given it is reading, when I press "Satz zurück" (Previous sentence), "Pause" or "Satz vor" (Next sentence), then reading goes back one sentence, pauses or skips ahead.
- **AC-2.7.3:** Given I find the text too small, when I open "Text & Kontrast" (Text & contrast) and choose "Am größten" (Largest), "Hoch, dunkel" (High, dark) or "Weit" (Wide line spacing), then the whole app changes, the leaflet wording stays the same, and the setting is saved on this device.

---

## UC3 – The capsule has a new colour

*Patient with a chronic disease got the same medicine as usual. While unpacking a capsule she notices that it is green now but was red so far. She wants to see the current changes in the digital leaflet compared to the old one.*

### US-3.1: See the previous version and what changed

As a patient, I want to access the previous version of the leaflet and be told about the changed parts, so that I am up to date.

- **AC-3.1.1:** Given I confirmed Cardiovex 50 mg, when the product page opens, then a highlighted box "Neue Version der Packungsbeilage" (New version of the leaflet) says there are 8 changes since the version of 4 March 2025 and offers "Änderungen ansehen" (See changes). The changes come first.
- **AC-3.1.2:** Given I open the leaflet, when I switch between "Aktuelle (v4.0)" (Current) and "Vorherige (v3.1)" (Previous), then the full text of the chosen version is shown with its date.

### US-3.2: Compare the versions to identify the changes

As a patient, I want to compare the versions of my leaflet to identify the changes, so that I can quickly find out what is different.

- **AC-3.2.1:** Given I press "Änderungen ansehen" (See changes), when the comparison opens, then I see "8 Änderungen in 5 Abschnitten gefunden" (8 changes found in 5 sections) with Geändert 5 (Changed), Neu 2 (Added), Entfernt 1 (Removed), grouped by section.
- **AC-3.2.2:** Given the comparison is shown, when I look at a change, then it has a text label, an icon (+ / pencil / −) and its own border style (solid / double / dashed). The meaning never depends on colour alone.
- **AC-3.2.3:** Given I open a change, when the dialog appears, then I see the previous and current text with dates, the changed words highlighted (underlined / struck through), a plain-language explanation, and links to the paragraph in both original leaflets.
- **AC-3.2.4:** Given the comparison is open, when I press "Alle Änderungen vorlesen" (Read all changes aloud) or "Änderung vorlesen" (Read change aloud) in a dialog, then the changes are read aloud.

### US-3.4: See the changes in colour directly in the leaflet

As a patient, I want the updated parts to be coloured and labelled directly in the leaflet text, so that I notice what is new while I read.

- **AC-3.4.1:** Given I open the current Cardiovex 50 mg leaflet, when the page loads, then a legend explains the colours and signs and says "8 Änderungen seit Version 3.1 vom 4. März 2025" (8 changes since version 3.1 of 4 March 2025).
- **AC-3.4.2:** Given the legend is shown, when I look at the chapter list and chapter headings, then each chapter with changes shows how many it has (e.g. "2 Änderungen" – 2 changes).
- **AC-3.4.3:** Given a paragraph is new or changed, when I read it, then it has a coloured background with the "Neu" (Added, blue, solid border) or "Geändert" (Changed, amber, double border) label. A changed paragraph also shows "So hat sich dieser Absatz geändert" (How this paragraph changed), with new words underlined and removed words struck through.
- **AC-3.4.4:** Given a paragraph was removed in the new version, when I read its chapter, then the removed text is shown struck through, with the "Entfernt" (Removed) label and a dashed rose border, where it used to be.
- **AC-3.4.5:** Given I switch off "Änderungen farbig hervorheben" (Highlight changes in colour), when the page updates, then the leaflet is shown without change colours, labels or removed text.

### US-3.3: See what the leaflet says about the new look and ask the pharmacy

As a patient, I want to see what the leaflet says about the new look and ask the pharmacy in one click, so that I know whether I need to keep taking it or get new medication.

- **AC-3.3.1:** Given I ask "Warum ist meine Kapsel grün?" (Why is my capsule green?), when the answer appears, then it quotes "Cardiovex 50 mg sind grüne, undurchsichtige Hartkapseln …" from section 6, notes "Diese Stelle wurde in Version 4.0 geändert" (This passage was changed in version 4.0), and links to the change.
- **AC-3.3.2:** Given the leaflet does not give a reason for the colour change, when the answer is shown, then the app does not add a reason of its own.
- **AC-3.3.3:** Given I am on the product page, the comparison, a change dialog or a "not found" answer, when I need help, then "Apotheke anrufen" (Call pharmacy) is one tap away.

---

## Language and safety (all use cases)

### US-L.1: German first, English on request

As a patient, I want the app in German, with English as an option, so that I can read it in the language I understand best.

- **AC-L.1.1:** Given I open the app for the first time, when it loads, then everything is in German (interface, leaflet texts, explanations, dates).
- **AC-L.1.2:** Given the app is in German, when I press "English", then everything on the current page switches to English. The voice used for read-aloud switches too, and "Deutsch" switches back.
- **AC-L.1.3:** Given I chose English, when I reload, then the app is still in English.

### US-L.2: No invented medical advice

As a patient, I want the app to show only what the leaflet says, so that I am not misled.

- **AC-L.2.1:** Given any page, when it loads, then a banner says the data is fictional demo data and not medical information.
- **AC-L.2.2:** Given any answer, step card or explanation, when I read it, then it is quoted from the leaflet or describes only what the leaflet text says. It never recommends stopping, switching or changing a dose. This is checked by automated tests.

---

## Traceability

| Board item | Covered by |
| --- | --- |
| S1 scan barcode / type name, result list with name, manufacturer, pack photo; "not found"; ask back if several matches | US-S1.1, US-S1.2 |
| UC1: open by scanning, chapters at a glance + offline copy, read ↔ listen with highlighting, step cards + audio guide, quick answers with citation | US-1.1 – US-1.6 |
| UC2: no installation, blister photo → text recognition, confirm exact product, version/date, print with QR, read aloud with saved pace, big buttons | US-2.1 – US-2.7 |
| UC3: previous version, change detection, colour + labels (not colour only), section-wise comparison, answer from the leaflet + call pharmacy | US-3.1 – US-3.3, US-3.4 |
| Failure scenario "system fails to highlight relevant change in important information" | US-1.6, US-3.4 |
| Hard rule "answer only from the leaflet, cite the source; no source → ask the pharmacy" | US-1.5, US-3.3, US-L.2 |
