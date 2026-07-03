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
- Kundinnenname aus personalisierten Links lesen, speichern und anzeigen
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

## Behave/Cucumber

`features/*.feature` enthaelt die executable Requirements. `features/steps/requirements_steps.py` prueft diese Anforderungen gegen Quellen und `dist/`. Die Tests sind bewusst offline und statisch gehalten, damit KI-Agenten sie zuverlaessig ausfuehren und erweitern koennen.

## Validierung

| Datei | Prueft |
| --- | --- |
| `scripts/validate-source.mjs` | Quellstruktur, 24 Paletten, 24 Farben je Palette, Pflichtassets, i18n-Basics, Personalisierungs-Hooks |
| `scripts/validate-dist.mjs` | erzeugten Build, Manifest-Dateien, Icons, Version, Platzhalterfreiheit, Personalisierungsplatz im HTML |
| `features/*.feature` | fachliche Akzeptanzkriterien im Behave/Cucumber-Format |
| `features/steps/requirements_steps.py` | automatisierte Step Definitions fuer Requirements, i18n, Layout, PWA und Farbcontent |
| `features/support/inspect-app.mjs` | browsernahes Harness fuer i18n und Farbgeschichten ohne echten Browser |

## Aenderungsmuster


### Eine neue Anforderung absichern

1. Passendes Feature unter `features/` suchen oder neues Szenario schreiben.
2. Step Definition in `features/steps/requirements_steps.py` ergaenzen.
3. Wenn echte Frontend-Logik ausgewertet werden muss, ein kleines Harness unter `features/support/` verwenden.
4. `npm run test:bdd` und danach `npm run check` ausfuehren.

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

