Feature: PWA-Installation, Update und Branding
  Die App soll installierbar sein, Updates anbieten und den ESKYNA-Stil konsequent nutzen.

  Background:
    Given das Projekt wurde geladen
    And der Dist-Build existiert

  Scenario: Installationsbutton erscheint nur wenn die App installierbar ist
    Then der Installationsbutton ist im Template versteckt
    And der Runtime-Code zeigt den Installationsbutton nur nach dem Browser-Installationsereignis
    And der Runtime-Code entfernt den Installationsbutton nach Installation oder Updatezustand
    And der alte Installationshinweistext ist entfernt

  Scenario: Kundinnen koennen neue Versionen aktiv installieren
    Then der Dist-Build enthaelt eine Version
    And Service Worker und version.json verwenden dieselbe Version
    And der Runtime-Code prueft version.json und den Service Worker auf Updates
    And der Updatebutton ist im Template versteckt bis eine neue Version erkannt wird

  Scenario: ESKYNA Branding und Splashscreen sind verdrahtet
    Then die App nutzt das textile Hintergrundbild
    And der Splashscreen nutzt Hochkant- und Landscape-Bild
    And die Buttons verwenden Montserrat und ESKYNA-Stilelemente

