# ESKYNA Farben PWAs

Dieses Verzeichnis wurde automatisch generiert.

Upload: Den Inhalt dieses Verzeichnisses ins Webroot oder GitHub-Pages-Artefakt hochladen, sodass diese URL funktioniert:

- https://eskyna.com__BASE_PATH__

Beispiel-Kundinnenlink:

- https://eskyna.com__BASE_PATH__light_warm_soft/
- https://eskyna.com__BASE_PATH__light_warm_soft/?name=Melissa

Personalisierte Links koennen `?name=Melissa` oder `?kundin=Melissa` nutzen. Der Name bleibt innerhalb der installierten Farbkarte sichtbar, sofern die Kundin die Website-Daten nicht loescht.

Auf der Übersichtsseite stehen nur die 24 Farbkarten zur Auswahl. Jede Unterseite zeigt genau eine Farbkarte ohne Umschalten und ist durch ihr eigenes Manifest installierbar.

Alle wiederverwendeten Dateien liegen nur einmal zentral im Root dieses Verzeichnisses:

- styles.css
- palettes.js
- overview.js
- palette-app.js
- sw.js
- assets/sign_gold.png
- icons/*

Jede Farbkarte hat ein eigenes App-Icon. Lege vor dem Generieren die PNG-Dateien unter `./icons/<slug>.png` ab, z. B. `./icons/light_warm_soft.png`. Alternativ funktionieren auch Dateinamen mit Leerzeichen wie `./icons/light warm soft.png`. Der Generator erzeugt daraus automatisch die Manifest-Icons `192x192`, `512x512` und das iOS-Icon. Fehlt eine Datei, bricht der Lauf ab.

Pro Farbkarte werden nur `index.html` und `manifest.webmanifest` generiert.

Hinweis: Kamera und PWA-Installation funktionieren auf Mobilgeräten nur zuverlässig mit HTTPS.

