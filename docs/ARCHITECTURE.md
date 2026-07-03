# Architektur

## Zielbild

ESKYNA Farbe ist eine statische Web-App mit 24 installierbaren PWAs. Sie benoetigt keinen Serverprozess: Alle Dateien werden vorab generiert und koennen ueber einen normalen Webserver, GitHub Pages oder ein CDN ausgeliefert werden.

## Datenfluss

```text
bin/generate
  ├─ liest eingebettete Paletten-Rohdaten
  ├─ kopiert gemeinsame Assets
  ├─ erzeugt alle Manifest-Icons aus assets/app-icon.png
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
| `palette-app.js` | rendert Farbfelder, Farb-Erklaerung, Kamera-Farbcheck, Kundinnen-Personalisierung, Install-/Update-UI |
| `styles.css` | responsive App-Layout, Branding, Splashscreen, Vollbild-Farbansicht |
| `assets/app-icon.png` | zentrale Masterdatei fuer Homescreen-/Manifest-Icons aller Farbkarten |
| `sw.js` | Offline-Cache und Update-Mechanik |


## App-Icon-Modell

Alle installierbaren Farbkarten verwenden dasselbe zentrale ESKYNA-Farbe-App-Icon. Die Masterdatei liegt in `assets/app-icon.png` und wird im Build in die benoetigten Groessen fuer Manifest und Apple-Touch-Icon umgerechnet. Das verhindert, dass Kundinnen je Farbkarte unterschiedliche technische Icons sehen, und staerkt die Wiedererkennbarkeit der App.

Die Paletten-Manifeste verweisen direkt auf `icons/icon-192.png`, `icons/icon-512.png`, `icons/icon-maskable-192.png` und `icons/icon-maskable-512.png`. Die normalen Icons verwenden `purpose: any`, die Android-Icons `purpose: maskable`. Zusaetzlich erzeugt der Build Legacy-Icon-Pfade je Farbkarte, damit Android/Chrome auch dann installierbar bleibt, wenn ein Geraet noch ein aelteres Manifest im Cache hat.

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

## Kundinnen-Personalisierung

Farbkarten koennen mit einem Namen personalisiert gestartet werden, zum Beispiel:

```text
/farbe/light_warm_clear/?name=Melissa
```

Unterstuetzte Parameter sind `name`, `kundin`, `customer` und `client`. `palette-app.js` bereinigt den Namen, zeigt ihn im Header als `ESKYNA Farbe fuer Melissa` und speichert ihn pro Farbkarte in `localStorage`. Dadurch bleibt der Name innerhalb der installierten App sichtbar, auch wenn die PWA spaeter ueber die manifest-basierte `start_url` ohne Query-Parameter startet.

Wichtig fuer Datenschutz und PWA-Stabilitaet: Kundinnennamen gehoeren nicht in statische Manifeste, Cache-Namen, `id` oder `version.json`. Das Manifest bleibt pro Farbkarte stabil; die Personalisierung ist Laufzeit-Zustand im Browser.


## Executable Requirements

Die Requirements sind als Behave/Cucumber-Szenarien unter `features/` beschrieben. Die Step Definitions pruefen Quellen und generierten Dist-Build ohne externen Browser. Fuer browsernahe Frontend-Auswertungen nutzt `features/support/inspect-app.mjs` ein kleines DOM-Harness, damit Farbnamen, i18n und Farbgeschichten deterministisch getestet werden koennen.

## Sicherheits- und Datenschutzmodell

- Die Fotoanalyse laeuft lokal im Browser auf einem Canvas.
- Es wird kein Foto an einen Server hochgeladen.
- Der Telegram-Link oeffnet extern eine Stilfrage an Natalia.
- Es gibt keine API-Schluessel im Frontend.

