# Wartung


## Akzeptanztests pflegen

Behave/Cucumber-Szenarien liegen unter `features/`. Sie bilden die wichtigsten Produktanforderungen ab, die Kundinnen direkt sehen oder die fuer die PWA-Qualitaet wichtig sind.

Regeln:

- Neue Anforderungen als Gherkin-Szenario festhalten.
- Sichtbare UI-Aenderungen in Portrait und Landscape abdecken, wenn sie Layout betreffen.
- Neue i18n-Texte immer fuer Deutsch, Englisch und Russisch pruefen.
- Farbcontent-Aenderungen mit den Szenarien in `features/requirements_color_guidance.feature` absichern.
- Vor Release `npm run test:bdd` oder direkt `npm run check` ausfuehren.

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

Alle sichtbaren Erklaertexte liegen in `i18n.js` unter `colorStories`. Behave prueft fuer alle 576 Farben, dass Name, Wirkung, Modefakt und Kombinationstipp vorhanden sind.

## Uebersetzungen pflegen

Unterstuetzt sind `de`, `en`, `ru`. Neue sichtbare Texte muessen fuer alle drei Sprachen ergaenzt werden. Fuer Tests kann die Sprache erzwungen werden:

```text
/farbe/light_warm_clear/?lang=en
/farbe/light_warm_clear/?lang=ru
```

## Kundinnen-Links pflegen

Personalisierte Links nutzen Query-Parameter:

```text
/farbe/light_warm_clear/?name=Melissa
/farbe/light_warm_clear/?kundin=Melissa
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
| `assets/app-background.jpg` | App-Hintergrund |
| `assets/splash-portrait.jpg` | Splashscreen Hochkant |
| `assets/splash-landscape.jpg` | Splashscreen Landscape |
| `icons/*.png` | App-Icon je Farbkarte |
| `images/*.png` | Referenzbild je Farbkarte |

Nach Asset-Aenderungen immer neu bauen. PWA-Caches koennen alte Bilder halten, deshalb Dist komplett deployen.

## PWA-Installationsbutton

`App installieren` wird nur angezeigt, wenn der Browser das `beforeinstallprompt`-Event ausloest und die App nicht standalone laeuft. Das ist je nach Browser unterschiedlich. Der Button darf nicht dauerhaft sichtbar sein.

## Update-Button

`App aktualisieren` erscheint, wenn:

- ein neuer Service Worker im Waiting-State ist, oder
- `version.json` auf dem Server eine andere Version als die lokal laufende App meldet.

Bei Update-Problemen zuerst pruefen:

1. Wurde der komplette Dist-Inhalt hochgeladen?
2. Ist `version.json` erreichbar und nicht serverseitig gecacht?
3. Enthalten `version.json` und `sw.js` dieselbe neue Version?
4. Wurde die alte PWA komplett geschlossen und neu geoeffnet?

