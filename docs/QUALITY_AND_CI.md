# Qualitaet, Linting und CI

## Lokaler Qualitaetslauf

```bash
npm run check
```

Dieser Befehl fuehrt aus:

1. Format-Check mit projektinternem Whitespace-/Zeilenenden-Check
2. JavaScript-Syntaxcheck
3. CSS-Basislint
4. HTML-Basislint
5. Python-Syntaxcheck fuer Generator und Behave-Step-Definitions
6. Source-Validierung
7. Build
8. Dist-Validierung
9. Behave/Cucumber-Requirements-Tests

## Formatierung

```bash
npm run format
```

Normalisiert Zeilenenden, entfernt Trailing Whitespace und stellt finale Zeilenumbrueche sicher. Nicht bearbeitet werden Binaerdateien, `dist/`, `node_modules/` und grosse Assets.

Nach `npm install` stehen zusaetzlich optionale Standardwerkzeuge bereit:

```bash
npm run format:prettier
npm run lint:eslint
npm run lint:stylelint
npm run lint:htmlhint
```

## Behave/Cucumber-Requirements

Die Gherkin-Szenarien liegen unter `features/requirements_*.feature`. Sie dokumentieren und pruefen die Anforderungen, die waehrend der Produktentwicklung entstanden sind:

- 24 vollstaendige Farbkarten mit je 24 Farben
- responsive Rasterung: Portrait 4 x 6, Landscape 6 x 4
- kompakter einzeiliger Landscape-Header
- lesbare Bottom-Buttons bei drei Aktionen
- ESKYNA Branding, klickbares Kleeblatt, Splashscreen mit Versionszeile und Hintergrundbild
- PWA-Installation nur bei Browser-Prompt und Update-Hinweis bei neuer Version
- Deutsch, Englisch und Russisch inklusive Palettennamen
- personalisierte Kundinnen-Links ohne personenbezogene Manifestdaten
- Farberklaerungen fuer alle 576 Farbfelder
- eindeutige Farbnamen innerhalb jeder Farbkarte
- Premium-Scan-Flow mit Live-Kamera/Bildfallback, Lichtqualitaet, mehreren Messpunkten, Prozentpassung, Helligkeit/Waerme/Klarheit, drei naechsten Farbpass-Toenen und ehrlicher Unsicherheit
- kundinnentaugliche Farbpruefung ohne sichtbare technische Abstandswerte
- CI, Dependabot und Agenten-Dokumentation

Direktlauf nach einem Build:

```bash
npm run build
npm run test:bdd
```

Build plus BDD in einem Schritt:

```bash
npm run test:bdd:build
```

Lesbare Ausgabe fuer Review oder Debugging:

```bash
npm run test:bdd:pretty
```

Die Step Definitions liegen in `features/steps/requirements_steps.py`. `features/support/inspect-app.mjs` startet eine kleine statische Browser-Harness, um echte Frontend-Funktionen aus `i18n.js`, `palettes.js` und `palette-app.js` auszuwerten.

Neue Produktanforderungen sollen als Gherkin-Szenario ergaenzt werden, bevor oder waehrend die Implementierung angepasst wird.

## Validierungs-Skripte

### `scripts/validate-source.mjs`

Prueft unter anderem:

- alle Pflichtdateien vorhanden
- genau 24 Paletten
- je Palette 24 Farben
- Quell-Grid mit 6 Zeilen x 4 Farben
- gueltige Hex-Farben
- Quell-Icons und Referenzbilder vorhanden
- keine Feldnummern in der UI
- Personalisierungs-Hooks fuer Kundinnen-Links
- Scan-Flow-Hooks fuer Lichtqualitaet, mehrere Messpunkte, drei naechste Farbpass-Toene und Splashscreen-Version
- Basis-i18n fuer Deutsch, Englisch, Russisch
- Behave/Cucumber-Teststruktur und `test:bdd`-Skript vorhanden

### `scripts/validate-dist.mjs`

Prueft unter anderem:

- Dist-Pflichtdateien
- `version.json`
- `sw.js` enthaelt Build-Version
- keine Template-Platzhalter im Dist
- je Palette `index.html`, Manifest und Icons vorhanden
- Personalisierungsplatz im generierten Paletten-HTML vorhanden
- Splashscreen-Version und Live-Scanner im generierten HTML vorhanden

## GitHub Actions

`.github/workflows/ci.yml` laeuft bei Pushes, Pull Requests und manuell. Der Workflow installiert npm- und Python-Dev-Werkzeuge und fuehrt `npm run check` aus. Dadurch laufen Format, Linting, Source-Validierung, Build, Dist-Validierung und Behave/Cucumber in einem Quality Gate. Anschliessend wird der generierte `dist/` als Artefakt hochgeladen.

`.github/workflows/pages.yml` baut ebenfalls mit `npm run check`, bevor ein GitHub-Pages-Artefakt erzeugt wird.

## Dependabot

`.github/dependabot.yml` aktualisiert:

- npm-Abhaengigkeiten
- Python-Dev-Abhaengigkeiten aus `requirements-dev.txt`
- GitHub Actions

Empfehlung: Dependabot-PRs einzeln mergen und nach jedem Update pruefen, ob `npm run check` weiter gruen ist.

## Pull-Request-Qualitaet

Ein PR sollte enthalten:

- kurze Beschreibung der Aenderung
- betroffene Dateien/Bereiche
- Ergebnis von `npm run check`
- Screenshots bei sichtbaren UI-Aenderungen
- Hinweis, ob ein kompletter Dist-Deploy noetig ist

