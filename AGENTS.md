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
8. **Personalisierung datensparsam halten.** Kundinnennamen nur aus Query-Parametern lesen und lokal speichern; niemals in Manifest, Cache-Namen, Build-Versionen oder Logs schreiben.
9. **Vor Abgabe pruefen.** Fuehre mindestens `npm run check` aus, sofern Node/Python verfuegbar sind.

## Typischer Arbeitsablauf

```bash
npm install
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
| Kundinnen-Personalisierung | `palette-app.js`, `i18n.js`, `templates/palette.html`, `styles.css` |
| Farbcheck, Kameralogik, Install-/Update-Button | `palette-app.js` |
| Service Worker / Cache / Update | `sw.js`, `palette-app.js`, `bin/generate` |
| Palettenwerte und Manifest-Erzeugung | `bin/generate` |
| Uebersichtsseite | `overview.js`, `index.html` |
| Validierungsregeln | `scripts/validate-source.mjs`, `scripts/validate-dist.mjs` |
| CI/Dependabot | `.github/workflows/ci.yml`, `.github/dependabot.yml` |

Siehe auch [`docs/CODE_MAP.md`](docs/CODE_MAP.md).

## Akzeptanzkriterien fuer typische Aufgaben

### UI-/CSS-Aenderung

- Portrait und Landscape pruefen.
- Bottom-Action-Bar darf keine abgeschnittenen Texte zeigen.
- Header darf im Landscape nicht zu hoch sein.
- `npm run format:check` und `npm run lint:css` muessen bestehen.

### Neue UI-Texte

- Text in `i18n.js` fuer `de`, `en`, `ru` ergaenzen.
- Fallback-Verhalten pruefen.
- Keine fest verdrahteten deutschen UI-Texte in `palette-app.js`, wenn sie sichtbar sind.

### Neue Farb-/Stiltexte

- Kundinnenorientiert schreiben.
- Keine Nummern oder internen Klassifikationen nennen.
- Farbnamen innerhalb einer Farbkarte moeglichst differenzieren.
- Kombinationstipps praktisch halten: neutrale Basis, Akzent, Materialwirkung.

### PWA-/Service-Worker-Aenderung

- Nicht nur `sw.js` aendern; auch den Update-Pfad in `palette-app.js` verstehen.
- Nach Build pruefen, dass `version.json` und `sw.js` dieselbe Version enthalten.
- Kein hartes Update ausloesen, solange Kundinnen mitten in einer Interaktion sein koennten, ausser der Update-Button wurde geklickt.


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

