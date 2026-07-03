# AGENTS.md - Arbeitsanweisung fuer KI-Agenten

Dieses Projekt soll auch von KI-Agenten sicher wartbar sein. Diese Datei ist der wichtigste Einstiegspunkt fuer automatisierte Aenderungen.

## Grundregeln

1. **Nicht blind in `dist/` arbeiten.** `dist/` ist generiert. Aendere Quellen und fuehre danach `npm run build` aus.
2. **Aenderungen klein halten.** Beruehre nur Dateien, die fuer die Aufgabe noetig sind.
3. **Branding respektieren.** ESKYNA nutzt Montserrat, warme Creme-/Goldtoene, das Kleeblatt aus `assets/sign_gold.png` und eine elegante, ruhige Bildsprache.
4. **Drei Sprachen mitdenken.** Nutzerinnen sehen Deutsch, Englisch oder Russisch je nach Browser-/Handysprache. Neue UI-Texte gehoeren in `i18n.js`.
5. **PWA-Update beachten.** Runtime-Aenderungen muessen nach dem Build eine neue Version in `version.json` und `sw.js` erzeugen.
6. **Keine Feldnummern in der UI.** Farben werden ueber Namen und Stilwissen erklaert, nicht ueber Feldnummern.
7. **Kundinnensprache statt Technik.** Beim Farbcheck keine technischen Delta-E-Werte anzeigen. Verwende klare, freundliche Styling-Einschaetzungen.
8. **Farbe pruefen ehrlich halten.** Live-Scanner, mehrere Messpunkte, Lichtqualitaet, Prozentpassung, Helligkeit/Waerme/Klarheit und drei naechste Farbpass-Toene sind Kernanforderungen. Bei schlechtem Licht lieber `Unsicher` anzeigen.
9. **Personalisierung datensparsam halten.** Kundinnennamen nur aus Query-Parametern lesen und lokal speichern; niemals in Manifest, Cache-Namen, Build-Versionen oder Logs schreiben.
10. **Requirements als Tests pflegen.** Neue Produktregeln gehoeren in `features/*.feature` und passende Steps in `features/steps/`.
11. **Vor Abgabe pruefen.** Fuehre mindestens `npm run check` aus, sofern Node/Python/verfuegbare Dev-Abhaengigkeiten vorhanden sind.

## Typischer Arbeitsablauf

```bash
npm install
python3 -m pip install -r requirements-dev.txt
npm run check
```

Aendern:

```bash
npm run format
npm run check
```

Lokale Sichtpruefung:

```bash
npm run serve
```

## Wo aendere ich was?

| Aufgabe | Datei(en) |
| --- | --- |
| Layout, Buttons, Header, Landscape/Portrait | `styles.css`, `templates/palette.html`, `index.html` |
| UI-Texte und Uebersetzungen | `i18n.js` |
| Farbglossar und Stilwissen | `palette-app.js`, `i18n.js`, `styles.css`, `docs/COLOR_GLOSSARY.md` |
| Kundinnen-Personalisierung | `palette-app.js`, `i18n.js`, `templates/palette.html`, `styles.css` |
| Farbcheck, Live-Scanner, Kameralogik, Lichtqualitaet, Install-/Update-Button | `palette-app.js`, `i18n.js`, `styles.css`, `templates/palette.html` |
| Service Worker / Cache / Update | `sw.js`, `palette-app.js`, `bin/generate` |
| Palettenwerte und Manifest-Erzeugung | `bin/generate` |
| Uebersichtsseite | `overview.js`, `index.html` |
| Validierungsregeln | `scripts/validate-source.mjs`, `scripts/validate-dist.mjs` |
| BDD-/Requirement-Tests | `features/*.feature`, `features/steps/requirements_steps.py`, `features/support/inspect-app.mjs` |
| CI/Dependabot | `.github/workflows/ci.yml`, `.github/dependabot.yml` |

Siehe auch [`docs/CODE_MAP.md`](docs/CODE_MAP.md).

## Behave/Cucumber-Regeln

- Features beschreiben Kundinnen- und Produktverhalten, nicht nur Implementierungsdetails.
- Schrittdefinitionen sollen deterministisch, offline und ohne Browser laufen.
- Tests duerfen `dist/` lesen, aber nicht stillschweigend deployen oder externe Dienste aufrufen.
- Anforderungen aus diesem Projektverlauf sind bewusst in `features/` abgebildet: Layout, Branding, PWA-Update, Personalisierung, Sprachen, Farbnamen, Farberklaerungen und Farbglossare.
- Wenn eine Anforderung absichtlich geaendert wird, Feature und Dokumentation im selben PR aktualisieren.

## Akzeptanzkriterien fuer typische Aufgaben


### Requirement- oder Produktlogik-Aenderung

