# ESKYNA Farbe

Statische PWA-Farbkarten fuer Kundinnen von ESKYNA. Das Projekt erzeugt eine Uebersichtsseite mit 24 Farbkarten und pro Farbkarte eine eigene installierbare PWA unter `https://eskyna.com/farbe/<palette>/`.

Der Code ist bewusst als kleines, agentenfreundliches Projekt aufgebaut: Die fachlichen Daten liegen zentral, der Generator erzeugt daraus die auslieferbaren Dateien, und CI prueft Format, Linting, Build, Dist-Integritaet und Behave/Cucumber-Requirements.

## Schnellstart

Voraussetzungen:

- Node.js 22 oder neuer
- npm 10 oder neuer
- Python 3.13 oder neuer

```bash
npm install
python3 -m pip install -r requirements-dev.txt
npm run check
npm run serve
```

Danach lokal oeffnen:

```text
http://localhost:8080/
```

## Wichtige Befehle

| Befehl | Zweck |
| --- | --- |
| `npm run generate` | erzeugt `dist/` aus den Quellen |
| `npm run build` | loescht `dist/` und generiert neu |
| `npm run format` | normalisiert Zeilenenden, finalen Zeilenumbruch und entfernt Trailing Whitespace |
| `npm run format:check` | prueft Formatierung ohne Aenderungen |
| `npm run lint` | prueft JS-, CSS-, HTML- und Python-Syntax mit projektinternen Checks |
| `npm run validate` | prueft Quellstruktur, Paletten, Pflichtdateien, i18n und BDD-Struktur |
| `npm run validate:dist` | prueft einen generierten Dist-Build |
| `npm run test:bdd` | fuehrt Behave/Cucumber-Requirements gegen den Build aus |
| `npm run test:bdd:build` | baut `dist/` neu und fuehrt danach Behave aus |
| `npm run test:bdd:pretty` | fuehrt Behave mit lesbarer Szenarioausgabe aus |
| `npm run check` | vollstaendige lokale Qualitaetspruefung inklusive BDD wie in CI |
| `npm run serve` | startet lokalen statischen Server fuer `dist/` |
| `npm run format:prettier` | optionaler Vollformat-Lauf mit Prettier nach `npm install` |
| `npm run lint:eslint` / `lint:stylelint` / `lint:htmlhint` | optionale Standard-Lints nach `npm install` |

## Projektstruktur

```text
.
├── bin/generate                 # Python-Generator fuer alle statischen Dateien
├── assets/                      # Markenlogo, App-Hintergrund, Splashscreens
├── icons/                       # Quell-Icons je Farbkarte
├── images/                      # Referenzbilder je Farbkarte
├── templates/                   # HTML-/README-Templates fuer den Dist-Build
├── index.html                   # Uebersicht im Quellprojekt
├── palettes.js                  # zentrale Palette-Daten fuer das Frontend
├── i18n.js                      # Deutsch, Englisch, Russisch
├── palette-app.js               # PWA-Logik je Farbkarte
├── overview.js                  # Logik der Uebersichtsseite
├── styles.css                   # komplettes UI-Styling
├── sw.js                        # Service Worker fuer Offline/Update
├── scripts/                     # Validierungs-Skripte fuer CI und Agenten
├── features/                    # Behave/Cucumber-Requirements, Steps und Harness
├── docs/                        # Architektur, Wartung, QA, Release-Prozess
└── .github/                     # CI, Pages, Dependabot, Pull-Request-Vorlagen
```

`dist/` ist generiert und wird nicht versioniert. Fuer ein Deployment wird der Inhalt von `dist/` nach `/farbe/` auf dem Webserver hochgeladen.

## Deployment

```bash
npm install
python3 -m pip install -r requirements-dev.txt
npm run check
```

Dann den Inhalt von `dist/` so deployen, dass diese URLs funktionieren:

```text
https://eskyna.com/farbe/
https://eskyna.com/farbe/light_warm_soft/
```

Wichtig fuer PWA-Updates: Immer den kompletten Dist-Inhalt austauschen, besonders `sw.js`, `version.json`, `palette-app.js`, `i18n.js`, `palettes.js`, `styles.css` und alle geaenderten Assets. Browser koennen Service Worker aggressiv cachen; `version.json` und die Build-Version helfen der App, neue Versionen zu erkennen.


