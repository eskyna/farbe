# ADR 0001: Statischer Generator statt Server-App

## Status

Akzeptiert

## Kontext

Die Farbkarten muessen schnell laden, installierbar sein und ohne Backend funktionieren. Kundinnen sollen direkte Links zu ihrer Farbkarte erhalten. Die App soll einfach auf `eskyna.com/farbe/` deploybar sein.

## Entscheidung

Das Projekt bleibt eine statische Website mit Generator:

- Quellen im Repo
- `bin/generate` erzeugt `dist/`
- `dist/` wird als statischer Inhalt deployt
- PWA-Logik laeuft komplett im Browser

## Konsequenzen

Vorteile:

- sehr einfaches Hosting
- keine Serverkosten fuer App-Logik
- schnelle Ladezeiten
- gute Offline-Faehigkeit durch Service Worker
- keine Foto-Uploads noetig

Nachteile:

- Aenderungen brauchen immer einen neuen Build und Deploy
- Service-Worker-Caching muss sorgfaeltig versioniert werden
- dynamische Backend-Funktionen muessten spaeter separat ergaenzt werden

