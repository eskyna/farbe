# ESKYNA Farben

Dieses ZIP enthält die fertige statische Website unter `farbe/` und den Generator unter `bin/generate`.

## Direkt hochladen

Den Ordner `farbe/` in das Webroot von `eskyna.com` legen, sodass diese URL funktioniert:

```text
https://eskyna.com/farbe/
```

Kundinnenlinks haben dieses Format:

```text
https://eskyna.com/farbe/light_warm_soft/
```

## Neu generieren

```bash
./bin/generate --output ./dist --base-path /farbe/ --zip
```

Danach den Ordner `dist/farbe/` hochladen.

## Eigene App-Icons pro Farbkarte

Der Generator ist bereits vorbereitet für ein eigenes Icon pro App. Lege die Dateien vor dem Generieren in den Ordner `icons/` im Bundle, zum Beispiel:

```text
icons/light_warm_soft.png
icons/light_cool_clear.png
icons/clear_warm_deep.png
```

Dann generieren:

```bash
./bin/generate --output ./dist --base-path /farbe/ --palette-icons ./icons --zip
```

Optional streng prüfen, dass wirklich alle 24 Icons vorhanden sind:

```bash
./bin/generate --output ./dist --base-path /farbe/ --palette-icons ./icons --require-palette-icons --zip
```

Jede Palettenseite bekommt dadurch ihr eigenes Manifest-Icon, z. B. `ESKYNA - light warm soft` mit dem Icon aus `icons/light_warm_soft.png`. Fehlt eine Icon-Datei, nutzt der Generator automatisch das ESKYNA-Symbol als Fallback.

## Struktur

```text
bin/generate                # Generator, ausführbar
icons/                      # Quell-Icons pro Palette, z. B. icons/light_warm_soft.png
farbe/                      # fertige statische Website
farbe/index.html            # Übersicht mit 24 Farbkarten
farbe/<palette>/index.html  # einzelne installierbare PWA
```

Die wiederverwendeten Dateien liegen zentral in `farbe/`; pro Farbkarte werden nur `index.html` und `manifest.webmanifest` erzeugt.