## Farbe pruefen: Premium-Scan-Flow

Der zentrale Kundinnen-Flow startet ueber **Farbe pruefen**. Auf Geraeten mit Kamera oeffnet die App einen Live-Scanner mit Zielkreis. Der Scanner kann jederzeit ueber den Schliessen-Button, `Zur Farbkarte zurueck`, Escape oder einen Tipp auf den dunklen Hintergrund verlassen werden. Nach einer Messung kann auch das Ergebnis ueber `Zur Farbkarte zurueck` oder das kleine Schliessen-Symbol ausgeblendet werden, sodass die normale Palettenansicht wieder frei ist. Wenn die Kamera nicht verfuegbar ist, faellt die App auf die Bildauswahl zurueck. Die Messung nutzt mehrere Punkte innerhalb des Kreises, bewertet die Lichtqualitaet und vergleicht wahrnehmungsnah in Lab/CIEDE2000 statt mit naiver Hex-Distanz.

Das Ergebnis zeigt bewusst kundinnenfreundlich:

- Lichtqualitaet wie Tageslicht gut, zu dunkel, zu gelb oder Schatten erkannt
- eine ehrliche Passung in Prozent statt Ja/Nein
- Helligkeit, Waerme und Klarheit als leicht verstaendliche Dimensionen
- konkrete Styling-Empfehlung bei Grenzfaellen, zum Beispiel klarer, frischer, heller oder weniger warm
- die drei naechsten Farben aus dem eigenen Farbpass

Bei schlechten Bedingungen zeigt die App lieber `Unsicher` und empfiehlt eine neue Messung bei neutralem Tageslicht. Das ist absichtlich so, weil Kamera, Licht und Stoffstruktur die Farbwahrnehmung beeinflussen.

## Farbglossar: Farbe als Stilwissen

Jedes Farbfeld oeffnet eine detaillierte Glossarseite. Die Seite zeigt Kundinnen, dass in einem Farbton mehr steckt als ein Name: Temperatur, Helligkeit, Klarheit, Rolle im Farbpass, Materialwirkung, Modewissen, Outfit-Rezept, Shopping-Feintuning und ein kompaktes Farbprofil.

Die Glossarseiten werden dynamisch fuer alle 576 Farben erzeugt. Sichtbare Texte liegen mehrsprachig in `i18n.js`; die Logik fuer Profil, Rolle, Material und Shopping-Hinweise liegt in `palette-app.js` unter `getColorGlossary()`. Details zur Informationsarchitektur stehen in [`docs/COLOR_GLOSSARY.md`](docs/COLOR_GLOSSARY.md).

## Personalisierte Kundinnen-Links

Eine Farbkarte kann mit Kundinnenname geoeffnet werden:

```text
https://eskyna.com/farbe/light_warm_clear/?name=Melissa
```

Alternativ werden auch `?kundin=Melissa`, `?customer=Melissa` und `?client=Melissa` akzeptiert. Die App zeigt dann im Header zum Beispiel `ESKYNA Farbe fuer Melissa` und speichert den Namen lokal fuer diese Farbkarte. Wenn die Kundin die PWA von diesem Link aus installiert, bleibt der Name innerhalb der installierten App sichtbar, auch wenn Android/Chrome die PWA spaeter ueber die normale `start_url` ohne Query-Parameter startet.

Datenschutz: Keine Kundinnennamen in `manifest.webmanifest`, `version.json`, Service-Worker-Caches oder statische Build-Dateien schreiben. Die Personalisierung ist nur clientseitig ueber URL-Parameter plus `localStorage` umgesetzt. Je nach Browser kann der Name der App auf dem Homescreen weiter generisch bleiben; in der App selbst ist der Kundinnenname sichtbar.

## Inhalte bearbeiten

