# Release-Checkliste

Vor dem Deployment:

- [ ] `npm install` erfolgreich
- [ ] `npm run check` erfolgreich
- [ ] Sichtpruefung Portrait
- [ ] Sichtpruefung Landscape
- [ ] Sprache Deutsch getestet
- [ ] Sprache Englisch mit `?lang=en` getestet
- [ ] Sprache Russisch mit `?lang=ru` getestet
- [ ] `Farbe pruefen` funktioniert auf einem Mobilgeraet
- [ ] Vollbild-Farbansicht zeigt Farbnamen, Stilwissen und Kombinationshilfe
- [ ] Installationsbutton erscheint nur, wenn Installation angeboten wird
- [ ] Update-Button erscheint bei neuer Version oder wartendem Service Worker
- [ ] `dist/version.json` ist erreichbar
- [ ] kompletter Inhalt von `dist/` wird deployt

Nach dem Deployment:

- [ ] `https://eskyna.com/farbe/` oeffnet die Uebersicht
- [ ] eine Beispiel-Palette oeffnet direkt, z. B. `/farbe/light_warm_soft/`
- [ ] Service Worker ist aktiv
- [ ] Manifest wird geladen
- [ ] Icons werden geladen
- [ ] Keine alten Assets sichtbar

