# ESKYNA Farben

Dieses Repo enthält die fertige statische Website und den Generator unter `bin/generate`.

## Direkt hochladen

Den generierten Inhalt ins Webroot oder GitHub-Pages-Artefakt legen, sodass diese URL funktioniert:

```text
https://eskyna.com/farbe/
```

Kundinnenlinks haben dieses Format:

```text
https://eskyna.com/farbe/light_warm_soft/
```

## Neu generieren

```bash
./bin/generate --output ./dist
```

Danach den Inhalt von `dist/` deployen.

## Eigene App-Icons pro Farbkarte

Der Generator ist bereits vorbereitet für ein eigenes Icon pro App. Lege die Dateien vor dem Generieren in den Ordner `icons/` im Bundle, zum Beispiel:

```text
icons/light_warm_soft.png
icons/light_cool_clear.png
icons/clear_warm_deep.png
```

Der Generator verlangt dabei für alle 24 Paletten ein eigenes Icon in `icons/`. Akzeptiert werden Dateinamen im Slug-Format wie `light_warm_soft.png` und die im Repo vorhandene Schreibweise mit Leerzeichen wie `light warm soft.png`. Fehlt eine Datei, bricht der Lauf ab.

## Struktur

```text
bin/generate                # Generator, ausführbar
icons/                      # Quell-Icons pro Palette, z. B. icons/light_warm_soft.png
dist/                       # fertige statische Website
dist/index.html             # Übersicht mit 24 Farbkarten
dist/<palette>/index.html   # einzelne installierbare PWA
```

Die wiederverwendeten Dateien liegen zentral in `dist/`; pro Farbkarte werden nur `index.html` und `manifest.webmanifest` erzeugt.
