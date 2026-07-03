# ESKYNA Farbe

Statische PWA-Farbkarten fuer Kundinnen von ESKYNA. Das Projekt erzeugt eine Uebersichtsseite mit 24 Farbkarten und pro Farbkarte eine eigene installierbare PWA unter `https://eskyna.com/farbe/<palette>/`.

Der Code ist bewusst als kleines, agentenfreundliches Projekt aufgebaut: Die fachlichen Daten liegen zentral, der Generator erzeugt daraus die auslieferbaren Dateien, und CI prueft Format, Linting, Build und Dist-Integritaet.

## Schnellstart

Voraussetzungen:

- Node.js 22 oder neuer
- npm 10 oder neuer
- Python 3.13 oder neuer

```bash
npm install
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
| `npm run validate` | prueft Quellstruktur, Paletten, Pflichtdateien und i18n |
| `npm run validate:dist` | prueft einen generierten Dist-Build |
| `npm run check` | vollstaendige lokale Qualitaetspruefung wie in CI |
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
├── docs/                        # Architektur, Wartung, QA, Release-Prozess
└── .github/                     # CI, Dependabot, Pull-Request-Vorlagen
```

`dist/` ist generiert und wird nicht versioniert. Fuer ein Deployment wird der Inhalt von `dist/` nach `/farbe/` auf dem Webserver hochgeladen.

## Deployment

```bash
npm install
npm run build
npm run validate:dist
```

Dann den Inhalt von `dist/` so deployen, dass diese URLs funktionieren:

```text
https://eskyna.com/farbe/
https://eskyna.com/farbe/light_warm_soft/
```

Wichtig fuer PWA-Updates: Immer den kompletten Dist-Inhalt austauschen, besonders `sw.js`, `version.json`, `palette-app.js`, `i18n.js`, `palettes.js`, `styles.css` und alle geaenderten Assets. Browser koennen Service Worker aggressiv cachen; `version.json` und die Build-Version helfen der App, neue Versionen zu erkennen.

## Inhalte bearbeiten

- **Farben und Paletten:** `bin/generate` enthaelt die Rohdaten, `palettes.js` wird im Build daraus erzeugt.
- **Texte und Uebersetzungen:** `i18n.js` pflegt Deutsch, Englisch und Russisch zentral.
- **Farbnamen und Farberklaerungen:** `palette-app.js` enthaelt die Nuancierung der Farbnamen und die Zuordnung zu Erklaertexten aus `i18n.js`.
- **Layout und Branding:** `styles.css`, `assets/` und `templates/palette.html`.
- **PWA-Update-Logik:** `palette-app.js`, `sw.js`, `version.json` im Dist.

Nach jeder inhaltlichen Aenderung:

```bash
npm run check
```

## Dokumentation fuer Menschen und KI-Agenten

Startpunkte:

- [`AGENTS.md`](AGENTS.md) - verbindliche Arbeitsanweisung fuer KI-Agenten
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) - technische Architektur
- [`docs/CODE_MAP.md`](docs/CODE_MAP.md) - wo welche Aenderung gemacht wird
- [`docs/MAINTENANCE.md`](docs/MAINTENANCE.md) - Wartung von Farben, Texten und Assets
- [`docs/QUALITY_AND_CI.md`](docs/QUALITY_AND_CI.md) - Linting, Formatierung, CI und Dependabot
- [`docs/RELEASE_CHECKLIST.md`](docs/RELEASE_CHECKLIST.md) - Checkliste vor Deployment

## CI und Dependabot

Die GitHub Actions pruefen bei Pushes und Pull Requests:

1. Formatierung
2. Linting
3. Source-Validierung
4. Build
5. Dist-Validierung
6. Upload des generierten `dist/` als CI-Artefakt

Dependabot ist fuer npm-Abhaengigkeiten, Python-Dev-Abhaengigkeiten und GitHub Actions konfiguriert.

## Beitragen

Bitte zuerst [`CONTRIBUTING.md`](CONTRIBUTING.md) lesen und vor einem Pull Request lokal `npm run check` ausfuehren.

