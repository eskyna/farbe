# Farbglossar

Die Farbkarten sollen Kundinnen zeigen, dass ein Farbton mehr ist als ein Hexwert. Jede Farbe im Farbpass oeffnet deshalb eine Glossarseite. Diese Seite ist bewusst emotional, modisch und praktisch aufgebaut: Sie erklaert Wirkung, Kombination und Einkaufssicherheit, ohne interne Feldnummern oder technische Distanzwerte zu zeigen.

## Informationsarchitektur einer Glossarseite

Eine gute Glossarseite beantwortet sieben Fragen:

1. **Wie heisst der Ton?**
   Ein modischer, differenzierter Farbname hilft Kundinnen, sich den Ton zu merken und ihn beim Shopping wiederzuerkennen.

2. **Wie wirkt der Ton?**
   Das Farbprofil beschreibt Temperatur, Helligkeit, Klarheit und Rolle im Farbpass. Diese Begriffe sind bewusst kundinnentauglich formuliert.

3. **Welche Rolle spielt der Ton im Farbpass?**
   Eine Farbe kann Lichtgeber, Tiefengeber, Basisfarbe, Akzentfarbe oder Verbindungston sein. Diese Rolle erklaert, ob sie grossflaechig, nah am Gesicht, als Rahmen oder eher als Detail getragen werden sollte.

4. **Welches Stilwissen steckt darin?**
   Jede Farbe bekommt Modewissen: zum Beispiel warum Rot schnell Blickfokus erzeugt, warum Neutrals wie eine Buehne wirken oder warum Gruen je nach Material ruhig, natuerlich oder luxurioes erscheinen kann.

5. **Wie kombiniere ich die Farbe?**
   Die Glossarseite verbindet den individuellen Farbton mit der jeweiligen Palette und gibt konkrete Kombinationslogik fuer warme, kuehle, helle, tiefe, klare oder sanfte Farbkarten.

6. **Welche Materialien veraendern die Wirkung?**
   Farbe wirkt in Seide, Wolle, Leder, Leinen, Samt oder glatten Stoffen unterschiedlich. Diese Materialhinweise sollen zeigen, warum ein Ton im Laden gut aussehen kann, aber in einem anderen Stoff ploetzlich nicht mehr.

7. **Wie shoppe ich sicherer?**
   Die Seite nennt Feintuning-Hinweise: zu grau, zu gelb, zu neonhaft, zu ausgewaschen oder zu fast-schwarz. Dadurch entsteht Kaufberatung statt reiner Farbanzeige.

## Umsetzung im Code

- `palette-app.js` erzeugt die Glossarseite dynamisch mit `getColorGlossary()`.
- `describeColor()` liefert den differenzierten Farbnamen.
- `getColorStory()` liefert Grundwirkung, Modefakt und Kombinationshilfe aus `i18n.js`.
- `getColorGlossary()` ergaenzt Farbprofil, Farbpass-Rolle, Materialwirkung, Outfit-Rezept, Shopping-Feintuning und kompaktes Farbprofil.
- `i18n.js` enthaelt die sichtbaren Glossartexte in Deutsch, Englisch und Russisch.
- `styles.css` gestaltet die Glossarseite als hochwertige Vollbildkarte mit Profil-Pills und lesbaren Abschnitten.

## Wartungsregeln

- Keine Feldnummern anzeigen oder erwaehnen.
- Keine technischen Delta-E-Abstaende in der Glossarseite zeigen.
- Neue sichtbare Texte immer fuer `de`, `en` und `ru` pflegen.
- Der Ton soll Kundinnen beim Kombinieren und Kaufen helfen, nicht nur benannt werden.
- Modewissen darf inspirierend sein, muss aber kurz, verstaendlich und stylingnah bleiben.
- Bei neuen Farbfamilien `getColorGlossary()` und die Texte unter `glossary.fashion` in allen Sprachen erweitern.

## Akzeptanzkriterien

Die Behave/Cucumber-Suite prueft, dass jede der 288 Farben eine Glossarseite mit Farbprofil, Rolle, Material, Kombination, Shopping-Hilfe und Modewissen hat. Die Source-Validierung prueft zusaetzlich, dass Glossar-Logik, Profil-Stile und Uebersetzungs-Keys vorhanden sind.
