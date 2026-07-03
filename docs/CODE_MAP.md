# Code Map

Diese Datei hilft Menschen und KI-Agenten, Aenderungen schnell an der richtigen Stelle vorzunehmen.

## Kern-Dateien

### `bin/generate`

Python-Generator. Erzeugt den kompletten Dist-Build. Wichtige Verantwortungen:

- Paletten-Rohdaten
- `palettes.js` schreiben
- Manifest-Dateien pro Palette schreiben
- Icons/Assets kopieren
- Build-Version erzeugen
- Template-Platzhalter ersetzen

Achtung: Bei Palettenwerten ist `bin/generate` die Quelle. `palettes.js` muss konsistent bleiben und wird durch den Build neu erzeugt.

### `palette-app.js`

Interaktive Logik einer einzelnen Farbkarte:

- aktive Palette anhand des Slugs finden
- Farbfelder rendern
- Vollbild-Farbansicht mit Farbnamen und Stilwissen
- Kamerabild laden und mittlere Farbe pruefen
- kundinnentaugliche Farbpassung anzeigen
- Installationsprompt anzeigen, wenn verfuegbar
- Update-Button anzeigen, wenn neue Version erkannt wird

### `i18n.js`

Alle sichtbaren Texte in Deutsch, Englisch und Russisch. Neue sichtbare Texte sollten hier gepflegt werden, nicht direkt in JS/HTML.

### `styles.css`

Gesamtes visuelles System:

- ESKYNA Branding
- Header
- Farbgrid
- Bottom-Action-Bar
- Splashscreen
- Vollbild-Farbkarte
- Resultatkarte
- Portrait-/Landscape-Regeln

### `sw.js`

Service Worker:

- App Shell cachen
- Network-first fuer updatekritische Dateien
- Cache-first fuer stabile Assets
- `SKIP_WAITING` fuer explizites Update

## Validierung

| Datei | Prueft |
| --- | --- |
| `scripts/validate-source.mjs` | Quellstruktur, 24 Paletten, 24 Farben je Palette, Pflichtassets, i18n-Basics |
| `scripts/validate-dist.mjs` | erzeugten Build, Manifest-Dateien, Icons, Version, Platzhalterfreiheit |

## Aenderungsmuster

### Einen Buttontext aendern

1. Key in `i18n.js` fuer `de`, `en`, `ru` aendern.
2. Pruefen, ob `palette-app.js` den Key verwendet.
3. `npm run check`.

### Eine neue Farbe erklaeren

1. Pruefen, ob ein bestehender `colorStories`-Key passt.
2. Falls nicht, Klassifikation in `palette-app.js` erweitern.
3. Texte in `i18n.js` fuer alle Sprachen ergaenzen.
4. Keine Feldnummern oder internen Keys in der UI zeigen.

### Layout im Landscape-Modus aendern

1. `@media (orientation: landscape)` in `styles.css` suchen.
2. Header, Grid und Bottom-Bar zusammen betrachten.
3. Auf kleinen Hoehen testen, besonders `max-height: 430px`.
4. `npm run lint:css` und Sichtpruefung.

