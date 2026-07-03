# Changelog

Alle nennenswerten Aenderungen an diesem Projekt werden hier dokumentiert.

## Unreleased

- Live-Farberkennung und Scan-Ergebnis koennen jetzt sichtbar ueber `Schliessen`, `Zur Farbkarte zurueck`, Escape oder Hintergrund-Tipp beendet werden; Kamera-Starts werden sauber abgebrochen und Vorschau/Resultat verschwinden beim Zurueckkehren zur Farbkarte.
- Splashscreen zeigt unten klein die generierte App-Version.
- `Farbe pruefen` zum Premium-Scan-Flow erweitert: Live-Kamera mit Zielkreis, Bildfallback, Lichtqualitaet, mehrere Messpunkte, Prozentpassung, Helligkeit/Waerme/Klarheit, ehrliche Unsicherheitsanzeige und drei naechste Farbpass-Toene.
- Behave/Cucumber-Requirements und Validierung fuer den neuen Scan-Flow ergaenzt.
- Behave/Cucumber-Requirements hinzugefuegt, inklusive Tests fuer Layout, Branding, PWA-Install/Update, Personalisierung, i18n und Farberklaerungen.
- `npm run test:bdd` und CI-Schritt fuer executable Requirements ergaenzt.
- Landscape-Header nochmals verdichtet: Logo, `ESKYNA Farbe`, optionaler Kundinnenname und Palettenname bleiben in einer Zeile.
- Personalisierte Kundinnen-Links hinzugefuegt, z. B. `?name=Melissa`; der Name bleibt innerhalb der installierten Farbkarte sichtbar.
- Dokumentation und Validierung fuer die neue Personalisierung ergaenzt.
- Projekt professionalisiert: README, Agenten-Dokumentation, Architektur-/Wartungsdocs.
- Linting, Formatierung, Source-/Dist-Validierung und CI hinzugefuegt.
- Dependabot fuer npm, Python-Dev-Abhaengigkeiten und GitHub Actions konfiguriert.

