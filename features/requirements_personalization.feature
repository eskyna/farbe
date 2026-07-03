Feature: Personalisierte Kundinnen-Links
  Natalia soll Kundinnen Links schicken koennen, die ihren Namen in der App sichtbar machen.

  Background:
    Given das Projekt wurde geladen
    And der Dist-Build existiert

  Scenario: Kundinnenname erscheint im Header und bleibt lokal erhalten
    Then das Template enthaelt einen Platzhalter fuer Kundinnennamen im Header
    And die URL-Parameter fuer Kundinnennamen sind unterstuetzt
    And der Kundinnenname wird bereinigt und lokal pro Farbkarte gespeichert
    And keine Kundinnennamen werden in Manifest oder version.json geschrieben

  Scenario: Das Kleeblatt verlinkt auf ESKYNA
    Then das Kleeblatt-Logo im Palette-Template ist mit "https://eskyna.com" verlinkt

