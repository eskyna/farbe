# Architektur

## Zielbild

ESKYNA Farbe ist eine statische Web-App mit 24 installierbaren PWAs. Sie benoetigt keinen Serverprozess: Alle Dateien werden vorab generiert und koennen ueber einen normalen Webserver, GitHub Pages oder ein CDN ausgeliefert werden.

## Datenfluss

```text
bin/generate
  ├─ liest eingebettete Paletten-Rohdaten
  ├─ kopiert gemeinsame Assets
  ├─ erzeugt palettes.js
  ├─ erzeugt version.json
  ├─ erzeugt pro Palette index.html + manifest.webmanifest
  └─ erzeugt Dist-README

Browser
  ├─ index.html + overview.js zeigen 24 Farbkarten
  └─ <palette>/index.html + palette-app.js zeigen eine Farbkarte als PWA
```

## Runtime-Bausteine

| Baustein | Aufgabe |
| --- | --- |
| `i18n.js` | Sprachwahl nach `?lang=`, Browser-/Handysprache, Fallback Deutsch |
| `palettes.js` | zentrale Palette-Daten fuer Uebersicht und einzelne PWA |
| `overview.js` | rendert die Auswahlseite der 24 Farbkarten |
| `palette-app.js` | rendert Farbfelder, Farb-Erklaerung, Kamera-Farbcheck, Install-/Update-UI |
| `styles.css` | responsive App-Layout, Branding, Splashscreen, Vollbild-Farbansicht |
| `sw.js` | Offline-Cache und Update-Mechanik |

## PWA-Update-Modell

Der Build erzeugt eine eindeutige Version. Diese Version steckt in:

- `version.json`
- `sw.js`
- ersetzten Platzhaltern in `palette-app.js`

Die App prueft regelmaessig:

1. Gibt es einen wartenden neuen Service Worker?
2. Weicht `version.json` auf dem Server von der lokalen Build-Version ab?

Wenn ja, erscheint `App aktualisieren`. Beim Klick werden alte ESKYNA-Caches geloescht oder der wartende Service Worker aktiviert und die Seite neu geladen.

## Responsive Layout

- Portrait: Farbfelder bleiben 4 breit und 6 hoch.
- Landscape: Farbfelder werden 6 breit und 4 hoch dargestellt.
- Landscape-Header: Kleeblatt, `ESKYNA Farbe` und Palettenname stehen in einer Zeile, damit die Farbkarte mehr Hoehe bekommt.

## Sprachmodell

Unterstuetzt werden:

- Deutsch (`de`)
- Englisch (`en`)
- Russisch (`ru`)

Prioritaet:

1. Query-Parameter `?lang=de|en|ru`
2. `navigator.languages`
3. `navigator.language`
4. Fallback `de`

## Sicherheits- und Datenschutzmodell

- Die Fotoanalyse laeuft lokal im Browser auf einem Canvas.
- Es wird kein Foto an einen Server hochgeladen.
- Der Telegram-Link oeffnet extern eine Stilfrage an Natalia.
- Es gibt keine API-Schluessel im Frontend.

