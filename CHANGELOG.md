# Changelog

Alle nennenswerten Aenderungen an diesem Projekt werden hier dokumentiert.

## Unreleased

- iPhone/iPad-Installation robuster gemacht: Apple-Touch-Icons in mehreren Groessen, iOS-Standalone-Metadaten und eine eigene Safari-Installationsanleitung mit Link-kopieren-Funktion ergaenzt.
- Android/PWA-Installierbarkeit nach dem App-Icon-Update stabilisiert: Manifeste nutzen jetzt getrennte `any`- und `maskable`-Icons, HTML-Manifest-Links bekommen eine Build-Version und Legacy-Icon-Pfade bleiben fuer gecachte Android-Manifeste erhalten.

- Zentrales ESKYNA-Farbe-App-Icon mit Kleeblatt, Schriftzug und Farbfächer als `assets/app-icon.png` eingebunden; alle Paletten-Manifeste verwenden daraus generierte 192px- und 512px-Icons.
- Validierung, Behave/Cucumber-Requirement und Dokumentation fuer das neue App-Icon ergaenzt.
- Detaillierte Farbglossarseiten fuer alle Farben ergaenzt: Farbprofil, Rolle im Farbpass, Modewissen, Materialwirkung, Outfit-Rezept, Shopping-Feintuning und kompakte Farbwerte in Deutsch, Englisch und Russisch.
- Dokumentation und Behave/Cucumber-Requirements fuer Farbglossare ergaenzt.
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

