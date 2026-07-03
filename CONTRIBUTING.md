# Beitragen

Danke fuer jede Verbesserung an ESKYNA Farbe.

## Lokale Vorbereitung

```bash
npm install
python3 -m pip install -r requirements-dev.txt
npm run check
```

## Branches

Bitte fuer jede Aenderung einen eigenen Branch verwenden:

```bash
git checkout -b feature/kurze-beschreibung
```

## Vor einem Pull Request

```bash
npm run format
npm run check
```

Bei sichtbaren Aenderungen bitte Screenshots oder eine kurze Beschreibung der Sichtpruefung in Portrait und Landscape ergaenzen. Bei neuen oder geaenderten Produktanforderungen bitte ein passendes Behave/Cucumber-Szenario unter `features/requirements_*.feature` ergaenzen oder anpassen.

## Coding-Regeln

- Sichtbare UI-Texte in `i18n.js` pflegen.
- Keine technischen Messwerte fuer Kundinnen anzeigen, wenn eine freundliche Styling-Einschaetzung reicht.
- `dist/` nicht manuell bearbeiten.
- Keine Tokens, API-Schluessel oder privaten Kundinnendaten committen.
- Neue Abhaengigkeiten nur mit klarem Nutzen.
- Neue fachliche Anforderungen mit Behave/Cucumber-Szenarien absichern.
- Requirement-Aenderungen muessen in den BDD-Szenarien nachvollziehbar bleiben, damit Menschen und KI-Agenten sie spaeter sicher pruefen koennen.

