# Wartung


## Akzeptanztests pflegen

Behave/Cucumber-Szenarien liegen unter `features/`. Sie bilden die wichtigsten Produktanforderungen ab, die Kundinnen direkt sehen oder die fuer die PWA-Qualitaet wichtig sind.

Regeln:

- Neue Anforderungen als Gherkin-Szenario festhalten.
- Sichtbare UI-Aenderungen in Portrait und Landscape abdecken, wenn sie Layout betreffen.
- Neue i18n-Texte immer fuer Deutsch, Englisch und Russisch pruefen.
- Farbcontent-Aenderungen mit den Szenarien in `features/requirements_color_guidance.feature` absichern.
- Vor Release `npm run test:bdd` oder direkt `npm run check` ausfuehren.


## Farbe-pruefen-Flow warten

Der Flow ist ein Kernfeature der App. Er besteht aus:

- Button `Farbe pruefen`
- Live-Scanner mit Zielkreis, sichtbarem Schliessen/Zurueck, schliessbarem Ergebnis und Bildfallback
- Lichtqualitaetsbewertung
- Sampling mehrerer Messpunkte im Kreis
- Lab/CIEDE2000-Vergleich gegen die aktive Farbkarte
- Prozentpassung, Helligkeit, Waerme, Klarheit
- drei naechste Farben aus dem Farbpass
- ehrlicher Unsicherheitsanzeige bei schlechtem Licht

Wartungsregeln:

- Keine sichtbaren technischen Messwerte wie Delta-E oder interne Abstaende anzeigen.
- Bei schlechten Bedingungen immer Vertrauen vor scheinbarer Praezision stellen: `Unsicher` ist besser als ein falsches Kaufurteil.
- Neue sichtbare Texte fuer `de`, `en`, `ru` pflegen.
- Nach Aenderungen `features/requirements_color_guidance.feature` und die Steps pruefen.

## Paletten bearbeiten

Die Paletten-Rohdaten liegen im Generator `bin/generate`. Jede Palette braucht:

- `id`
- `slug`
- `name`
- `grid` mit 6 Zeilen x 4 Farben
- `colors` mit denselben 24 Farben in derselben Reihenfolge

Nach Aenderungen:

```bash
npm run check
```

Die Behave/Cucumber-Suite prueft dabei auch, dass jede Palette 24 Farben hat und die generierten PWAs konsistent bleiben.

## Requirements nachziehen

Wenn aus Feedback eine neue Produktregel entsteht, ergaenze ein Gherkin-Szenario unter `features/`. Beispiele: neue Layout-Regel, anderer Buttontext, zusaetzliche Sprache, neues PWA-Verhalten oder strengere Anforderungen an Farberklaerungen.

## Farbnamen differenzieren

Kundinnen wundern sich, wenn mehrere Felder gleich heissen. Deshalb erzeugt `palette-app.js` pro Farbkarte nuancierte Namen. Beim Erweitern beachten:

- Namen sollen modisch und verstaendlich sein.
- Innerhalb einer Farbkarte moeglichst keine Duplikate.
- Beispiele: `Bordeaux`, `Merlot`, `Granatrot` statt viermal `Burgunderrot`.
- Keine Feldnummern nennen.
- Nach Aenderungen `npm run test:bdd` ausfuehren; die Suite prueft eindeutige Farbnamen innerhalb jeder Karte.

## Farb-Erklaerungen pflegen

Die Erklaerungen sollen zwei Dinge leisten:

1. konkrete Kombinationshilfe fuer Outfits
2. interessantes Stil-Allgemeinwissen aus der Modewelt

Gute Struktur:

- Farbname
- Wirkung des Tons
- kurzer Mode-/Materialfakt
- Kombinationshilfe mit Basisfarbe, dunklem Ton und Akzent

Alle sichtbaren Erklaertexte liegen in `i18n.js` unter `colorStories`. Behave prueft fuer alle 288 Farben, dass Name, Wirkung, Modefakt und Kombinationstipp vorhanden sind.

## Farbglossare pflegen

Jedes Farbfeld oeffnet eine detaillierte Glossarseite. Sie soll Kundinnen zeigen, wie viel in einer Farbe steckt: Temperatur, Helligkeit, Klarheit, Rolle im Farbpass, Materialwirkung, Kombinationslogik, Modewissen, Outfit-Rezept und Shopping-Feintuning.

Wartungsregeln:

- `getColorGlossary()` in `palette-app.js` ist die zentrale Logik.
- Sichtbare Glossartexte liegen in `i18n.js` unter `glossary` und muessen fuer `de`, `en` und `ru` gepflegt werden.
- Farbfamilien werden in `getColorGlossary()` gebuendelt. Neue Farbfamilien brauchen neue Texte unter `glossary.fashion`.
- Keine Feldnummern, internen Keys oder technischen Delta-Werte in der Kundinnenansicht zeigen.
- Glossarseiten sollen inspirierend, aber praktisch bleiben: Was macht der Ton, womit kombiniere ich ihn, worauf achte ich im Laden?
- Details zur Struktur stehen in `docs/COLOR_GLOSSARY.md`.

