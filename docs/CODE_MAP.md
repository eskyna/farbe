# Code Map

Diese Datei hilft Menschen und KI-Agenten, Aenderungen schnell an der richtigen Stelle vorzunehmen.

## Kern-Dateien

### `bin/generate`

Python-Generator. Erzeugt den kompletten Dist-Build. Wichtige Verantwortungen:

- Paletten-Rohdaten
- `palettes.js` schreiben
- Manifest-Dateien pro Palette schreiben
- das zentrale App-Icon aus `assets/app-icon.png` als gemeinsame Manifest-Icons erzeugen
- weitere Icons/Assets kopieren
- Build-Version erzeugen
- Template-Platzhalter ersetzen

Achtung: Bei Palettenwerten ist `bin/generate` die Quelle. `palettes.js` muss konsistent bleiben und wird durch den Build neu erzeugt.

### `palette-app.js`

Interaktive Logik einer einzelnen Farbkarte:

- aktive Palette anhand des Slugs finden
- Farbfelder rendern
- Vollbild-Farbansicht als detaillierte Farbglossarseite mit Farbnamen, Stilwissen, Profil, Material und Shopping-Hilfe
- Live-Scanner oeffnen oder Bildfallback ausloesen
- Lichtqualitaet bewerten: Tageslicht, Dunkelheit, Gelbstich, Schatten
- mehrere Messpunkte im Zielkreis robust mitteln
- wahrnehmungsnah mit Lab/CIEDE2000 die naechsten Farbpass-Toene finden
- kundinnentaugliche Farbpassung mit Prozent, Helligkeit, Waerme, Klarheit und Unsicherheitsnotiz anzeigen
- Kundinnenname aus personalisierten Links lesen, speichern und anzeigen
- Android-Installationsprompt anzeigen, wenn verfuegbar, und auf iPhone/iPad eine manuelle Safari-Anleitung anzeigen
- Update-Button anzeigen, wenn neue Version erkannt wird

### `i18n.js`

Alle sichtbaren Texte in Deutsch, Englisch und Russisch. Neue sichtbare Texte sollten hier gepflegt werden, nicht direkt in JS/HTML. Dazu zaehlen auch die Farbglossar-Texte unter `glossary` und die Basisgeschichten unter `colorStories`.

### `styles.css`

Gesamtes visuelles System:

- ESKYNA Branding
- Header
- Farbgrid
- Bottom-Action-Bar
- Splashscreen inklusive Versionszeile
- Vollbild-Farbkarte
- Resultatkarte
- Portrait-/Landscape-Regeln

### `sw.js`

Service Worker:

- App Shell cachen
- Network-first fuer updatekritische Dateien
- Cache-first fuer stabile Assets
- `SKIP_WAITING` fuer explizites Update

## Behave/Cucumber

`features/*.feature` enthaelt die executable Requirements. `features/steps/requirements_steps.py` prueft diese Anforderungen gegen Quellen und `dist/`. Die Tests sind bewusst offline und statisch gehalten, damit KI-Agenten sie zuverlaessig ausfuehren und erweitern koennen.

## Validierung

| Datei | Prueft |
| --- | --- |
| `scripts/validate-source.mjs` | Quellstruktur, 24 Paletten, 24 Farben je Palette, Pflichtassets inklusive App-Icon, i18n-Basics, Personalisierungs-Hooks |
| `scripts/validate-dist.mjs` | erzeugten Build, Manifest-Dateien, zentrales Manifest-App-Icon, Version, Platzhalterfreiheit, Personalisierungsplatz im HTML |
| `features/*.feature` | fachliche Akzeptanzkriterien im Behave/Cucumber-Format |
| `features/steps/requirements_steps.py` | automatisierte Step Definitions fuer Requirements, i18n, Layout, PWA und Farbcontent |
| `features/support/inspect-app.mjs` | browsernahes Harness fuer i18n und Farbgeschichten ohne echten Browser |

## Aenderungsmuster


### Eine neue Anforderung absichern

1. Passendes Feature unter `features/` suchen oder neues Szenario schreiben.
2. Step Definition in `features/steps/requirements_steps.py` ergaenzen.
3. Wenn echte Frontend-Logik ausgewertet werden muss, ein kleines Harness unter `features/support/` verwenden.
4. `npm run test:bdd` und danach `npm run check` ausfuehren.


### Den Farbe-pruefen-Flow aendern

1. UI-Markup fuer Scanner in `templates/palette.html` pruefen.
2. Scan-Logik in `palette-app.js` anpassen: `initializeScanFlow`, `sampleGarmentColor`, `assessLightQuality`, `findNearestColors` und `getPaletteFit`.
3. Sichtbare Texte in `i18n.js` fuer `de`, `en`, `ru` pflegen.
4. Resultat- und Scanner-Stile in `styles.css` pruefen.
5. BDD-Szenarien in `features/requirements_color_guidance.feature` und Steps aktualisieren.
6. `npm run build && npm run validate:dist` sowie Behave ausfuehren, wenn verfuegbar.


### Das App-Icon aendern

1. Neue Masterdatei als `assets/app-icon.png` ablegen.
2. Darauf achten, dass Kleeblatt, `ESKYNA Farbe` und Farbfächer innerhalb der sicheren Icon-Mitte liegen; der Generator erstellt daraus separate `any`- und `maskable`-Icons.
3. `bin/generate` nicht umgehen: Der Build erzeugt `icons/icon-192.png`, `icons/icon-512.png`, `icons/icon-maskable-192.png`, `icons/icon-maskable-512.png`, `icons/apple-touch-icon.png` und Legacy-Icon-Pfade aus dieser Masterdatei; alle Paletten-Manifeste verweisen auf die zentralen Dateien.
4. `npm run build && npm run validate:dist` ausfuehren.
5. Wegen PWA-Icon-Caching den kompletten Dist-Ordner deployen und auf Testgeraeten ggf. die PWA neu installieren.

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
4. Passende Szenarien in `features/requirements_responsive_layout.feature` ergaenzen oder pruefen.
5. `npm run lint:css`, `npm run test:bdd` und Sichtpruefung.


### Personalisierte Kundinnen-Links aendern

1. Query-Parameter und Speicherung in `palette-app.js` pruefen (`CUSTOMER_NAME_QUERY_KEYS`).
2. Sichtbare Texte in `i18n.js` fuer `de`, `en`, `ru` pflegen.
3. Header-Markup in `templates/palette.html` und CSS-Regeln fuer `.customer-title` beachten.
4. Keine Namen in Manifest, Cache-Schluessel oder Build-Dateien schreiben.
5. Mit `/farbe/light_warm_clear/?name=Melissa`, Landscape und installierter PWA testen.


## Farbglossar

Die Informationsarchitektur fuer Glossarseiten steht in [`COLOR_GLOSSARY.md`](COLOR_GLOSSARY.md). Die technische Einstiegstelle ist `getColorGlossary()` in `palette-app.js`; die Gestaltung erfolgt ueber `.color-glossary-card` und `.color-glossary-profile-grid` in `styles.css`.
