# Beitragen

Danke fuer jede Verbesserung an ESKYNA Farbe.

## Lokale Vorbereitung

```bash
npm install
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

Bei sichtbaren Aenderungen bitte Screenshots oder eine kurze Beschreibung der Sichtpruefung in Portrait und Landscape ergaenzen.

## Coding-Regeln

- Sichtbare UI-Texte in `i18n.js` pflegen.
- Keine technischen Messwerte fuer Kundinnen anzeigen, wenn eine freundliche Styling-Einschaetzung reicht.
- `dist/` nicht manuell bearbeiten.
- Keine Tokens, API-Schluessel oder privaten Kundinnendaten committen.
- Neue Abhaengigkeiten nur mit klarem Nutzen.