## Uebersetzungen pflegen

Unterstuetzt sind `de`, `en`, `ru`. Neue sichtbare Texte muessen fuer alle drei Sprachen ergaenzt werden. Fuer Tests kann die Sprache erzwungen werden:

```text
/farbe/hell_warm/?lang=en
/farbe/hell_warm/?lang=ru
```

## Kundinnen-Links pflegen

Personalisierte Links nutzen Query-Parameter:

```text
/farbe/hell_warm/?name=Melissa
/farbe/hell_warm/?kundin=Melissa
```

Der Name wird in `palette-app.js` gelesen, bereinigt, im Header angezeigt und pro Farbkarte in `localStorage` gespeichert. Sichtbare Texte wie `fuer`, `for` oder `для` liegen in `i18n.js` unter `ui.customerFor`, `ui.brandAriaFor` und `ui.pageTitleFor`.

Wartungsregeln:

- Keine Kundinnennamen in `manifest.webmanifest`, Service-Worker-Caches, Build-Artefakte oder Logs schreiben.
- Den Manifest-`id` pro Farbkarte stabil halten, damit Installations- und Update-Erkennung nicht durch Namen fragmentiert wird.
- Personalisierung muss auch ohne `localStorage` ausfallen koennen, ohne die Farbkarte zu blockieren.
- Landscape-Header mit `?name=Melissa&lang=de`, `?name=Melissa&lang=en` und `?name=Melissa&lang=ru` testen.

## Assets ersetzen

| Asset | Zweck |
| --- | --- |
| `assets/sign_gold.png` | klickbares ESKYNA Kleeblatt im Header |
| `assets/app-icon.png` | zentrales PWA-App-Icon fuer Uebersicht und alle Farbkarten |
| `assets/app-background.jpg` | App-Hintergrund |
| `assets/splash-portrait.jpg` | Splashscreen Hochkant |
| `assets/splash-landscape.jpg` | Splashscreen Landscape |
| `icons/*.png` | Referenz-Icons und vom Generator erzeugte Icon-Ziele; Manifeste verwenden das zentrale App-Icon |
| `images/*.png` | Referenzbild je Farbkarte |

Nach Asset-Aenderungen immer neu bauen. PWA-Caches koennen alte Bilder halten, besonders App-Icons und Manifestdateien; deshalb Dist komplett deployen. Der Build haelt Legacy-Icon-Pfade fuer gecachte Android-Manifeste bereit und erzeugt Apple-Touch-Icons in mehreren Groessen fuer iPhone/iPad. Bei Icon-Tests die installierte PWA ggf. entfernen und Chrome-Sitedaten fuer `/farbe/` leeren.

## PWA-Installationsbutton

Unter Android/Chrome wird `App installieren` nur angezeigt, wenn der Browser das `beforeinstallprompt`-Event ausloest und die App nicht standalone laeuft. Das ist je nach Browser unterschiedlich.

Auf iPhone/iPad wird kein nativer Installationsprompt ausgeloest. Dort darf die App den Button anzeigen, aber der Klick oeffnet nur die manuelle Safari-Anleitung: in Safari oeffnen, Teilen-Symbol, `Zum Home-Bildschirm hinzufuegen`, `Hinzufuegen`. Der iOS-Hinweis muss erhalten bleiben, weil viele Kundinnen Links aus Chrome, Instagram oder der Google-App oeffnen.

## Update-Button

`App aktualisieren` erscheint, wenn:

- ein neuer Service Worker im Waiting-State ist, oder
- `version.json` auf dem Server eine andere Version als die lokal laufende App meldet.

Bei Update-Problemen zuerst pruefen:

1. Wurde der komplette Dist-Inhalt hochgeladen?
2. Ist `version.json` erreichbar und nicht serverseitig gecacht?
3. Enthalten `version.json` und `sw.js` dieselbe neue Version?
4. Wurde die alte PWA komplett geschlossen und neu geoeffnet?


### Paletten umbenennen oder reduzieren

Die aktive Palettenliste ist das 12er-Modell in `bin/generate` und `palettes.js`. Neue Slugs muessen aus dem sichtbaren Namen ableitbar sein, zum Beispiel `hell warm` -> `hell_warm`. Wenn alte Kundinnenlinks weiter funktionieren sollen, die Zuordnung in `LEGACY_PALETTE_REDIRECTS` im Generator pflegen. Der Service Worker bekommt seine Paletten-URLs nicht mehr hart codiert, sondern ueber `__ESKYNA_PALETTE_SHELL__` aus dem Generator.
