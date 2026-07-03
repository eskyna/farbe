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
5. Python-Syntaxcheck fuer den Generator
6. Source-Validierung
7. Build
8. Dist-Validierung

## Formatierung

```bash
npm run format
```

Normalisiert Zeilenenden, entfernt Trailing Whitespace und stellt finale Zeilenumbrueche sicher. Nicht bearbeitet werden Binärdateien, `dist/`, `node_modules/` und grosse Assets.

Nach `npm install` stehen zusaetzlich optionale Standardwerkzeuge bereit:

```bash
npm run format:prettier
npm run lint:eslint
npm run lint:stylelint
npm run lint:htmlhint
```

## Validierungs-Skripte

### `scripts/validate-source.mjs`

Prueft unter anderem:

- alle Pflichtdateien vorhanden
- genau 24 Paletten
- je Palette 24 Farben
- Grid 6 x 4 im Quellmodell
- gueltige Hex-Farben
- Quell-Icons und Referenzbilder vorhanden
- keine Feldnummern in der UI
- Basis-i18n fuer Deutsch, Englisch, Russisch

### `scripts/validate-dist.mjs`

Prueft unter anderem:

- Dist-Pflichtdateien
- `version.json`
- `sw.js` enthaelt Build-Version
- keine Template-Platzhalter im Dist
- je Palette `index.html`, Manifest und Icons vorhanden

## GitHub Actions

`.github/workflows/ci.yml` laeuft bei Pushes, Pull Requests und manuell. Der Workflow installiert die Dev-Werkzeuge, fuehrt den Qualitaetslauf aus, prueft den Generator zusaetzlich mit Ruff, baut das Projekt und laedt den generierten `dist/` als Artefakt hoch.

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