- Pruefe zuerst, ob ein passendes Szenario unter `features/` existiert.
- Passe das Szenario an oder ergaenze ein neues Gherkin-Szenario, bevor du die Implementierung als fertig betrachtest.
- Step Definitions gehoeren in `features/steps/requirements_steps.py`; kleine Harness-Skripte fuer statische JS-Auswertung gehoeren in `features/support/`.
- Behave-Tests sollen Kundinnenanforderungen beschreiben, nicht nur Dateinamen pruefen.
- Danach `npm run test:bdd` oder vollstaendig `npm run check` ausfuehren.

### UI-/CSS-Aenderung

- Portrait und Landscape pruefen.
- Bottom-Action-Bar darf keine abgeschnittenen Texte zeigen.
- Header darf im Landscape nicht zu hoch sein.
- `npm run format:check`, `npm run lint:css` und passende Behave-Szenarien muessen bestehen.


### Farbe-pruefen-Scan-Flow

- Der Button `Farbe pruefen` oeffnet nach Moeglichkeit den Live-Scanner mit Zielkreis; sonst wird die Bildauswahl genutzt.
- Die Messung darf nicht auf einem einzelnen Pixel basieren. `SCAN_POINT_LAYOUT`, Kreis-Sampling und robuste Mittelung muessen erhalten bleiben.
- Das Ergebnis zeigt Prozent, Lichtqualitaet, Helligkeit, Waerme, Klarheit, ehrliche Confidence-Hinweise und drei naechste Farbpass-Toene.
- Bei Dunkelheit, Gelbstich, Schatten oder unstabiler Messung lieber unsicher formulieren und erneute Messung empfehlen.
- Der Live-Scanner und das Scan-Ergebnis muessen jederzeit sichtbar schliessbar bleiben; nach dem Schliessen muessen Kamera-Streams stoppen und Vorschau/Resultat verschwinden.
- Neue sichtbare Scan-Texte immer in Deutsch, Englisch und Russisch pflegen.

### Neue UI-Texte

- Text in `i18n.js` fuer `de`, `en`, `ru` ergaenzen.
- Fallback-Verhalten pruefen.
- Keine fest verdrahteten deutschen UI-Texte in `palette-app.js`, wenn sie sichtbar sind.

### Neue Farb-/Stiltexte und Glossarseiten

- Kundinnenorientiert schreiben.
- Keine Nummern oder internen Klassifikationen nennen.
- Farbnamen innerhalb einer Farbkarte moeglichst differenzieren.
- Kombinationstipps praktisch halten: neutrale Basis, Akzent, Materialwirkung.
- Glossarseiten muessen mehr Tiefe zeigen: Farbprofil, Rolle im Farbpass, Modewissen, Materialwirkung, Outfit-Rezept und Shopping-Feintuning.
- Neue Glossar-Texte fuer `de`, `en` und `ru` ergaenzen und `features/requirements_color_guidance.feature` aktuell halten.
- Details stehen in `docs/COLOR_GLOSSARY.md`.

### PWA-/Service-Worker-Aenderung

- Nicht nur `sw.js` aendern; auch den Update-Pfad in `palette-app.js` verstehen.
- Nach Build pruefen, dass `version.json` und `sw.js` dieselbe Version enthalten.
- Kein hartes Update ausloesen, solange Kundinnen mitten in einer Interaktion sein koennten, ausser der Update-Button wurde geklickt.

### Requirements-/BDD-Aenderung

- Akzeptanzkriterien in Gherkin unter `features/` beschreiben.
- Wiederverwendbare Steps in `features/steps/requirements_steps.py` pflegen.
- Browsernahe Auswertungen ohne echten Browser ueber `features/support/inspect-app.mjs` kapseln.
- `npm run build && npm run test:bdd` ausfuehren, wenn `behave` installiert ist.
- Keine Screenshots oder manuelle Annahmen als Ersatz fuer pruefbare Requirements verwenden.


### Personalisierte Kundinnen-Links

- Unterstuetzte Parameter sind `name`, `kundin`, `customer` und `client`.
- Der Name wird in `palette-app.js` bereinigt und pro Farbkarte in `localStorage` gespeichert.
- Sichtbare Formulierungen gehoeren in `i18n.js`, nicht hart in das HTML.
- Im Landscape-Header muessen Logo, Marke, Kundinnenname und Palettenname einzeilig bleiben; lange Namen duerfen gekuerzt werden.
- Keine personenbezogenen Daten in Manifest, Service Worker, Cache-Schluessel oder statische Build-Dateien schreiben.

## Dateien, die Agenten nicht erzeugen sollen

- Keine neuen grossen Binärdateien ohne klare Anforderung.
- Keine geheimen Dateien, Tokens oder Deploy-Keys.
- Keine lokalen Editor-Konfigurationen ausser `.editorconfig` oder bewusst projektweite Einstellungen.
- Keine Abhaengigkeiten ohne Eintrag in `package.json`, `requirements-dev.txt` und kurze Begruendung im Pull Request.

