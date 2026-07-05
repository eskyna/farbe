Feature: PWA-Installation, Update und Branding
  Die App soll installierbar sein, Updates anbieten und den ESKYNA-Stil konsequent nutzen.

  Background:
    Given das Projekt wurde geladen
    And der Dist-Build existiert

  Scenario: Installation ist fuer Android und iPhone/iPad verstaendlich verdrahtet
    Then der Installationsbutton ist im Template versteckt
    And der Runtime-Code zeigt die Android-Installation nur nach dem Browser-Installationsereignis
    And iPhone und iPad erhalten eine manuelle Safari-Installationsanleitung
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
    And der Splashscreen zeigt die App-Version in der untersten Zeile
    And das installierbare App-Icon nutzt ESKYNA Farbe, Palette und Kleeblatt
    And die Buttons verwenden Montserrat und ESKYNA-Stilelemente