- **Farben und Paletten:** `bin/generate` enthaelt die Rohdaten, `palettes.js` wird im Build daraus erzeugt.
- **Texte und Uebersetzungen:** `i18n.js` pflegt Deutsch, Englisch und Russisch zentral.
- **Farbnamen, Farberklaerungen und Glossarseiten:** `palette-app.js` enthaelt Nuancierung, Farbprofil und Glossar-Logik; `i18n.js` enthaelt die sichtbaren Texte.
- **Layout und Branding:** `styles.css`, `assets/` und `templates/palette.html`.
- **Personalisierte Kundinnen-Links:** `palette-app.js`, `i18n.js`, `templates/palette.html` und die Hinweise in `docs/MAINTENANCE.md`.
- **PWA-Update-Logik:** `palette-app.js`, `sw.js`, `version.json` im Dist.
- **Executable Requirements:** `features/requirements_*.feature`, `features/steps/requirements_steps.py` und `features/support/inspect-app.mjs`.

Nach jeder inhaltlichen Aenderung:

```bash
npm run check
```

## Behave/Cucumber-Requirements

Die fachlichen Anforderungen aus der Entwicklung sind als Gherkin-Szenarien unter `features/requirements_*.feature` dokumentiert und automatisiert pruefbar. Sie testen unter anderem:

- 24 Farbkarten mit je 24 Farben
- Portrait-Raster 4 x 6 und Landscape-Raster 6 x 4
- einzeiligen Landscape-Header und lesbare Aktionsleiste
- ESKYNA Branding, Splashscreens inklusive Versionszeile, Hintergrundbild und klickbares Kleeblatt
- Deutsch, Englisch und Russisch inklusive Palettennamen
- Farbnamen, Farberklaerungen, detaillierte Glossarseiten und keine doppelten Farbnamen innerhalb einer Karte
- Premium-Scan-Flow mit Live-Kamera, Lichtqualitaet, mehreren Messpunkten, Prozentpassung und drei naechsten Farbpass-Toenen
- kundinnentaugliche Farbpruefungs-Ergebnisse ohne technische Abstandswerte
- PWA-Installations- und Update-Logik
- personalisierte Kundinnen-Links ohne personenbezogene Daten in Manifesten
- CI, Dependabot und Agenten-Dokumentation

Ausfuehren:

```bash
python3 -m pip install -r requirements-dev.txt
npm run build
npm run test:bdd
```

Fuer eine gut lesbare Szenarioausgabe:

```bash
npm run test:bdd:pretty
```

`npm test` baut den Dist-Ordner automatisch neu und startet danach Behave. `npm run check` fuehrt die BDD-Tests automatisch nach Build und Dist-Validierung aus. Wenn eine neue Produktanforderung hinzukommt, soll mindestens ein bestehendes Szenario angepasst oder ein neues Szenario ergaenzt werden.

## Dokumentation fuer Menschen und KI-Agenten

Startpunkte:

- [`AGENTS.md`](AGENTS.md) - verbindliche Arbeitsanweisung fuer KI-Agenten
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) - technische Architektur
- [`docs/CODE_MAP.md`](docs/CODE_MAP.md) - wo welche Aenderung gemacht wird
- [`docs/MAINTENANCE.md`](docs/MAINTENANCE.md) - Wartung von Farben, Texten und Assets
- [`docs/COLOR_GLOSSARY.md`](docs/COLOR_GLOSSARY.md) - Aufbau und Wartung der Farbglossarseiten
- [`docs/QUALITY_AND_CI.md`](docs/QUALITY_AND_CI.md) - Linting, Formatierung, Behave/Cucumber, CI und Dependabot
- [`docs/RELEASE_CHECKLIST.md`](docs/RELEASE_CHECKLIST.md) - Checkliste vor Deployment

## CI und Dependabot

Die GitHub Actions pruefen bei Pushes und Pull Requests:

1. Formatierung
2. Linting
3. Source-Validierung
4. Build
5. Dist-Validierung
6. Behave/Cucumber-Requirements
7. Upload des generierten `dist/` als CI-Artefakt

Dependabot ist fuer npm-Abhaengigkeiten, Python-Dev-Abhaengigkeiten und GitHub Actions konfiguriert.

## Beitragen

Bitte zuerst [`CONTRIBUTING.md`](CONTRIBUTING.md) lesen und vor einem Pull Request lokal `npm run check` ausfuehren.

